// Minimal, zero-dependency static file server.
//
// This exists only so the site can run on Hostinger's Node.js deployment,
// which starts the app by running this file. It just serves the plain
// HTML/CSS/JS files in this folder, there is no build step and no
// dependencies. Editing the site is still done in content.js/app.js/styles.css.
const http = require("http");
const fs = require("fs");
const path = require("path");
const { prerender, contentStamp } = require("./prerender");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  res.end(body);
}

// Shown for URLs that do not exist. Deliberately a real 404: serving the
// homepage with a 200 instead ("soft 404") tells search engines that every
// misspelled or dead URL is a real page, which wastes crawl budget and creates
// duplicates of the homepage.
function notFoundPage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <meta name="theme-color" content="#050611" />
    <title>Page not found &middot; Bahar Y&uuml;ksel</title>
    <style>
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #050611;
        color: #eef1f8; font: 16px/1.6 "Manrope", system-ui, -apple-system, sans-serif; text-align: center; }
      main { padding: 2rem; }
      h1 { font-size: clamp(2rem, 6vw, 3rem); margin: 0 0 .5rem; }
      p { color: #9aa3bd; margin: 0 0 1.5rem; }
      a { color: #64a8ff; text-decoration: none; border-bottom: 1px solid currentColor; }
    </style>
  </head>
  <body>
    <main>
      <h1>Page not found</h1>
      <p>That page doesn't exist, it may have moved or never been here.</p>
      <p><a href="/">Back to the homepage</a></p>
    </main>
  </body>
</html>`;
}

// Try each candidate path in order, hand back the first one that is a real
// file. Lets /work resolve to work.html without redirecting.
function resolveFile(candidates, done) {
  if (!candidates.length) return done(null, null);
  fs.stat(candidates[0], (err, stat) => {
    if (!err && stat.isFile()) return done(candidates[0], stat);
    resolveFile(candidates.slice(1), done);
  });
}

// One hostname, one site. www.* and the apex used to serve identical pages at
// 200, which splits the site in two as far as a search engine is concerned.
function canonicalRedirect(req, res) {
  const host = req.headers.host || "";
  if (!/^www\./i.test(host)) return false;
  send(res, 301, { Location: "https://" + host.replace(/^www\./i, "") + (req.url || "/") }, "");
  return true;
}

const server = http.createServer((req, res) => {
  try {
    if (canonicalRedirect(req, res)) return;

    let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    if (urlPath.endsWith("/")) urlPath += "index.html";

    const filePath = path.normalize(path.join(ROOT, urlPath));
    // Prevent path traversal outside the site folder.
    if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
      return send(res, 403, { "Content-Type": "text/plain" }, "Forbidden");
    }

    // A bare path like /work also gets tried as /work.html, so the pages work
    // with or without the extension instead of falling through to a 404.
    const candidates = [filePath];
    if (!path.extname(filePath)) candidates.push(filePath + ".html");

    resolveFile(candidates, (found, stat) => {
      if (!found) {
        return send(
          res,
          404,
          { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" },
          notFoundPage()
        );
      }

      const ext = path.extname(found).toLowerCase();
      const isHtml = ext === ".html";

      // Revalidate every file with an ETag. Browsers keep caching for speed but
      // must check back each time, so replacing any file (a page, content.js, an
      // image, the CSS/JS) shows up on a normal refresh, no cache-busting needed.
      // Unchanged files come back as a tiny 304, so this stays fast.
      // Pages also fold in content.js's stamp, since editing content.js changes
      // the HTML we send even though the .html file itself is untouched.
      const stamp = stat.size + "-" + Math.round(stat.mtimeMs) + (isHtml ? "-" + contentStamp() : "");
      const etag = 'W/"' + stamp + '"';
      const base = { "Content-Type": TYPES[ext] || "application/octet-stream", "Cache-Control": "no-cache", "ETag": etag };
      if (req.headers["if-none-match"] === etag) {
        return send(res, 304, base, "");
      }

      fs.readFile(found, isHtml ? "utf8" : null, (err, data) => {
        if (err) {
          return send(res, 404, { "Content-Type": "text/html; charset=utf-8" }, notFoundPage());
        }
        let body = data;
        if (isHtml) {
          // Fill the empty page shell with crawlable HTML. If anything at all
          // goes wrong, fall back to the untouched file: a page that renders in
          // the browser beats a 500.
          try {
            body = prerender(data);
          } catch (e) {
            console.error("Prerender failed for " + found + ":", e.message);
            body = data;
          }
        }
        send(res, 200, base, body);
      });
    });
  } catch (e) {
    send(res, 500, { "Content-Type": "text/plain" }, "Server error");
  }
});

server.listen(PORT, () => {
  console.log("Static site server listening on port " + PORT);
});
