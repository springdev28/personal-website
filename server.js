// Minimal, zero-dependency static file server.
//
// This exists only so the site can run on Hostinger's Node.js deployment,
// which starts the app by running this file. It just serves the plain
// HTML/CSS/JS files in this folder, there is no build step and no
// dependencies. Editing the site is still done in content.js/app.js/styles.css.
const http = require("http");
const fs = require("fs");
const path = require("path");

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

const server = http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    if (urlPath.endsWith("/")) urlPath += "index.html";

    const filePath = path.normalize(path.join(ROOT, urlPath));
    // Prevent path traversal outside the site folder.
    if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
      return send(res, 403, { "Content-Type": "text/plain" }, "Forbidden");
    }

    fs.stat(filePath, (statErr, stat) => {
      if (statErr || !stat.isFile()) {
        // Unknown path -> serve the homepage (single-page-friendly fallback).
        return fs.readFile(path.join(ROOT, "index.html"), (err2, home) => {
          if (err2) return send(res, 404, { "Content-Type": "text/plain" }, "Not found");
          send(res, 200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" }, home);
        });
      }
      // Revalidate every file with an ETag. Browsers keep caching for speed but
      // must check back each time, so replacing any file (a page, content.js, an
      // image, the CSS/JS) shows up on a normal refresh, no cache-busting needed.
      // Unchanged files come back as a tiny 304, so this stays fast.
      const etag = 'W/"' + stat.size + "-" + Math.round(stat.mtimeMs) + '"';
      const ext = path.extname(filePath).toLowerCase();
      const base = { "Content-Type": TYPES[ext] || "application/octet-stream", "Cache-Control": "no-cache", "ETag": etag };
      if (req.headers["if-none-match"] === etag) {
        return send(res, 304, base, "");
      }
      fs.readFile(filePath, (err, data) => {
        if (err) return send(res, 404, { "Content-Type": "text/plain" }, "Not found");
        send(res, 200, base, data);
      });
    });
  } catch (e) {
    send(res, 500, { "Content-Type": "text/plain" }, "Server error");
  }
});

server.listen(PORT, () => {
  console.log("Static site server listening on port " + PORT);
});
