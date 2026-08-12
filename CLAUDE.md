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
Node process, the repo includes two files **that must NOT be removed**:

- `server.js`, a tiny zero-dependency static file server (serves the plain
  HTML/CSS/JS; there is still no build step and no dependencies).
- `package.json`, its only job is `"start": "node server.js"`.

In Hostinger's deployment settings, the **Entry file must be `server.js`**
(not `app.js`, `app.js` is browser code and crashes under Node). Do not
delete `server.js`/`package.json` to "keep it static", that breaks the
Hostinger deploy.
