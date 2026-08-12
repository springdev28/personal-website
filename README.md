# Personal Website

Interactive studio portfolio for Bahar Yuksel — software, AI, research, art, and writing.

This is a plain HTML/CSS/JavaScript site with **no build step**. You edit text files and open them in a browser. Almost everything you'll want to change lives in one file: `content.js`.

---

## Quick start

### View the site locally

The simplest way: double-click `index.html` to open it in your browser.

For a more accurate preview (some features work better over a real server), run a local server from this folder:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

### The edit → preview → publish loop

1. **Edit** `content.js` (or another file) in any text editor.
2. **Preview** by refreshing the page in your browser. If you don't see your change, see [Not seeing your changes?](#not-seeing-your-changes) below.
3. **Publish** with the three git commands in [Publish your changes](#publish-your-changes).

---

## What each file does

| File | What it's for | Edit it? |
| --- | --- | --- |
| `content.js` | **All the words and content** on the site | ✅ Edit this most |
| `styles.css` | Colors, spacing, fonts — the visual design | ⚠️ Only for design tweaks |
| `app.js` | How the site is built and behaves | ⛔ Rarely — advanced |
| `index.html` + the other `.html` files | The page files (one per section) | ⛔ Rarely — see cache note |

The `.html` files (`index`, `work`, `research`, `art`, `writing`, `about`, `contact`) are nearly identical shells. You almost never need to touch them — the content is injected from `content.js`.

---

## Editing content (`content.js`)

Open `content.js`. It's one big list of settings. Change the text **inside the quotes** and keep the punctuation (commas, brackets, quotes) exactly as it is. That punctuation is what keeps the file valid — a missing comma or quote will break the page.

> **Golden rule:** only change the text between `"quotes"`. Leave the structure alone.

Here's what each part controls:

### `person` — your name, headline, and intro

```js
person: {
  name: "Bahar Yuksel",
  initials: "BY",                       // shown in the logo circle
  role: "High school builder — code, design & art",  // shown as the homepage tagline, About subtitle, and footer
  location: "Istanbul, Türkiye",
  email: "hello@baharyuksel.com",       // used by the contact form + footer
  headline: "I build where code, design, and art meet.",  // the big homepage title
  intro: "I'm a high school student in Istanbul...",  // the sentence under the headline
  now: "Building Schoolar, exploring AI for learning...", // the "Now" block
  available: "Open to opportunities & collaboration",     // the green status pill (see below)
  story: [                                 // your About-page narrative, one string per paragraph
    "I'm Bahar Yüksel, a high school student in Istanbul...",
    "My favorite work lives where code, design, and art overlap...",
    "I'm still early — still learning, still shipping...",
  ],
  lookingFor: [                            // the "What I'm looking for" list on the About page
    "Internships, programs, and mentorship",
    "Collaborators on education and AI projects",
    "People who will push me to build better",
  ],
},
```

- **`headline`** is the giant text on the homepage. Keep it short and confident.
- **`intro`** is the sentence under the headline.
- **`role`** is your one-line tagline — it appears as the homepage kicker, the About-page subtitle, and in the footer.
- **`story`** is your personal narrative on the About page — a list of paragraphs. Add or remove paragraphs by adding/removing quoted lines (keep the commas).
- **`lookingFor`** is the list under "What I'm looking for" — great for admissions officers and recruiters. Each quoted line is one bullet.
- **`email`** is used by the contact form and the footer — update it in one place here.

### `available` — the "Available for new projects" pill

The small green pulsing pill on the homepage comes from `person.available`.

- To change the text: edit the words, e.g. `available: "Open to internships"`.
- To hide the pill entirely: set it to empty — `available: ""`.

### The homepage hero (your intro)

The home page leads with a big personal intro — a "Hello, I'm ___" landing page — built automatically from your `person` info and a few other fields:

- **Big name:** `person.name`
- **Bio line:** `person.intro`
- **Green status pill:** `person.available` (set `""` to hide it)
- **Email button:** `person.email`
- **Social icons:** your Email / GitHub / LinkedIn entries from `links`
- **Portrait:** `focusPhoto` (see below)
- **Floating cards** around the portrait: the first three `disciplines` (see below)

The whole site uses one cohesive **light + dark** look on every page — a dark background and chrome with light (white) "showcase" cards (projects, art, disciplines, etc.). This is automatic — you don't set it.

### `disciplines` — the "What I do" cards (and the homepage floating cards)

```js
disciplines: [
  { key: "Code", color: "#64a8ff", text: "Software and prototypes..." },
  { key: "Design", color: "#4de2d0", text: "Interfaces and systems..." },
  { key: "Art", color: "#966dff", text: "Visual and creative-coding work..." },
],
```

These cards explain what you do. Each has a `key` (the title), a `color` (accent hex), and `text` (one or two sentences). The **first three also appear as the role cards** beside your homepage portrait (thumbnail + label).

### `focusPhoto` — your homepage portrait

The big portrait on the home page. It floats frameless (like a cut-out) on the hero, so it looks best as a **transparent-background PNG**. It's set to:

```js
focusPhoto: {
  src: "portrait.png",   // the site shows this image if the file exists
  alt: "Bahar Yuksel",
},
```

- **To change your photo:** replace `portrait.png` in this folder with a new image (same name), or point `src` at a different file.
- A **transparent background** makes it float cleanly; a photo with a solid background will show that background as a rectangle.
- **If the file doesn't exist**, the site quietly falls back to your initials, so it never shows a broken image.

### `projects` — the Work page and homepage featured cards

See [Add a project](#add-a-project) below for the full field guide. Set `featured: true` on a project to also show it on the homepage.

### `research`, `art`, `posts` — the other content pages

Each is a list of items following the same copy-a-block pattern. Change the text inside the quotes:

- `research` → the Research page (each has a `question` and `notes`)
- `artAlbums` → the Art page, organized into named albums (see below)
- `posts` → the Writing page (each has a `date` in `YYYY-MM-DD` form)

### `artAlbums` — the Art page (like albums/galleries)

The Art page works like an album gallery: visitors see your **named albums**, click one, and browse the pieces inside it. You create and name albums here:

```js
artAlbums: [
  {
    name: "Learning Systems",                     // the album name shown on the cover
    description: "Interface studies about progress...",  // one short line
    pieces: [
      {
        title: "Learning Signal",
        medium: "Interface study",
        year: "2026",
        palette: ["#64a8ff", "#4de2d0", "#966dff"], // 3 colors — makes the artwork visual
        text: "A visual system for routes, progress, and learning momentum.",
        tags: ["Interface", "Education"],
      },
      // ...more pieces in this album...
    ],
  },
  // ...more albums...
],
```

- **Create a new album:** copy one whole album block (`{ name, description, pieces: [...] }`) and change the `name`, `description`, and pieces.
- **Name an album:** change its `name`.
- **Add a piece to an album:** copy one piece block inside that album's `pieces` list.
- The album **cover** and the piece visuals are generated from each piece's 3-color `palette` — no image files needed. The first piece's palette becomes the album cover.
- Each album shows a **piece count** automatically, and every album gets its own shareable link (e.g. `art.html#a=0` opens the first album).

### `skillGroups` and `approach` — the About page

```js
skillGroups: [
  { group: "Code", items: ["JavaScript", "Flutter", "AI workflows", ...] },
  { group: "Design", items: ["UI/UX systems", "Interaction design", ...] },
  { group: "Art & craft", items: ["Creative coding", "Writing", ...] },
],
approach: [
  { title: "Start from the question", text: "Every project begins with a real problem..." },
  ...
],
```

- **`skillGroups`** is your toolkit, grouped into three columns. Each group has a `group` name and an `items` list of tags. Add or remove tags in the `items` quotes.
- **`approach`** is the "How I work" section — three cards, each with a `title` and `text`.

### `links` — the Contact page and footer links

```js
links: [
  { label: "Email", href: "mailto:hello@baharyuksel.com", note: "Direct contact" },
  { label: "GitHub", href: "https://github.com/springdev28", note: "Code and experiments" },
  ...
],
```

> **Tip:** to change where a link points, edit its `href`. To add a new link (e.g. Twitter/X, a resume PDF), copy one line and change `label`, `href`, and `note`.

### The footer (automatic)

Every page has a footer at the bottom. You don't edit it directly — it's built
automatically from content you've already set:

- Your **name** and **role** come from `person.name` and `person.role`.
- The **email** comes from `person.email`.
- The **navigation links** are your pages (from `pages`), minus the page you're on.

So to change anything in the footer, edit those `person` fields — the footer
updates itself everywhere.

---

## Add a project

Copy one block inside `projects` in `content.js` and change the fields:

```js
{
  title: "Project Name",
  type: "Short type",          // e.g. "Education platform"
  category: "Category",        // used by the Work page filters
  year: "2026",
  href: "https://example.com", // where "Open" goes
  color: "#64a8ff",            // accent color (hex)
  summary: "One short sentence describing it.",
  why: "Why you made it — the problem behind it.",  // shown in the project's "Details" popup
  role: "What you did.",
  result: "What changed or what it proves.",  // keep this outcome-focused
  tags: ["Tag", "Tag"],
  featured: true,              // true = also show on the homepage
},
```

- **`why`** appears in the "Details" popup as "Why I built it" — a short, personal reason. This is what makes the work feel like *yours*.
- **`result`** is the most important line for looking professional — say what the project *achieved* or *demonstrates*, not that it was practice.
- **`featured: true`** promotes it to the homepage. Only your strongest 3 should be featured. Remove the line (or set `false`) to keep a project on the Work page only.
- **`category`** feeds the filter buttons on the Work page automatically.

---

## Design and colors (`styles.css`)

You usually don't need this file, but if you want to adjust the look, the main colors are defined at the very top:

```css
:root {
  --blue: #64a8ff;
  --green: #4de2d0;
  --purple: #966dff;
  --pink: #ff75d8;
  ...
}
```

Change a hex value there and it updates everywhere that color is used. Make small changes and preview often.

---

## Publish your changes

After editing, publish from this folder:

```bash
git add .
git commit -m "Update portfolio content"
git push
```

Your changes go live wherever the site is hosted.

### How the live site is hosted (Hostinger)

The site is deployed on Hostinger, which **auto-deploys every push to `main`**. Hostinger runs it as a small Node.js app, so the repo includes two deploy-only files you don't need to edit:

- `server.js` — a tiny server that just serves the site's files.
- `package.json` — tells Hostinger to start that server.

In Hostinger's **Deployments → settings**, the **Entry file** must be `server.js`. Don't delete `server.js` or `package.json` — they're what keep the live site running. Editing the site is still only `content.js` (and occasionally `styles.css`/`app.js`).

### Not seeing your changes?

Browsers cache the old files. There are two things to try:

1. **Hard refresh** the page: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac).
2. **If you edited `styles.css` or `app.js`** and other people still see the old version, bump the **version stamp** in the `.html` files. Each page links the files like this:

   ```html
   <link rel="stylesheet" href="styles.css?v=20260811" />
   <script src="content.js?v=20260811"></script>
   <script src="app.js?v=20260811"></script>
   ```

   Change every `?v=20260811` to a new value (today's date works well, e.g. `?v=20260812`) in **all** the `.html` files. This forces browsers to load the fresh files. Editing only `content.js`? A hard refresh is usually enough.

> **Note:** if you only change text in `content.js`, most visitors will see it after a normal refresh. Bumping the version is mainly for CSS/JS changes.

---

## Common tasks at a glance

| I want to… | Edit this in `content.js` |
| --- | --- |
| Change the big homepage title | `person.headline` |
| Change my intro paragraph | `person.intro` |
| Edit my personal story (About page) | `person.story` |
| Edit "What I'm looking for" | `person.lookingFor` |
| Change or hide the green "Available" pill | `person.available` (set `""` to hide) |
| Update my email | `person.email` |
| Edit the "What I do" cards / homepage floating cards | `disciplines` |
| Add or edit a project | the `projects` list — [see above](#add-a-project) |
| Add "why I built it" to a project | the project's `why` field |
| Feature a project on the homepage | add `featured: true` to it |
| Add/change my homepage portrait photo | `focusPhoto.src` |
| Change the homepage social icons | `links` (Email / GitHub / LinkedIn) |
| Edit the About "How I work" cards | `approach` |
| Add a skill tag | `skillGroups` |
| Update social/contact links | `links` |

---

## If something breaks

If the page goes blank after an edit, you almost certainly removed a comma, quote, or bracket by accident.

- Open your browser's developer console (`F12` → **Console**) to see the error.
- Compare your change to the original structure — the safest fix is to undo your last edit and redo it, changing **only** the text inside the quotes.
- Still stuck? Revert to the last working version:

  ```bash
  git checkout content.js
  ```

  (This discards unsaved changes to that file.)
