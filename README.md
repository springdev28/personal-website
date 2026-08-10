# Personal Website

Interactive studio portfolio for Bahar Yuksel.

## View locally

Open `index.html` in a browser.

You can also run a local server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Edit the site

Most content lives in `content.js`.

- Edit `person` for the homepage headline, intro, email, location, and about text.
- Edit `stats` for the four small homepage stat cards.
- Edit `focusNodes` for the homepage orbit visual.
- Edit `focusPhoto` for the middle photo/initials circle.
- Edit `projects` for the Work page and featured cards.
- Edit `research` for the Research page.
- Edit `art` for the Art page.
- Edit `posts` for the Writing page.
- Edit `links` for the Contact page.
- Edit `skills` for the About page.

## Edit the homepage orbit

In `content.js`, update this section:

```js
focusNodes: [
  { label: "AI", href: "work.html", angle: 225 },
  { label: "Schoolar", href: "work.html", angle: 315 },
  { label: "Art", href: "art.html", angle: 45 },
  { label: "Writing", href: "writing.html", angle: 135 },
],
focusPhoto: {
  src: "",
  alt: "Bahar Yuksel",
},
```

Each orbit item has:

- `label`: the text inside the circle
- `href`: the page or URL to open when clicked
- `angle`: where it starts on the orbit, in degrees

Angle guide:

- `0`: right
- `90`: bottom
- `180`: left
- `270`: top

To add a circle, add a new line inside `focusNodes`.

To delete a circle, remove its line from `focusNodes`.

To rename a circle, change `label`.

To change where a circle starts, change `angle`.

To add your photo, put an image file in the site folder, for example `portrait.jpg`, then set:

```js
focusPhoto: {
  src: "portrait.jpg",
  alt: "Bahar Yuksel",
},
```

Leave `src: ""` to show your initials instead of a photo.

## Add a project

Copy one object inside `projects` in `content.js` and change the fields:

```js
{
  title: "Project Name",
  type: "Short type",
  category: "Category",
  year: "2026",
  href: "https://example.com",
  color: "#64a8ff",
  summary: "One short sentence.",
  role: "What you did.",
  result: "What changed or what it shows.",
  tags: ["Tag", "Tag"],
  featured: true,
}
```

Use `featured: true` only for projects that should appear on the homepage.

## Files

- `index.html`, `work.html`, `art.html`, `writing.html`, `about.html`, `contact.html`: pages
- `research.html`: research page
- `content.js`: editable content
- `app.js`: rendering and interactions
- `styles.css`: visual design

## Publish changes

After editing:

```bash
git add .
git commit -m "Update personal website"
git push
```
