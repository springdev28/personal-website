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
  return `${kicker ? `<p>${esc(kicker)}</p>` : ""}<h1>${esc(title)}</h1>${intro ? `<p>${esc(intro)}</p>` : ""}`;
}

// A link is external when it points somewhere off the site (http, mailto).
function link(href, label) {
  const external = /^(https?:|mailto:)/i.test(href || "");
  return `<a href="${esc(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(label)}</a>`;
}

/* ---------------------------------------------------------------- pages -- */

function renderHome(data) {
  const person = data.person || {};
  const home = data.home || {};
  const menu = list(data.pages).filter(([id]) => id !== "home").map(([,title,href]) => `<li>${link(href,title)}</li>`).join("");
  const portrait = data.focusPhoto?.src ? `<figure><img src="${esc(data.focusPhoto.src)}" alt="${esc(data.focusPhoto.alt || person.name)}" width="400" height="400"><figcaption>${esc(person.location)}</figcaption></figure>` : "";
  return `<header><p>Code / Design / Art</p><h1>${esc(person.name)}</h1><p>${esc(home.intro || person.intro)}</p></header>
    ${portrait}<nav aria-label="Portfolio menu"><ul>${menu}</ul></nav>`;
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

  return `${heading("", "Work", "Selected software, products, and prototypes.")}${projects}`;
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

  return `${heading("", "Research", "Questions across learning, technology, and visual thinking.")}${items}`;
}

function renderArt(data) {
  const albums = list(data.artAlbums)
    .map((album) => {
      const pieces = list(album.pieces)
        .map((piece) => {
          const images = list(piece.images).length ? list(piece.images) : piece.image ? [piece.image] : [];
          const gallery = images.length ? `<figure>${images.map((src) => `<img src="${esc(src)}" alt="${esc(piece.title)}" loading="lazy">`).join("")}<figcaption>${esc(piece.title)}</figcaption></figure>` : "";
          return `<article>
            <h3>${esc(piece.title)}</h3>
            ${meta([piece.medium, piece.year])}
            ${gallery}
            ${piece.text ? `<p>${esc(piece.text)}</p>` : ""}
            ${bullets(list(piece.tags).filter((tag) => !/^figma$/i.test(tag)))}
          </article>`;
        })
        .join("");
      return `<section>
        <h2>${esc(album.name)}</h2>
        ${album.description ? `<p>${esc(album.description)}</p>` : ""}
        ${pieces}
      </section>`;
    })
    .join("");

  return `${heading("", "Art", "Posters, identities, comics, and illustrations.")}${albums}`;
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

  return `${heading("", "Writing", "Notes on building, learning, and design.")}${posts}`;
}

function renderLogs(data) {
  const folders = list(data.logProjects)
    .map((project) => `<article>
      <p>${esc(project.status)}</p>
      <h2>${link(project.href, project.title)}</h2>
      <p>${esc(project.description)}</p>
      <p>${link(project.href, "Open")}</p>
    </article>`)
    .join("");

  return `${heading("", "Logs", "Build histories and source records.")}${folders}`;
}

function casparelDayHistory(date) {
  const start = new Date(`${date}T00:00:00+03:00`);
  const end = new Date(start.getTime() + 86_400_000 - 1);
  const params = new URLSearchParams({ since: start.toISOString(), until: end.toISOString() });
  return `https://github.com/springdev28/casparel/commits/main/?${params}`;
}

