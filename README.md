# Personal Website

A plain HTML / CSS / JavaScript portfolio site. **No build step, no dependencies** — edit a text file, refresh the browser, publish.

All content lives in one file: **`content.js`**. Everything below is a reference for the fields in that file and how the site uses them.

---

## How the project is organized

| File | Purpose | How often you edit it |
| --- | --- | --- |
| `content.js` | All text and content (the only file most edits touch) | Often |
| `styles.css` | Colors, spacing, fonts | Occasionally, for design tweaks |
| `app.js` | Rendering and behavior | Rarely |
| `*.html` | One near-identical shell per page (`index`, `work`, `research`, `art`, `writing`, `about`, `contact`) | Rarely (see [caching](#publishing)) |
| `server.js` + `package.json` | Tiny static server used by the host — **do not delete** | Never |

The pages are generated from `content.js` at load time, so the `.html` files usually don't need editing.

---

## Editing content

Open `content.js`. It is a single JavaScript object. The rules:

- Change text **inside the quotes** (`"like this"`).
- Keep every comma, bracket, quote, and colon in place — one missing character breaks the whole page.
- After editing, it's worth running `node --check content.js` if Node is installed (optional).

> Only the values between quotes are meant to be edited. Leave the surrounding structure alone.

---

## Field reference

### `person`

Controls the homepage hero, the About page, and the footer.

| Field | What it sets |
| --- | --- |
| `name` | Name shown in the header, hero, and footer |
| `initials` | Two letters shown in the logo circle (and as a fallback if no portrait) |
| `role` | One-line tagline (homepage kicker, About subtitle, footer) |
| `location` | Location string |
| `email` | Used by the contact form, the hero email button, and the footer |
| `headline` | The large headline text on the homepage |
| `intro` | The short sentence under the headline |
| `now` | The "Now" line on the About page |
| `available` | Text of the green status pill on the homepage. Set to `""` to hide the pill |
| `story` | A list of paragraphs for the About page (one quoted string per paragraph) |
| `lookingFor` | A list of bullet points under "What I'm looking for" on About |

### `disciplines`

The "What I do" cards, and the three role cards beside the homepage portrait.

```js
disciplines: [
  { key: "Code", color: "#64a8ff", text: "One or two sentences." },
  // ...
]
```

- `key` — the card title
- `color` — accent color (hex)
- `text` — the description

### `focusPhoto`

The homepage portrait. It floats without a frame, so a **transparent PNG** looks best.

```js
focusPhoto: { src: "portrait.png", alt: "Name" }
```

- `src` — an image file in this folder. Set to `""` to show the initials instead.
- See [Adding images](#adding-images).

### `projects`

The Work page, and the featured cards on the homepage.

```js
{
  title: "Project name",
  type: "Short type",          // e.g. "Mobile app"
  category: "Category",        // powers the Work page filter buttons
  year: "2026",
  href: "https://example.com", // where the "Open" button goes
  color: "#64a8ff",            // accent color
  summary: "One sentence.",
  why: "Why it was built.",    // shown in the Details popup (optional)
  role: "What you did.",
  result: "The outcome.",
  tags: ["Tag", "Tag"],
  featured: true,              // true = also show on the homepage
  image: "project1.png",       // OPTIONAL — see Adding images
  embed: "https://example.com" // OPTIONAL — see Adding an iframe
}
```

- `featured: true` promotes a project to the homepage (keep it to the strongest three).
- `category` values automatically become filter buttons on the Work page.
- `image` and `embed` are optional — see the sections below.

### `research`

The Research page. Each item:

```js
{ title, area, status, year, question, notes: ["...", "..."], color }
```

### `artAlbums`

The Art page is organized into named albums. Visitors see album covers, click in, and browse the pieces.

```js
artAlbums: [
  {
    name: "Album name",
    description: "One short line.",
    pieces: [
      {
        title: "Piece title",
        medium: "Medium",
        year: "2026",
        palette: ["#64a8ff", "#4de2d0", "#966dff"], // 3 colors for the generated visual
        text: "A sentence about it.",
        tags: ["Tag"],
        image: "artwork1.jpg",   // OPTIONAL — see Adding images
        embed: "https://..."     // OPTIONAL — see Adding an iframe
      }
    ]
  }
]
```

- Copy a whole album block to add a new album; copy a piece block inside `pieces` to add a piece.
- The album cover uses the first piece's `image` if it has one, otherwise a generated visual from its `palette`.

### `posts`

The Writing page. Each item: `{ title, category, date, read, excerpt }` (date is `YYYY-MM-DD`).

### `skillGroups` and `approach`

The About page.

```js
skillGroups: [ { group: "Code", items: ["Tag", "Tag"] }, ... ]
approach:    [ { title: "...", text: "..." }, ... ]
```

### `links`

The Contact page, and the homepage social icons (Email / GitHub / LinkedIn are detected by their label).

```js
links: [ { label: "GitHub", href: "https://...", note: "Short note" }, ... ]
```

---

## Adding images

Any field named `image` (and `focusPhoto.src`) accepts an image.

1. Put the image file in this folder (next to `index.html`). Example: `project1.png`.
2. Reference it by filename in `content.js`:

```js
// a project image (replaces the generated art panel)
image: "project1.png"

// an art piece image (replaces the generated visual; also used as the album cover)
image: "artwork1.jpg"

// the homepage portrait
focusPhoto: { src: "portrait.png", alt: "Name" }
```

Notes:
- `.png`, `.jpg`, `.webp`, and `.gif` all work.
- You can also use a full web URL instead of a filename (e.g. `image: "https://.../photo.jpg"`).
- If an `image` isn't set, the site falls back to its generated gradient visual, so nothing breaks.

## Adding an iframe / embed (live preview)

Any field named `embed` accepts a URL to embed as a live iframe. It appears inside the **Details popup** when the card is opened (works for both projects and art pieces).

```js
embed: "https://your-live-demo.example.com"
```

Use it to show a live demo, a CodePen/YouTube/Figma embed, a Google Slides deck, etc. Use the site's **embed URL** when a service provides one. If both `embed` and `image` are set, the embed wins in the popup.

---

## The footer

Built automatically from `person.name`, `person.role`, `person.email`, and the page list — no separate field to edit.

---

## Running locally

Double-click `index.html`, or run a local server from this folder for a more accurate preview:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

---

## Publishing

Commit and push from this folder:

```bash
git add .
git commit -m "Update site"
git push
```

### Not seeing a change?

Browsers cache files. A hard refresh usually fixes it: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac).

If a **CSS or JS** change still doesn't show for others, bump the version stamp in the `.html` files — each links assets like `styles.css?v=20260814`. Change every `?v=...` to a new value (a date works) in all `.html` files to force browsers to reload. Image files use the same trick (`portrait.png?v=2` in `content.js`).

### Hosting

The site is deployed on a host that runs it as a small static server. `server.js` and `package.json` exist only for that — leave them in place. In the host's deployment settings, the **Entry file must be `server.js`**.

---

## If something breaks

A blank page after an edit almost always means a missing comma, quote, or bracket in `content.js`.

- Open the browser console (`F12` → Console) to see the error and the line number.
- Undo the last edit, or restore the file: `git checkout content.js`.
