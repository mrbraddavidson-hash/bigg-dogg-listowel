# BiggDogg Listowel

An unofficial BiggDogg Listowel food-truck website concept with a responsive menu, location details, ordering links, SEO metadata, structured data, machine-readable context, security headers, and a branded 404 page.

Live demo: https://bigg-dogg-listowel.mrbraddavidson.workers.dev/

## Shared footer

The reusable footer source lives in `partials/site-footer.html`, and the cookie
notice lives in `partials/cookie-banner.html`. The plain static site uses
marker-based build-time sync because this repository has no bundler or template
engine. The sync includes the homepage, 404 route, and the site-specific privacy,
terms, and cookies pages:

```powershell
node scripts/sync-footer.mjs
```

The script updates both root and `dist/` HTML copies, copies `cookie-consent.js`,
and synchronizes the shared stylesheets. Keep site-specific content in the
partials and site-specific colors in the `:root` theme variables in `theme.css`.

## Deploy

The site is a static asset deployment for Cloudflare Workers/Pages:

```powershell
npx.cmd --yes wrangler@latest deploy
```

The deployment uses `dist/` as its public asset directory. The source copy is kept at the repository root for easy editing.

## Facebook updates

The public Facebook updates section is currently paused while Page access is being arranged. The server-side feed endpoint remains in the Worker so it can be re-enabled later without redesigning the site.

One-time production setup:

```powershell
npx.cmd --yes wrangler@latest secret put FACEBOOK_PAGE_ACCESS_TOKEN
```

Paste a Page access token with permission to read the Page's posts when Wrangler prompts, then restore the feed markup and script in `index.html` when the owner is ready.

## Verify before official publication

Confirm the phone number, hours, menu prices, image permissions, location, social links, and ordering method with Bigg Dogg before treating this concept as the official business website.
