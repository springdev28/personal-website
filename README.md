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
- Edit `projects` for the Work page and featured cards.
- Edit `art` for the Art page.
- Edit `posts` for the Writing page.
- Edit `links` for the Contact page.
- Edit `skills` for the About page.

## Edit the homepage orbit

In `content.js`, update this section:

```js
focusNodes: [
  { label: "AI", href: "work.html", x: 26, y: 30 },
  { label: "Schoolar", href: "work.html", x: 70, y: 30 },
  { label: "Writing", href: "writing.html", x: 31, y: 72 },
  { label: "Art", href: "art.html", x: 70, y: 72 },
],
```

`x` and `y` are percentages inside the visual box. Keep them roughly between `18` and `82` so the circles stay inside the frame.

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
