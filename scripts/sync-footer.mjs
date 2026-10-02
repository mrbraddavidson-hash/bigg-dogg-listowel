import { copyFile, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const partial = (await readFile(join(root, "partials", "site-footer.html"), "utf8")).trim();
const cookiePartial = (await readFile(join(root, "partials", "cookie-banner.html"), "utf8")).trim();
const startMarker = "<!-- site-footer:start -->";
const endMarker = "<!-- site-footer:end -->";
const block = `${startMarker}\n${partial.replace(`${startMarker}\n`, "").replace(`\n${endMarker}`, "")}\n${endMarker}`;
const cookieStartMarker = "<!-- cookie-banner:start -->";
const cookieEndMarker = "<!-- cookie-banner:end -->";
const cookieBlock = `${cookieStartMarker}\n${cookiePartial.replace(`${cookieStartMarker}\n`, "").replace(`\n${cookieEndMarker}`, "")}\n${cookieEndMarker}`;

function applyMarkerBlock(content, startMarker, endMarker, block, file) {
  const start = content.indexOf(startMarker);
  const end = content.indexOf(endMarker, start + startMarker.length);
  if (start !== -1 && end !== -1) {
    return `${content.slice(0, start)}${block}${content.slice(end + endMarker.length)}`;
  }

  throw new Error(`Could not find ${startMarker} in ${file}`);
}

function applyFooter(content, file) {
  const start = content.indexOf(startMarker);
  const end = content.indexOf(endMarker, start + startMarker.length);
  if (start !== -1 && end !== -1) {
    return applyMarkerBlock(content, startMarker, endMarker, block, file);
  }

  const footerStart = content.indexOf('<footer class="site-footer"');
  if (footerStart !== -1) {
    const footerEnd = content.indexOf("</footer>", footerStart);
    if (footerEnd !== -1) {
      return `${content.slice(0, footerStart)}${block}${content.slice(footerEnd + "</footer>".length)}`;
    }
  }

  if (file.endsWith("404.html")) {
    const bodyEnd = content.lastIndexOf("</body>");
    if (bodyEnd !== -1) {
      return `${content.slice(0, bodyEnd)}${block}\n${content.slice(bodyEnd)}`;
    }
  }

  throw new Error(`Could not find a footer insertion point in ${file}`);
}

for (const relativePath of ["index.html", "404.html", "privacy.html", "terms.html", "cookies.html"]) {
  const path = join(root, relativePath);
  let updated = applyFooter(await readFile(path, "utf8"), relativePath);
  updated = applyMarkerBlock(updated, cookieStartMarker, cookieEndMarker, cookieBlock, relativePath);
  await writeFile(path, updated, "utf8");
  await copyFile(path, join(root, "dist", relativePath));
}

for (const relativePath of ["privacy.html", "terms.html", "cookies.html"]) {
  const cleanPath = relativePath.replace(/\.html$/, "");
  await copyFile(join(root, "dist", relativePath), join(root, "dist", cleanPath));
}

await copyFile(join(root, "styles.css"), join(root, "dist", "styles.css"));
await copyFile(join(root, "theme.css"), join(root, "dist", "theme.css"));
await copyFile(join(root, "cookie-consent.js"), join(root, "dist", "cookie-consent.js"));
await copyFile(join(root, "menu-lightbox.js"), join(root, "dist", "menu-lightbox.js"));
await copyFile(join(root, "sitemap.xml"), join(root, "dist", "sitemap.xml"));
await copyFile(join(root, "manifest.webmanifest"), join(root, "dist", "manifest.webmanifest"));
await copyFile(join(root, "_headers"), join(root, "dist", "_headers"));
console.log("Synced partials/site-footer.html into root and dist HTML routes.");
