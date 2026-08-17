// Server-side prerendering, so search engines see real content.
//
// Why this exists: every .html file in this repo is an empty shell. The visible
// page is built in the browser by app.js from the data in content.js. That is
// fine for people (their browser runs the script), but a crawler that does not
// run JavaScript sees a blank page with no text and no links to the other
// pages. Google can render JavaScript, but it does so on a slow second pass,
// which is a common reason new sites sit in "Discovered/Crawled - currently
// not indexed" for a long time.
//
// So before server.js sends an .html file, it asks this module to fill the
// empty shell with a plain-HTML version of the same content: real headings,
// real paragraphs, and real <a href> links to every page. app.js then replaces
// it with the full interactive version the moment it runs, so nothing changes
// for visitors.
//
// content.js stays the single source of truth. This file reads it, it never
// duplicates it, so editing content.js updates the prerendered HTML too.
// Zero dependencies, no build step, same as the rest of the site.
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = __dirname;
const CONTENT_FILE = path.join(ROOT, "content.js");

// Parsed content.js, re-read only when the file actually changes on disk.
let cache = { key: "", data: null };

function loadContent() {
  const stat = fs.statSync(CONTENT_FILE);
  const key = stat.size + "-" + stat.mtimeMs;
  if (cache.data && cache.key === key) return cache.data;

  // content.js is plain data (`window.portfolio = {...}`), so running it in a
  // bare sandbox with nothing but an empty `window` is enough to read it.
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(CONTENT_FILE, "utf8"), sandbox, { timeout: 5000 });

  cache = { key: key, data: sandbox.window.portfolio || null };
  return cache.data;
}

// A stamp that changes whenever content.js changes, so server.js can mix it
// into the ETag of prerendered pages (the .html file itself did not change,
// but the HTML we send did).
function contentStamp() {
  try {
    const stat = fs.statSync(CONTENT_FILE);
    return stat.size + "-" + Math.round(stat.mtimeMs);
  } catch (e) {
    return "0";
  }
}

function esc(value) {
  return String(value == null ? "" : value).replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]
  );
}