function renderCasparelLogs(data) {
  const logs = list(data.casparelLogs);
  const highlights = data.casparelHighlights || {};
  const commits = logs.reduce((sum, entry) => sum + Number(entry.commits || 0), 0);
  const activeDays = logs.filter((entry) => Number(entry.commits || 0) > 0).length;
  const entries = logs
    .map((entry) => {
      const count = Number(entry.commits || 0);
      const work = list(highlights[entry.date])
        .map(([sha, label]) => `<li>${link(`https://github.com/springdev28/casparel/commit/${sha}`, `${sha} — ${label}`)}</li>`)
        .join("");
      return `<li>
        <article>
          <p><time datetime="${esc(entry.date)}">${esc(entry.date)}</time> &middot; ${count} ${count === 1 ? "commit" : "commits"}</p>
          <h2>${esc(entry.title)}</h2>
          <p>${esc(entry.summary)}</p>
          ${work ? `<h3>Selected work</h3><ul>${work}</ul>` : ""}
          ${bullets(entry.tags)}
          ${count > 0 ? `<p>${link(casparelDayHistory(entry.date), `View all ${count} ${count === 1 ? "commit" : "commits"} from this day`)}</p>` : ""}
        </article>
      </li>`;
    })
    .join("");

  return `<p>${link("logs.html", "Back to logs")}</p>
    ${heading("", "Casparel", "Daily development notes from the first commit.")}
    <p>${logs.length} calendar days &middot; ${commits} commits &middot; ${activeDays} active days &middot; ${logs.length - activeDays} quiet days</p>
    <p>${link("https://github.com/springdev28/casparel/commits/main", "View the source history")}</p>
    ${entries ? `<section><h2>Timeline</h2><ol>${entries}</ol></section>` : ""}`;
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

  return `${heading("", "About", `${person.name} · ${person.role}`)}
    ${story}
    ${person.now ? `<section><h2>Now</h2><p>${esc(person.now)}</p></section>` : ""}
    ${list(person.lookingFor).length ? `<section><h2>What I'm looking for</h2>${bullets(person.lookingFor)}</section>` : ""}
    ${skills ? `<section><h2>What I work with</h2>${skills}</section>` : ""}
    ${approach ? `<section><h2>Principles in practice</h2>${approach}</section>` : ""}
    <p>${link("contact.html", "Get in touch")}</p>`;
}

function renderContact(data) {
  const person = data.person || {};
  const links = list(data.links).map((item) => {
    const address = item.href.replace(/^(?:mailto:|https?:\/\/)/, "").replace(/^www\./, "").replace(/\/$/, "");
    return `<a href="${esc(item.href)}" target="_blank" rel="noopener noreferrer"><span class="contact-logo" style="--contact-icon:url('${esc(item.icon)}')" aria-hidden="true"></span><span class="contact-detail"><strong>${esc(item.label)}</strong><span class="contact-address">${esc(address)}</span></span><b aria-hidden="true">↗</b></a>`;
  }).join("");
  return `${heading("", "Contact", person.available)}
    <article class="link-panel" aria-label="Contact details">${links}</article>`;
}

const PAGES = {
  home: renderHome,
  work: renderWork,
  research: renderResearch,
  art: renderArt,
  writing: renderWriting,
  logs: renderLogs,
  "casparel-logs": renderCasparelLogs,
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
    .map(([id, label, href]) => `<a class="${id === page || (id === "logs" && page.endsWith("-logs")) ? "active" : ""}" href="${esc(href)}">${esc(label)}</a>`)
    .join("");
  return `<a class="brand" href="index.html"><span class="identity-symbol brand-mark" aria-hidden="true"><img src="assets/identity/asterisk-${page === "home" ? "ink" : "white"}.svg" alt=""></span><b>${esc(person.name)}<small>Code · Design · Art</small></b></a>
    <nav class="nav prerender-nav" aria-label="Portfolio navigation">${nav}</nav>`;
}

// Mirrors the contact invitation app.js builds, including its no-JS links.
function renderFooter(data, page) {
  const person = data.person || {};
  const socials = list(data.links)
    .filter((item) => /github|linkedin/i.test(item.label))
    .map((item) => `<a href="${esc(item.href)}" target="_blank" rel="noopener noreferrer">${esc(item.label)} ↗</a>`)
    .join("");
  const year = new Date().getFullYear();
  return `<footer class="sitefoot"><div class="footer-bottom">
      <a href="mailto:${esc(person.email)}">${esc(person.email)}</a>
      <div class="footer-socials">${socials}</div>
      <small>&copy; ${year} ${esc(person.name)}</small>
    </div></footer>`;
}

// The empty placeholders every page shell ships with.
const SHELL_SLOT = '<header class="topbar" data-shell></header>';
const PAGE_SLOT = /(<section class="page" id="pageRoot"(?: tabindex="-1")?>)\s*<\/section>/;
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

  let out = html.replace(PAGE_SLOT, (_, openingTag) => `${openingTag}${render(data)}</section>`);
  out = fill(out, SHELL_SLOT, `<header class="topbar" data-shell>${renderShell(data, page)}</header>`);
  out = fill(out, MAIN_CLOSE, `${renderFooter(data, page)}</main>`);
  return out;
}

module.exports = { prerender, contentStamp };
