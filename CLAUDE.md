# Project guide for Claude

Personal portfolio site for Bahar Yüksel, plain HTML/CSS/JS, **no build step**.

- Content lives in `content.js` (the one file the owner edits).
- Rendering/behavior lives in `app.js`.
- Design lives in `styles.css`.
- Each page is a near-identical `.html` shell that injects content from `content.js`.

## Working conventions (required)

- **Document every new feature in `README.md`, in the same change.** Whenever you
  add or change a content field, page section, or behavior, add or update its
  instructions in `README.md` so the owner's editing guide stays complete and
  accurate. This is a hard requirement, not optional, never ship a feature
  without its README instructions.
- After editing `styles.css` or `app.js`, bump the `?v=` cache-busting stamp in
  **every** `.html` file so changes actually reach visitors.
- Keep `content.js` valid JavaScript, one stray comma/quote/bracket blanks the
  whole page. Run `node --check content.js && node --check app.js` after edits.
- Keep copy honest and first-person. The owner is a high school student in
  Istanbul working across code, design, and art. Do not invent biographical
  facts (schools, awards, dates), write only what is known or ask.

## Publishing / deployment

Publish by committing and pushing (per the session's branch instructions).

The live site is hosted on **Hostinger's Node.js Git deployment**, which
auto-deploys `main` on every push. Because that deployment runs the app as a
Node process, the repo includes three files **that must NOT be removed**:

- `server.js`, a tiny zero-dependency static file server (serves the plain
  HTML/CSS/JS; there is still no build step and no dependencies).
- `package.json`, its only job is `"start": "node server.js"`.
- `prerender.js`, required by `server.js` (removing it stops the server
  booting). See below.

In Hostinger's deployment settings, the **Entry file must be `server.js`**
(not `app.js`, `app.js` is browser code and crashes under Node). Do not
delete these files to "keep it static", that breaks the Hostinger deploy.

## Server-side prerendering (SEO)

Every `.html` file is an empty shell, `app.js` builds the visible page in the
browser. Crawlers that do not run JS would see nothing, so `server.js` calls
`prerender.js` to inject a plain-HTML version of the page (headings, text,
and `<a href>` links to every page) before sending it. `app.js` then replaces
it in the browser.

- `prerender.js` reads `content.js` at runtime, so `content.js` stays the
  **single source of truth**, never hardcode content into `prerender.js`.
- **When adding a new content field or page section to `app.js`, add it to
  the matching renderer in `prerender.js` too**, or it will be invisible to
  search engines.
- Prerendering must always fail safe: any error falls back to the raw file.
- `server.js` also returns real 404s (no soft 404s) and 301s `www` to the
  apex domain. Keep both.