const list = (value) => (Array.isArray(value) ? value : []);
const paras = (items) => list(items).map((text) => `<p>${esc(text)}</p>`).join("");
const bullets = (items) => (list(items).length ? `<ul>${list(items).map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : "");

// "Education platform · 2026" style line, skipping any missing pieces.
const meta = (parts) => {
  const kept = parts.filter(Boolean).map(esc);
  return kept.length ? `<p>${kept.join(" &middot; ")}</p>` : "";
};

function heading(kicker, title, intro) {
  return `<p>${esc(kicker)}</p><h1>${esc(title)}</h1>${intro ? `<p>${esc(intro)}</p>` : ""}`;
}

// A link is external when it points somewhere off the site (http, mailto).
function link(href, label) {
  const external = /^(https?:|mailto:)/i.test(href || "");
  return `<a href="${esc(href)}"${external ? ' rel="noopener"' : ""}>${esc(label)}</a>`;
}

/* ---------------------------------------------------------------- pages -- */

function renderHome(data) {
  const person = data.person || {};
  const disciplines = list(data.disciplines)
    .map((d) => `<section><h2>${esc(d.key)}</h2><p>${esc(d.text)}</p></section>`)
    .join("");
  const featured = list(data.projects)
    .filter((p) => p.featured)
    .map((p) => `<li><h3>${esc(p.title)}</h3>${meta([p.type, p.year])}<p>${esc(p.summary)}</p></li>`)
    .join("");
  const links = list(data.links).map((l) => `<li>${link(l.href, l.label)} &middot; ${esc(l.note)}</li>`).join("");

  return `<h1>${esc(person.headline || person.name)}</h1>
    <p>${esc(person.name)} &middot; ${esc(person.role)} &middot; ${esc(person.location)}</p>
    <p>${esc(person.intro)}</p>
    ${disciplines}
    ${featured ? `<section><h2>Featured work</h2><ul>${featured}</ul></section>` : ""}
    <section><h2>Now</h2><p>${esc(person.now)}</p></section>
    ${links ? `<section><h2>Elsewhere</h2><ul>${links}</ul></section>` : ""}`;
}

function renderWork(data) {
  const projects = list(data.projects)
    .map((p) => {
      const title = p.href ? link(p.href, p.title) : esc(p.title);
      return `<article>
        <h2>${title}</h2>
        ${meta([p.type, p.category, p.year])}
        ${p.summary ? `<p>${esc(p.summary)}</p>` : ""}
        ${p.why ? `<p><strong>Why I made it:</strong> ${esc(p.why)}</p>` : ""}
        ${p.role ? `<p><strong>My role:</strong> ${esc(p.role)}</p>` : ""}
        ${p.result ? `<p><strong>Result:</strong> ${esc(p.result)}</p>` : ""}
        ${bullets(p.tags)}
      </article>`;
    })
    .join("");

  return `${heading("Work", "Things I've built.", "A mix of shipped products, prototypes, and experiments.")}${projects}`;
}

function renderResearch(data) {
  const items = list(data.research)
    .map(
      (r) => `<article>
        <h2>${esc(r.title)}</h2>
        ${meta([r.area, r.status, r.year])}
        ${r.question ? `<p>${esc(r.question)}</p>` : ""}
        ${bullets(r.notes)}
      </article>`
    )
    .join("");

  return `${heading("Research", "Questions, notes, directions.", "")}${items}`;
}

function renderArt(data) {
  const albums = list(data.artAlbums)
    .map((album) => {
      const pieces = list(album.pieces)
        .map(
          (piece) => `<article>
            <h3>${esc(piece.title)}</h3>
            ${meta([piece.medium, piece.year])}
            ${piece.text ? `<p>${esc(piece.text)}</p>` : ""}
            ${bullets(piece.tags)}
          </article>`
        )
        .join("");
      return `<section>
        <h2>${esc(album.name)}</h2>
        ${album.description ? `<p>${esc(album.description)}</p>` : ""}
        ${pieces}
      </section>`;
    })
    .join("");

  return `${heading("Art & visuals", "Albums of studies and experiments.", "Visual studies, posters, and creative-coding sketches.")}${albums}`;
}

function renderWriting(data) {
  // The full post body goes in on purpose. These are the longest pieces of
  // original writing on the site and the strongest thing search engines can
  // index, so they should not be locked behind a click-to-open dialog.
  const posts = list(data.posts)
    .map(
      (post) => `<article>
        <h2>${esc(post.title)}</h2>
        ${meta([post.category, post.read])}
        ${post.date ? `<p><time datetime="${esc(post.date)}">${esc(post.date)}</time></p>` : ""}
        ${post.excerpt ? `<p>${esc(post.excerpt)}</p>` : ""}
        ${paras(post.body)}
      </article>`
    )
    .join("");

  return `${heading("Writing", "An innovator's journal.", "")}${posts}`;
}

function renderAbout(data) {
  const person = data.person || {};
  const skills = list(data.skillGroups)
    .map((g) => `<section><h3>${esc(g.group)}</h3>${bullets(g.items)}</section>`)
    .join("");
  const approach = list(data.approach)
    .map((a) => `<section><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></section>`)
    .join("");
  const story = paras(person.story) || (person.about ? `<p>${esc(person.about)}</p>` : "");

  return `${heading("About", person.name, person.role)}
    ${story}
    ${person.now ? `<section><h2>Now</h2><p>${esc(person.now)}</p></section>` : ""}
    ${list(person.lookingFor).length ? `<section><h2>What I'm looking for</h2>${bullets(person.lookingFor)}</section>` : ""}
    ${skills ? `<section><h2>What I work with</h2>${skills}</section>` : ""}
    ${approach ? `<section><h2>Principles in practice</h2>${approach}</section>` : ""}
    <p>${link("contact.html", "Get in touch")}</p>`;
}

function renderContact(data) {
  const person = data.person || {};
  const links = list(data.links)
    .map((l) => `<li>${link(l.href, l.label)} &middot; ${esc(l.note)}</li>`)
    .join("");

  return `${heading("Contact", "Send the signal.", "")}
    ${person.email ? `<p>${link("mailto:" + person.email, person.email)}</p>` : ""}
    ${links ? `<ul>${links}</ul>` : ""}`;
}

const PAGES = {
  home: renderHome,
  work: renderWork,
  research: renderResearch,
  art: renderArt,
  writing: renderWriting,
  about: renderAbout,
  contact: renderContact,
};

/* ------------------------------------------------------------ injection -- */

// The header and footer links matter as much as the page text: they are how a
// crawler walks from one page to the next. Without them the only route to the
// inner pages is sitemap.xml, and nothing links to anything.
function renderShell(data, page) {
  const person = data.person || {};
  const nav = list(data.pages)
    .map(([id, label, href]) => `<a class="${id === page ? "active" : ""}" href="${esc(href)}">${esc(label)}</a>`)
    .join("");
  return `<a class="brand" href="index.html"><span>${esc(person.initials)}</span><b>${esc(person.name)}</b></a>
    <nav class="nav" aria-label="Portfolio navigation">${nav}</nav>`;
}

// Mirrors the footer app.js builds. It has to be the complete thing, because
// app.js leaves an existing .sitefoot alone rather than rendering a second one.
function renderFooter(data, page) {
  const person = data.person || {};
  const nav = list(data.pages)
    .filter(([id]) => id !== page)
    .map(([, label, href]) => `<a href="${esc(href)}">${esc(label)}</a>`)
    .join("");
  const year = new Date().getFullYear();
  return `<footer class="sitefoot">
    <div class="sitefoot-brand"><strong>${esc(person.name)}</strong><span>${esc(person.role)}</span></div>
    <nav class="sitefoot-nav" aria-label="Footer navigation">${nav}</nav>
    <div class="sitefoot-meta">
      <a href="mailto:${esc(person.email)}">${esc(person.email)}</a>
      <small>&copy; ${year} &middot; Designed &amp; built by ${esc(person.name)}</small>
    </div>
  </footer>`;
}

// The empty placeholders every page shell ships with.
const SHELL_SLOT = '<header class="topbar" data-shell></header>';
const PAGE_SLOT = '<section class="page" id="pageRoot"></section>';
const MAIN_CLOSE = "</main>";

// Replace without letting `$&`, `$'` and friends in the content be treated as
// replacement patterns, which would corrupt any text containing a dollar sign.
function fill(html, needle, replacement) {
  return html.indexOf(needle) === -1 ? html : html.replace(needle, () => replacement);
}

// Takes the raw text of one of the .html shells and returns it with the
// content filled in. Returns the input unchanged if anything is missing, a
// blank-but-working page is always better than a broken one.
function prerender(html) {
  const match = html.match(/<body[^>]*data-page="([a-z-]+)"/i);
  const page = match ? match[1] : "home";
  const render = PAGES[page];
  if (!render) return html;

  const data = loadContent();
  if (!data || !data.person) return html;

  let out = fill(html, PAGE_SLOT, `<section class="page" id="pageRoot">${render(data)}</section>`);
  out = fill(out, SHELL_SLOT, `<header class="topbar" data-shell>${renderShell(data, page)}</header>`);
  out = fill(out, MAIN_CLOSE, `${renderFooter(data, page)}</main>`);
  return out;
}

module.exports = { prerender, contentStamp };
