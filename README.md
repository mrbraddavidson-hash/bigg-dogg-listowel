# BiggDogg Listowel

An unofficial BiggDogg Listowel food-truck website concept with a responsive menu, location details, ordering links, SEO metadata, structured data, machine-readable context, security headers, and a branded 404 page.

Live demo: https://bigg-dogg-listowel.mrbraddavidson.workers.dev/

## Deploy

The site is a static asset deployment for Cloudflare Workers/Pages:

```powershell
npx.cmd --yes wrangler@latest deploy
```

The deployment uses `dist/` as its public asset directory. The source copy is kept at the repository root for easy editing.

## Facebook updates

The page includes a server-side Facebook feed. The owner can keep posting from Facebook normally; the Worker polls the Page's recent posts, caches the response briefly, and renders the latest public posts as branded cards. The Page access token stays in Wrangler's secret store and is never sent to the browser.

One-time production setup:

```powershell
npx.cmd --yes wrangler@latest secret put FACEBOOK_PAGE_ACCESS_TOKEN
```

Paste a Page access token with permission to read the Page's posts when Wrangler prompts. Until that secret is set, the site shows a direct link to the Facebook Page instead of an empty feed.

## Verify before official publication

Confirm the phone number, hours, menu prices, image permissions, location, social links, and ordering method with Bigg Dogg before treating this concept as the official business website.
