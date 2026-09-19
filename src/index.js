const DEFAULT_PAGE_ID = "61550663527060";
const DEFAULT_GRAPH_VERSION = "v25.0";
const FEED_LIMIT = "6";

function jsonResponse(payload, status, cacheControl = "no-store") {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Cache-Control": cacheControl,
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function isAllowedFacebookUrl(value, allowedImage = false) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    const hostname = url.hostname.toLowerCase();
    if (allowedImage) {
      return hostname === "facebook.com" || hostname.endsWith(".facebook.com") || hostname === "fbcdn.net" || hostname.endsWith(".fbcdn.net") || hostname === "fbsbx.com" || hostname.endsWith(".fbsbx.com");
    }
    return hostname === "facebook.com" || hostname === "www.facebook.com" || hostname === "m.facebook.com";
  } catch {
    return false;
  }
}

function getPostImage(post) {
  const attachment = post.attachments?.data?.[0];
  const nestedAttachment = attachment?.subattachments?.data?.[0];
  const candidates = [
    post.full_picture,
    attachment?.media?.image?.src,
    nestedAttachment?.media?.image?.src,
  ];
  return candidates.find((value) => typeof value === "string" && isAllowedFacebookUrl(value, true)) || null;
}

function normalizePost(post, pageUrl) {
  const permalinkUrl = isAllowedFacebookUrl(post.permalink_url) ? post.permalink_url : pageUrl;
  return {
    id: typeof post.id === "string" ? post.id : "",
    message: typeof post.message === "string" && post.message.trim() ? post.message.trim() : "See the latest BIGG DOGG update on Facebook.",
    createdTime: typeof post.created_time === "string" ? post.created_time : null,
    permalinkUrl,
    imageUrl: getPostImage(post),
  };
}

async function handleFacebookFeed(request, env, ctx) {
  if (request.method !== "GET") {
    return jsonResponse({ ok: false, error: "Method not allowed." }, 405);
  }

  const pageId = env.FACEBOOK_PAGE_ID || DEFAULT_PAGE_ID;
  const pageUrl = "https://www.facebook.com/people/BIGG-DOGG/61550663527060/";
  const accessToken = env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!accessToken) {
    return jsonResponse({ ok: false, configured: false, error: "Facebook feed is not configured yet." }, 200);
  }

  const cacheKey = new Request(new URL("/api/facebook-feed", request.url).toString(), { method: "GET" });
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const graphVersion = env.FACEBOOK_GRAPH_VERSION || DEFAULT_GRAPH_VERSION;
    const fields = "id,message,created_time,permalink_url,full_picture,attachments{media{image{src}},subattachments{media{image{src}}}}";
    const params = new URLSearchParams({
      access_token: accessToken,
      fields,
      limit: FEED_LIMIT,
    });
    const graphResponse = await fetch(`https://graph.facebook.com/${graphVersion}/${encodeURIComponent(pageId)}/posts?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });
    const graphPayload = await graphResponse.json();

    if (!graphResponse.ok || graphPayload.error) {
      console.error(JSON.stringify({
        event: "facebook_feed_error",
        status: graphResponse.status,
        code: graphPayload.error?.code || null,
        message: graphPayload.error?.message || "Unknown Graph API error",
      }));
      return jsonResponse({ ok: false, configured: true, error: "Facebook posts are temporarily unavailable." }, 502);
    }

    const posts = Array.isArray(graphPayload.data)
      ? graphPayload.data.map((post) => normalizePost(post, pageUrl)).filter((post) => post.id).slice(0, 6)
      : [];
    const response = jsonResponse({ ok: true, posts, updatedAt: new Date().toISOString() }, 200, "public, max-age=300, s-maxage=900");
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (error) {
    console.error(JSON.stringify({ event: "facebook_feed_exception", message: error instanceof Error ? error.message : "Unknown error" }));
    return jsonResponse({ ok: false, configured: true, error: "Facebook posts are temporarily unavailable." }, 502);
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/facebook-feed") {
      return handleFacebookFeed(request, env, ctx);
    }
    return env.ASSETS.fetch(request);
  },
};
