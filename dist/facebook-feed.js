(() => {
  const root = document.querySelector("[data-facebook-feed]");
  if (!root) return;

  const pageUrl = root.dataset.facebookPageUrl;

  function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", year: "numeric" }).format(date);
  }

  function linkToFacebook() {
    const link = document.createElement("a");
    link.href = pageUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "See the latest updates on Facebook ↗";
    return link;
  }

  function renderFallback(message) {
    const status = document.createElement("p");
    status.className = "feed-status";
    status.textContent = message;
    status.append(document.createElement("br"), linkToFacebook());
    root.replaceChildren(status);
  }

  function renderPosts(posts) {
    if (!Array.isArray(posts) || posts.length === 0) {
      renderFallback("The latest updates are on the BIGG DOGG Facebook Page.");
      return;
    }

    const list = document.createElement("div");
    list.className = "feed-posts";
    posts.forEach((post) => {
      const article = document.createElement("article");
      article.className = "feed-post";

      if (post.imageUrl) {
        const image = document.createElement("img");
        image.className = "feed-post-image";
        image.src = post.imageUrl;
        image.alt = "BIGG DOGG Facebook post";
        image.loading = "lazy";
        image.referrerPolicy = "no-referrer";
        article.append(image);
      }

      const copy = document.createElement("div");
      copy.className = "feed-post-copy";
      const meta = document.createElement("div");
      meta.className = "feed-post-meta";
      const label = document.createElement("span");
      label.textContent = "BIGG DOGG";
      const date = document.createElement("time");
      date.dateTime = post.createdTime || "";
      date.textContent = formatDate(post.createdTime);
      meta.append(label, date);

      const message = document.createElement("p");
      message.className = "feed-post-message";
      message.textContent = post.message || "See the latest BIGG DOGG update on Facebook.";

      const link = document.createElement("a");
      link.className = "feed-post-link";
      link.href = post.permalinkUrl || pageUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "View on Facebook ↗";

      copy.append(meta, message, link);
      article.append(copy);
      list.append(article);
    });
    root.replaceChildren(list);
  }

  fetch("/api/facebook-feed", { headers: { Accept: "application/json" } })
    .then(async (response) => {
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Feed unavailable");
      renderPosts(payload.posts);
    })
    .catch(() => renderFallback("The latest updates are on the BIGG DOGG Facebook Page."));
})();
