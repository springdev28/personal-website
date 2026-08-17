# Personal Website

A plain HTML / CSS / JavaScript portfolio site. **No build step, no dependencies**, edit a text file, refresh the browser, publish.

All content lives in one file: **`content.js`**. Everything below is a reference for the fields in that file and how the site uses them.

---

## How the project is organized

| File | Purpose | How often you edit it |
| --- | --- | --- |
| `content.js` | All text and content (the only file most edits touch) | Often |
| `styles.css` | Colors, spacing, fonts | Occasionally, for design tweaks |
| `app.js` | Rendering and behavior | Rarely |
| `*.html` | One near-identical shell per page (`index`, `work`, `research`, `art`, `writing`, `about`, `contact`) | Rarely (see [caching](#publishing)) |
| `server.js` + `package.json` | Tiny static server used by the host, **do not delete** | Never |
| `prerender.js` | Puts a plain-text copy of each page into the HTML for search engines, **do not delete** | Never |

The pages are generated from `content.js` at load time, so the `.html` files usually don't need editing.

---

## Editing content

Open `content.js`. It is a single JavaScript object. The rules:

- Change text **inside the quotes** (`"like this"`).
- Keep every comma, bracket, quote, and colon in place, one missing character breaks the whole page.
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

- `key`, the card title
- `color`, accent color (hex)
- `text`, the description

The three role cards beside the homepage portrait show an **animated preview**
chosen automatically from the `key`: a card named "Code" shows a binary "matrix
rain", "Design" shows a moving design-tool mockup, and anything else (e.g.
"Art") shows floating gradient shapes. These previews are drawn in code, there
is nothing to edit, and they hold still for anyone who has "reduce motion" turned
on. Renaming a discipline changes which preview it gets.

The big homepage name (`person.name`) is set in a handwriting font and draws
itself in with a left-to-right "pen stroke" reveal on load.

### `focusPhoto`

The homepage portrait. It floats without a frame, so a **transparent PNG** looks best.

```js
focusPhoto: { src: "portrait.png", alt: "Name" }
```

- `src`, an image file in this folder. Set to `""` to show the initials instead.
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
  image: "project1.png",       // OPTIONAL, see Adding images
  embed: "https://example.com" // OPTIONAL, see Adding an iframe
}
```

- `featured: true` promotes a project to the homepage (keep it to the strongest three).
- `category` values automatically become filter buttons on the Work page.
- `image` and `embed` are optional, see the sections below.

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
        image: "artwork1.jpg",   // OPTIONAL, see Adding images
        embed: "https://..."     // OPTIONAL, see Adding an iframe
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
- The filename must match **exactly**, including the extension and capitalization.
  `Carcharodon-cutout` will not load, `Carcharodon-cutout.png` will. (If an image
  fails to load, the panel shows a soft color instead of a broken-image icon, that
  usually means a filename typo or the file was not uploaded.)
- `.png`, `.jpg`, `.webp`, and `.gif` all work.
- You can also use a full web URL instead of a filename (e.g. `image: "https://.../photo.jpg"`).
- **Multiple images (art pieces only):** for a piece with several images (e.g. the
  pages of a comic), use `images` with a list instead of a single `image`:

  ```js
  images: ["Sayfa_1.png", "Sayfa_2.png", "Sayfa_3.png"],
  ```

  The first image becomes the cover; opening the piece shows them all in order.
  Note the **square brackets** and the **comma between each name in quotes**,
  writing `image: "a.png","b.png"` is invalid and blanks the whole site.
- If an `image` isn't set, the site falls back to its generated gradient visual, so nothing breaks.

### Photos vs. logos (`imageBg`)

By default an `image` is treated as a **photo**: it fills the whole panel, cropped
to fit. That is right for screenshots and photographs, but wrong for a **logo or
icon** (transparent or with lots of empty space), which gets awkwardly cropped.

For a logo, add an `imageBg` next to the `image`. The logo is then shown whole
and centered on that background color, like an app icon:

```js
image: "Casparel-logo.png",
imageBg: "#ffffff",   // panel color behind the logo (any hex color, or "#ffffff")
```

- Use a transparent PNG for the logo so the `imageBg` color shows through around it.
- `imageBg` works on projects and on art pieces.
- To make a logo bigger or smaller in its panel, add `imageScale` (a percentage,
  default `"88%"`): `imageScale: "97%"` fills more, `imageScale: "70%"` leaves
  more space around it. `imageBg` and `imageScale` work the same way on projects
  and on art pieces.

### Previewing / zooming an image

Open a project or art piece (the **Details** popup) and **click its image** to
open a full-screen preview. There you can zoom with the `+` / `−` buttons or the
scroll wheel, drag to pan when zoomed in, and close with `×`, the `Esc` key, or a
click outside the image. Nothing to configure, it works for every image.
- Tip: a logo saved with a checkerboard "transparent" background is **not** actually
  transparent, that checkerboard is baked into the file. Re-export it as a real
  transparent PNG (or ask for it to be cleaned up).

## Adding an iframe / embed (live preview)

Any field named `embed` accepts a URL to embed as a live iframe. It appears inside the **Details popup** when the card is opened (works for both projects and art pieces).

```js
embed: "https://your-live-demo.example.com"
```

Use it to show a live demo, a CodePen/YouTube/Figma embed, a Google Slides deck, etc. Use the site's **embed URL** when a service provides one. If both `embed` and `image` are set, the embed wins in the popup.

---

## The footer

Built automatically from `person.name`, `person.role`, `person.email`, and the page list, no separate field to edit.

---

## Domain, favicon, and link previews

The site is set up for the domain **`baharyuksel.dev`**. A few files exist just
for that:

| File | What it does |
| --- | --- |
| `favicon.png` / `apple-touch-icon.png` | The little icon in the browser tab and on phone home screens. Replace the files (keep the names) to change it. |
| `og-card.png` | The preview image shown when the site is shared on LinkedIn, Messages, etc. (1200×630). Replace the file to change it. |
| `sitemap.xml` / `robots.txt` | Help search engines find every page. |

Each `.html` file also has social/SEO tags in its `<head>` (title, description,
and `og:`/`twitter:` tags) pointing at `https://baharyuksel.dev`.

