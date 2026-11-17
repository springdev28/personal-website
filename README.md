# Personal Website

A plain HTML / CSS / JavaScript portfolio site. **No build step or server dependencies**, edit a text file, refresh the browser, publish.

All content lives in one file: **`content.js`**. Everything below is a reference for the fields in that file and how the site uses them.

---

## How the project is organized

| File | Purpose | How often you edit it |
| --- | --- | --- |
| `content.js` | All text and content (the only file most edits touch) | Often |
| `styles.css` | Colors, spacing, fonts | Occasionally, for design tweaks |
| `app.js` | Rendering and behavior | Rarely |
| `sculpture.js` | Archived scene code; not loaded by the website | Rarely |
| `vendor/three*.js` + `vendor/THREE-LICENSE.txt` | Archived Three.js runtime and MIT license; not loaded | Rarely |
| `assets/identity/` | Original ink, iris, and white asterisk SVGs exported from Figma | When updating the personal identity |
| `assets/graphics/` | MIT-licensed Iconoir SVG linework retained for interface fallbacks | Rarely |
| `assets/editorial/` | Retained Pexels photographs from an abandoned direction; no longer rendered | Rarely |
| `assets/internet/` | Retained legacy 3Dicons cutouts; no longer rendered | Rarely |
| `assets/desk/*.svg` + `assets/folders/*.svg` | Retained legacy vector props and folder drawings; no longer rendered by the current interface | Rarely |
| `assets/portrait/` | Refined three-quarter portrait, source and edit notes | When updating the portrait |\n| `assets/works/` | Exported portfolio artwork from Figma | When adding or replacing artwork |
| `*.html` | One near-identical shell per page (`index`, `work`, `research`, `art`, `writing`, `logs`, project-log pages, `about`, `contact`) | Rarely (see [caching](#publishing)) |
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

### `home`

The homepage is a full-screen illustrated menu inspired by [Rayyan Burondkar's portfolio](https://rayyan.theloopboard.com/). Its graphic system uses cut-paper silhouettes, heavy condensed typography, halftone print texture, and flat midnight purple, cyan, lilac, pink, and lime. The original asterisk identity stays in the header.

- `home.intro` sets the short introduction beside the portrait. The name comes from `person.name`.
- `home.eyebrow`, `home.headline`, `home.note`, and `home.desk` remain as legacy content fields; the illustrated menu does not render them.
- The six main links open Work, Art, Research, About, Writing, and Contact. Build logs sit along the bottom.
- Hover or focus highlights a menu item; Up/Down changes the focused item, and Enter opens it. Ordinary links and Tab navigation also work.
- The top-bar Menu exposes all pages. Search is available from the magnifying glass or Cmd/Ctrl+K.
- On phones the portrait, menu links, and bottom controls flow vertically, without dragging or a canvas requirement.

The interior pages use the same condensed headings, solid color plates, and sharply edged cards. Art opens closed collection folders, then local artwork in the on-site viewer. Work keeps its category filters and project details; Writing opens full articles; Logs retain their commit links; Contact opens an addressed email draft.

### `person`

Controls the personal introduction, the About page, and the footer.

| Field | What it sets |
| --- | --- |
| `name` | Name shown in the header, personal introduction, and footer |
| `initials` | Two letters used as a fallback if no portrait |
| `role` | One-line tagline (About subtitle) |
| `location` | Location string |
| `email` | Used by the contact form and the footer |
| `headline` | Fallback homepage headline when `home.headline` is absent |
| `intro` | Personal introduction; also the fallback when `home.intro` is absent |
| `now` | The "Now" line on the About page |
| `available` | Availability text in the footer |
| `story` | A list of paragraphs for the About page (one quoted string per paragraph) |
| `lookingFor` | A list of bullet points under "What I'm looking for" on About |

### `disciplines`

Discipline descriptions retained as editable portfolio data.

```js
disciplines: [
  { key: "Code", color: "#64a8ff", text: "One or two sentences." },
  // ...
]
```

- `key`, the card title
- `color`, accent color (hex; retained for content compatibility)
- `text`, the description

### `focusPhoto`

The three-quarter head portrait on Home and About. The active file is `assets/portrait/bahar-three-quarter.png`, refined from the owner-supplied `Untitled_Artwork 34.png`. The original `portrait.png` remains untouched. See `assets/portrait/SOURCES.md` for the edit prompt and provenance. Use a **transparent PNG** with the whole head inside the image.

```js
focusPhoto: { src: "portrait.png", alt: "Name" }
```

- `src`, an image file in this folder. Set to `""` to show the initials instead.
- See [Adding images](#adding-images).

### `projects`

The Work page and its project-detail dialogs.

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
  featured: true,              // retained for future curation
  image: "project1.png",       // OPTIONAL, see Adding images
  embed: "https://example.com" // OPTIONAL, see Adding an iframe
}
```

- `featured` is retained as a content flag for future curation.
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
    folderCover: "design", // choose a constructed graphic composition
    pieces: [
      {
        title: "Piece title",
        medium: "Medium",
        year: "2026",
        palette: ["#64a8ff", "#4de2d0", "#966dff"], // palette retained with the artwork
        text: "A sentence about it.",
        tags: ["Tag"],
        featured: true,         // marks a featured work
        href: "https://www.figma.com/design/...", // original Figma file
        image: "artwork1.jpg",   // OPTIONAL, see Adding images
        embed: "https://..."     // OPTIONAL, see Adding an iframe
      }
    ]
  }
]
```

- Copy a whole album block to add a new album; copy a piece block inside `pieces` to add a piece.
- `folderCover` selects a cover color, oversized title, and cropped fragment of your original artwork: `design`, `robotics`, `comics`, `editorial`, `characters`, or `misc`. The folder name and item count update automatically. Cover mappings live in `folderCover()` in `app.js`.
- The Art page shows collection folders, with the original works inside each folder. `featured` remains available as a content flag.
- `href` retains the original Figma source URL as owner metadata. It is not shown
  in the public artwork viewer: visitors browse the locally stored artwork on the website.
- The **2026–27 Visual Design** album includes the seven new poster and identity
  projects. Their exported images are stored locally in `assets/works/`, so
  visitors can view the artwork without loading Figma. The EOAI piece has a
  gallery of its logo and banner. To update an artwork, export its new image,
  replace the matching local file, and retain or update its original `href`.

Clicking an artwork opens the full on-site archive viewer. It displays the local
image or gallery at large size, keeps the title, medium, year, description, and
tags beside it, and provides previous/next buttons plus an album strip. The left
and right arrow keys also move between works. Figma is not used as the visitor-facing viewer.

## Page motion

Home and Work type the `bahar.js` snippet when its panel enters the viewport; the replay button runs it again. Writing reveals the handwritten phrase and draws its underline. Menu selection, card movement, and scroll reveals use short transitions.

System `prefers-reduced-motion` provides complete static content. There is no global play/pause control; the former saved toggle preference is no longer read. Typing stops while the tab is hidden. Decorative animation is hidden from screen readers; content and navigation do not depend on animation.

### `posts`

The Writing page. Each item: `{ title, category, date, read, excerpt }` (date is `YYYY-MM-DD`).

### `logProjects`, `casparelLogs`, and `casparelHighlights`

`logProjects` controls the folder cards on the main Logs page. A folder can point to a detailed log page, a source repository, or a project archive.

`casparelLogs` controls the chronological Casparel detail page. Every calendar day from the first commit has one item:

```js
{ date: "2026-09-03", title: "What changed", summary: "One concise daily note.", commits: 3, tags: ["Theme"] }
```

Use `commits: 0` and an empty `tags` list for a day with no recorded Git activity.

`casparelHighlights` adds the selected, directly linked commits shown inside each active day:

```js
casparelHighlights: {
  "2026-09-03": [
    ["7b07a8d", "Fix Android plans, ads, and mobile overflow"],
  ],
}
```

### `skillGroups` and `approach`

The About page.

```js
skillGroups: [ { group: "Code", items: ["Tag", "Tag"] }, ... ]
approach:    [ { title: "...", text: "..." }, ... ]
```

### `links`

Personal contact channels only: Email, Website, LinkedIn, GitHub, Twitter/X, Reddit, and YouTube. The footer detects GitHub and LinkedIn by their labels. Project websites belong in `projects`, not in this list.

```js
links: [ { label: "GitHub", href: "https://github.com/username", icon: "assets/social/github.svg", note: "Short note" }, ... ]
```

Each contact shows its logo, label, and address. The visible address comes from `href`, omitting only the protocol, leading `www.`, and trailing slash; the same information is prerendered for crawlers. `icon` is a local SVG path. Platform marks are original Font Awesome SVGs, with sources and licenses in `assets/social/`. The Website row uses the personal identity logo.

---

## Adding images

Any field named `image` (and `focusPhoto.src`) accepts an image.

1. Put the image file in this folder (next to `index.html`). Example: `project1.png`.
2. Reference it by filename in `content.js`:

```js
// a project image (replaces the generated art panel)
image: "project1.png"

// an art piece image (shown after opening its collection folder)
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
- If an `image` isn't set, the site falls back to a solid typographic cover, so nothing breaks.

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
| `favicon.svg` | Favicon master using the original identity paths, iris purple on transparency. |
| `favicon.png` / `favicon.ico` / `apple-touch-icon.png` | Logo exports for search results and browser tabs (192×192 PNG and multi-size ICO), and phone home screens (180×180 PNG). |
| `og-card.png` | The preview image shown when the site is shared on LinkedIn, Messages, etc. (1200×630). Replace the file to change it. |
| `sitemap.xml` / `robots.txt` | Help search engines find every page. |

All nine page heads retain the original iris SVG for browser tabs and provide a square PNG of the same purple logo for search engines, plus the Apple touch icon. The root `/favicon.ico` also serves the logo for browsers that discover it automatically. Regenerate these exports from `favicon.svg` when the logo changes, and update both icon cache versions in every HTML shell. Keep icon URLs stable between logo changes; Google Search refreshes its cached favicon after recrawling.

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

### Visual system and page layouts

The header, homepage accents, and Art title plate use the original six-arm identity logo. The original SVG is a CSS mask, so the exact exported geometry can use the site’s cyan, lime, pink, or white without substituting a font glyph. Its source nodes and export notes are in `assets/identity/SOURCES.md`; the browser favicon is the original iris SVG, and raster search icons use the same purple logo. The palette lives at the top of `styles.css`, with Barlow Condensed for display type, Space Grotesk for body copy, DM Mono for small metadata, and Caveat for the writing animation.

- **Home:** an illustrated menu. All six panels share the same angle in every state. Hover, focus, and arrow keys select links. The small terminal types its code and has a replay button.
- **Work:** three project panels, category filters, and a details reader. An empty `href` removes the external launch link.
- **Research:** large question cards using existing areas, notes, and statuses.
- **Art:** closed graphic folders with cropped fragments of original artwork, then an artwork grid and on-site reader. Left/Right moves between pieces, and focus stays in the reader. Multi-image pieces keep all pages in a horizontally scrollable gallery.
- **Writing:** article cards, a handwriting reveal, and a full-text reader.
- **Logs:** project history panels and the existing Casparel timeline with source links.
- **About:** portrait, biography, current work, toolkit, and principles.
- **Contact:** personal addresses with platform logos and an addressed email form. Both fields are required; submission opens an email draft without sending it.

Decorative sequence numbers are omitted from navigation, page titles, writing cards, log panels, and artwork tabs. Actual dates, work counts, and the viewer’s current position remain.

The home portrait remains stationary. Brief cyan/violet edge echoes and narrow graphic cuts appear over the original colored shapes. These are opacity-only VFX: there is no cursor tracking, parallax, shape movement, shine, glow, or light sweep. Effects respect reduced-motion preferences and pause offscreen or in hidden tabs.

`portrait.js` builds the overlays from the traced outlines in `assets/portrait/shape-vfx.json`. The original PNG is always visible beneath them. If replacing the portrait with a different image path, the old effects are automatically skipped. Timing and opacity are set by `portrait-print-glitch` in `styles.css`; the JSON contains outlines only, with no movement settings. Bump the JSON version in `portrait.js` when changing outlines, and refresh the HTML cache stamps after script or style changes.

The mobile menu opens from the header on every page. The homepage stacks its introduction, portrait, and two groups of links; interior grids reduce their columns. Dialogs retain visible close controls and keyboard support.

Click an artwork image to open the full-screen zoom viewer. Its close, zoom, and reset controls stay above the image; Escape closes it. Artwork without an image receives a title cover, and project covers without logos use the project's initial.

### Validation after visual changes

Run `node --check content.js`, `node --check app.js`, `node --check portrait.js`, and `node --check prerender.js`. Verify the desktop and phone layouts, open a folder and artwork, use Left/Right in the viewer, test project filters and search, and confirm the mobile Menu works on an interior page. Bump the cache stamp in all nine HTML shells.
