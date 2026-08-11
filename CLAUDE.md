# Project guide for Claude

Personal portfolio site for Bahar Yüksel — plain HTML/CSS/JS, **no build step**.

- Content lives in `content.js` (the one file the owner edits).
- Rendering/behavior lives in `app.js`.
- Design lives in `styles.css`.
- Each page is a near-identical `.html` shell that injects content from `content.js`.

## Working conventions (required)

- **Document every new feature in `README.md`, in the same change.** Whenever you
  add or change a content field, page section, or behavior, add or update its
  instructions in `README.md` so the owner's editing guide stays complete and
  accurate. This is a hard requirement, not optional — never ship a feature
  without its README instructions.
- After editing `styles.css` or `app.js`, bump the `?v=` cache-busting stamp in
  **every** `.html` file so changes actually reach visitors.
- Keep `content.js` valid JavaScript — one stray comma/quote/bracket blanks the
  whole page. Run `node --check content.js && node --check app.js` after edits.
- Keep copy honest and first-person. The owner is a high school student in
  Istanbul working across code, design, and art. Do not invent biographical
  facts (schools, awards, dates) — write only what is known or ask.

## Publishing

Publish by committing and pushing (per the session's branch instructions). The
site is static, so pushed changes go live wherever it's hosted.