**If the domain ever changes**, update the URL in three places: the `og:` and
`canonical` tags inside each `.html` file, `sitemap.xml`, and `robots.txt`.
After changing `og-card.png`, bump its `?v=` number in the `.html` files (search
for `og-card.png?v=`) so the new preview shows.

---

## Search engines (SEO)

**Nothing here needs editing.** This section explains what the site already does
so it makes sense if you ever look at Google Search Console.

### Why prerendering exists

The `.html` files are empty shells, the visible page is built in your browser by
`app.js` using the text in `content.js`. People never notice, because their
browser runs the script. A search engine crawler often does not: Google *can*
run JavaScript, but only on a slow second pass, which is a common reason new
sites sit in **"Discovered / Crawled, currently not indexed"** for a long time.

So `prerender.js` fills in the blanks on the server, before the page is sent. It
reads the same `content.js` and writes a plain-HTML version of the page (real
headings, real paragraphs, real links to the other pages) into the shell.
`app.js` then replaces it with the normal interactive page the instant it runs.

What this means for you:

- **`content.js` is still the only file you edit.** The prerendered text is
  generated from it, so it updates automatically and can never fall out of sync.
- **Visitors see no difference.** The swap happens before the page is painted.
- **If JavaScript fails**, the site still shows readable text instead of a blank
  page.
- **Blog posts are included in full.** The whole `body` of every post is in the
  HTML, not just the excerpt, so your writing is the part search engines can
  actually read.

### The other two rules the server follows

| Behavior | Why |
| --- | --- |
| A URL that doesn't exist returns a real **404** page | It used to answer with the homepage and a "success" code, which tells Google every typo'd URL is a real page and creates duplicates of the homepage. `/work` (no `.html`) still works, it resolves to `work.html`. |
| **`www.baharyuksel.dev` redirects** to `baharyuksel.dev` | Both used to serve the same site, which counts as two competing copies. Now there is one address. |

### After publishing a change

Indexing is not instant, expect days to weeks, especially for a newer domain.
To nudge it: open [Google Search Console](https://search.google.com/search-console),
paste a page's URL into **URL inspection** at the top, and click
**Request indexing**. Worth doing for the homepage plus any page you care most
about. `sitemap.xml` lists every page, and its `lastmod` dates tell Google
something changed, so bump them (to today's date) when you make a real content
update.

---

## Running locally

Run the real server from this folder:

```bash
node server.js
```

Then open `http://localhost:3000`.

Use this rather than double-clicking `index.html` or `python3 -m http.server`.
Those still show the site correctly, but only `node server.js` also does the
[search-engine prerendering](#search-engines-seo), so it is the only preview
that matches what actually gets published.

---

## Publishing

Commit and push from this folder:

```bash
git add .
git commit -m "Update site"
git push
```

### Not seeing a change?

**Everything updates on a normal refresh.** The server asks browsers to
re-check each file every visit, so edits to `content.js`, images, `styles.css`,
`app.js`, or the pages all show up once the deploy finishes, no version stamp
needed (including when you replace an image with a new one of the same name).
Unchanged files are still served from cache, so the site stays fast.

If an old version ever lingers (usually a very aggressive browser cache), a
hard refresh clears it: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac).

The `?v=...` stamps you may see on `styles.css` / `app.js` in the `.html` files
are a harmless extra safety net; you no longer need to bump them by hand.

### Hosting

The site is deployed on a host that runs it as a small static server. `server.js`, `package.json`, and `prerender.js` exist only for that, leave all three in place. In the host's deployment settings, the **Entry file must be `server.js`**.

Deleting `prerender.js` would not break the site visually, but it would stop the server booting, and removing the prerendering is what makes pages invisible to search engines again.

---

## If something breaks

A blank page after an edit almost always means a missing comma, quote, or bracket in `content.js`.

- Open the browser console (`F12` → Console) to see the error and the line number.
- Undo the last edit, or restore the file: `git checkout content.js`.
