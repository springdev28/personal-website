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
  role: "AI & product builder — education systems",
  location: "Istanbul / remote",
  email: "hello@baharyuksel.com",       // used by the contact form + footer
  headline: "Building AI tools that make learning work.",  // the big homepage title
  intro: "Product engineer and designer working across AI...",
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
- **`story`** is your personal narrative on the About page — a list of paragraphs. Add or remove paragraphs by adding/removing quoted lines (keep the commas).
- **`lookingFor`** is the list under "What I'm looking for" — great for admissions officers and recruiters. Each quoted line is one bullet.
- **`email`** is used by the contact form and the footer — update it in one place here.

### `available` — the "Available for new projects" pill

The small green pulsing pill on the homepage comes from `person.available`.

- To change the text: edit the words, e.g. `available: "Open to internships"`.
- To hide the pill entirely: set it to empty — `available: ""`.

### `stats` — the four homepage cards

```js
stats: [
  ["Focus", "AI · Education"],
  ["Building", "Schoolar"],
  ["Shipped", "6+ projects"],
  ["Based in", "Istanbul"],
],
```

Each line is `["Label", "Value"]`. Keep it to four for the layout to stay even.

### `disciplines` — the "What I do" cards on the homepage

```js
disciplines: [
  { key: "Code", color: "#64a8ff", text: "Software and prototypes..." },
  { key: "Design", color: "#4de2d0", text: "Interfaces and systems..." },
  { key: "Art", color: "#966dff", text: "Visual and creative-coding work..." },
],
```

These three cards on the homepage explain what you do. Each has a `key` (the title), a `color` (accent hex), and `text` (one or two sentences).

### `focusNodes` — the homepage orbit circles

```js
focusNodes: [
  { label: "AI", href: "work.html", angle: 225 },
  { label: "Schoolar", href: "work.html", angle: 315 },
  { label: "Art", href: "art.html", angle: 45 },
  { label: "Writing", href: "writing.html", angle: 135 },
],
```

Each orbit circle has:

- `label` — the text inside the circle
- `href` — the page or link it opens when clicked
- `angle` — where it sits on the orbit, in degrees

Angle guide: `0` = right, `90` = bottom, `180` = left, `270` = top.

- **Add a circle:** copy one line and change its values.
- **Remove a circle:** delete its line.
- **Rename:** change `label`.
- **Move it:** change `angle`.

### `focusPhoto` — the center photo (or your initials)

```js
focusPhoto: {
  src: "",                    // leave empty to show your initials
  alt: "Bahar Yuksel",
},
```

To use a photo instead of your initials, put an image file in this folder (for example `portrait.jpg`) and set:

```js
focusPhoto: {
  src: "portrait.jpg",
  alt: "Bahar Yuksel",
},
```

### `projects` — the Work page and homepage featured cards

See [Add a project](#add-a-project) below for the full field guide. Set `featured: true` on a project to also show it on the homepage.

### `research`, `art`, `posts` — the other content pages

Each is a list of items following the same copy-a-block pattern. Change the text inside the quotes:

- `research` → the Research page (each has a `question` and `notes`)
- `art` → the Art page (each has a 3-color `palette`)
- `posts` → the Writing page (each has a `date` in `YYYY-MM-DD` form)

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
| Edit the "What I do" cards | `disciplines` |
| Add or edit a project | the `projects` list — [see above](#add-a-project) |
| Add "why I built it" to a project | the project's `why` field |
| Feature a project on the homepage | add `featured: true` to it |
| Change the homepage orbit circles | `focusNodes` |
| Add my photo | `focusPhoto.src` |
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
