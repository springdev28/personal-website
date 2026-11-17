const data = window.portfolio;
const page = document.body.dataset.page || "home";
const root = document.querySelector("#pageRoot");
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function safe(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function identitySymbol(tone = "ink", extraClass = "") {
  return `<span class="identity-symbol identity-${tone} ${extraClass}" aria-hidden="true"><span class="identity-shape"></span></span>`;
}

function tags(items) {
  return items.map((item) => `<span class="tag">${safe(item)}</span>`).join("");
}

function renderShell() {
  const nav = data.pages.map(([id, label, href]) => {
    const active = id === page || (id === "logs" && page.endsWith("-logs"));
    return `<a class="${active ? "active" : ""}" ${active ? 'aria-current="page"' : ""} href="${href}">${label}</a>`;
  }).join("");
  document.querySelector("[data-shell]").innerHTML = `
    <a class="skip-link" href="#pageRoot">Skip to content</a>
    <a class="brand" href="index.html">${identitySymbol("white", "brand-mark")}<span>Bahar Yüksel</span></a>
    <nav class="nav" id="mainNav" aria-label="Portfolio navigation">${nav}</nav>
    <div class="nav-tools"><button class="motion-toggle" type="button" aria-pressed="false" aria-label="Pause animations"><span aria-hidden="true">Ⅱ</span> Motion</button><button id="openSearch" class="search-btn" type="button" aria-label="Search portfolio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg></button><button class="menu-toggle" type="button" aria-controls="mainNav" aria-expanded="false">Menu <span>＋</span></button></div>`;
  const toggle = $(".menu-toggle");
  const closeMenu = () => { toggle.setAttribute("aria-expanded", "false"); $(".topbar").classList.remove("menu-open"); };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    $(".topbar").classList.toggle("menu-open", open);
  });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
  const motion = $(".motion-toggle");
  let paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
  try { const setting = localStorage.getItem("portfolio-motion"); if (setting) paused = setting === "paused"; } catch {}
  const setMotion = () => {
    document.documentElement.classList.toggle("motion-paused", paused);
    motion.setAttribute("aria-pressed", String(paused));
    motion.setAttribute("aria-label", paused ? "Resume animations" : "Pause animations");
    motion.innerHTML = `<span aria-hidden="true">${paused ? "▷" : "Ⅱ"}</span> Motion`;
    if (paused) $$("[data-type-code]").forEach(el => { el.textContent = el.dataset.typeCode; });
    document.dispatchEvent(new Event("portfolio-motion-change"));
  };
  setMotion();
  motion.addEventListener("click", () => {
    paused = !paused;
    try { localStorage.setItem("portfolio-motion", paused ? "paused" : "on"); } catch {}
    setMotion();
  });
}

function codePanel(extraClass = "") {
  const code = 'const bahar = {\n  code: "build",\n  design: "explore",\n  art: "express"\n};';
  return `<div class="code-panel ${extraClass}"><div class="code-panel-bar"><span>bahar.js</span><button type="button" data-replay-code aria-label="Replay code animation">↻</button></div><pre aria-hidden="true"><code data-type-code="${safe(code)}">${safe(code)}</code><span class="code-caret"></span></pre><span class="sr-only">Code, design, and art.</span></div>`;
}

function pageMotion(scene = page) {
  if (scene === "work") return codePanel("hero-code");
  if (scene === "writing") return `<div class="writing-motion" aria-hidden="true"><span>one more idea.</span><svg viewBox="0 0 320 35"><path d="M8 24C83 2 200 3 306 18M185 26l116-2"/></svg><i>✎</i></div>`;
  if (scene === "about") return "";
  const symbol = ({research:"?",logs:"↗","casparel-logs":"↗",contact:"↗"})[scene];
  return `<div class="hero-emblem emblem-${safe(scene)}" aria-hidden="true">${symbol ? `${identitySymbol("white", "hero-watermark")}<span class="hero-symbol">${symbol}</span>` : identitySymbol("cyan", "hero-identity")}</div>`;
}

function hero(kicker, title, body = "", action = "") {
  return `<header class="hero${action ? " has-action" : ""}"><div class="hero-copy"><a class="page-trail" href="index.html"><span>↖</span> Menu</a><div class="hero-heading"><h1>${title}</h1></div>${body ? `<p class="hero-description">${body}</p>` : ""}</div>${action ? `<aside class="hero-aside">${action}</aside>` : pageMotion()}</header>`;
}

function button(label, href) {
  return `<a class="button" href="${href}">${label}<span>→</span></a>`;
}

function projectCard(project, index) {
  const m = mediaAttrs(project);
  const art = project.image
    ? `<div class="project-art has-media${m.cls}"${m.style}><img src="${project.image}" alt="${safe(project.title)}" loading="lazy" onerror="this.parentElement.classList.add('img-failed');this.remove()"></div>`
    : `<div class="project-art project-initial" aria-hidden="true">${safe(project.title.slice(0, 1))}</div>`;
  return `<article class="project-card" data-index="${index}" data-category="${project.category}">
    <div class="project-cover">${art}<span class="project-cover-title">${safe(project.title)}</span></div>
    <div class="project-copy">
      <small>${project.type} · ${project.year}</small>
      <h2>${project.title}</h2>
      <p>${project.summary}</p>
      <div>${tags(project.tags)}</div>
      <footer><button type="button" data-open-project="${index}">Details <span>↗</span></button>${project.href ? `<a href="${safe(project.href)}" target="_blank" rel="noopener noreferrer">Visit ↗</a>` : ""}</footer>
    </div>
  </article>`;
}

function researchCard(item, index) {
  return `<article class="research-card">
    <div class="research-note-top"><span>${safe(item.area)}</span><small>${item.year}</small></div>
    <h2>${item.title}</h2>
    <p class="research-question">${item.question}</p>
    <div>${tags(item.notes)}</div>
    <footer><strong>${item.status}</strong></footer>
  </article>`;
}

function getAlbums() {
  if (Array.isArray(data.artAlbums) && data.artAlbums.length) return data.artAlbums;
  if (Array.isArray(data.art) && data.art.length) return [{ name: "Art", description: "", pieces: data.art }];
  return [];
}

// An art piece may have one `image` or several `images` (a gallery). These
// helpers give the full list, or just the first (used for cover thumbnails).
function imageList(item) {
  if (Array.isArray(item.images) && item.images.length) return item.images;
  return item.image ? [item.image] : [];
}
function firstImage(item) {
  return imageList(item)[0] || "";
}

// Build the class + inline style for a media panel from an item's imageBg
// (panel background color; turns on "logo" contain mode) and imageScale (how
// big the image sits in its panel). Works for projects and art pieces alike.
function mediaAttrs(item) {
  const styles = [];
  if (item.imageBg) styles.push(`--img-bg:${item.imageBg}`);
  if (item.imageScale) styles.push(`--logo-max:${item.imageScale}`);
  return { cls: item.imageBg ? " is-logo" : "", style: styles.length ? ` style="${styles.join(";")}"` : "" };
}

function canvasArt(item, extraClass = "") {
  const cover = firstImage(item);
  const m = mediaAttrs(item);
  return cover
    ? `<div class="canvas-art has-media ${extraClass}${m.cls}"${m.style}><img src="${cover}" alt="${safe(item.title || "")}" loading="lazy" onerror="this.parentElement.classList.add('img-failed');this.remove()"></div>`
    : `<div class="canvas-art type-cover ${extraClass}"><strong>${safe(item.title || "Untitled")}</strong><small>${safe(item.medium || "")}</small></div>`;
}

function artCard(item, pieceIndex, albumIndex) {
  return `<button type="button" class="art-card interactive-card" data-album="${albumIndex}" data-piece="${pieceIndex}" style="--a:${item.palette[0]};--b:${item.palette[1]};--c:${item.palette[2]}">
    ${canvasArt(item)}
    <strong>${safe(item.title)}</strong>
    <p>${safe(item.medium)} / ${safe(item.year)}</p>
  </button>`;
}

function folderCover(title, count, href, cover = "design", extraClass = "") {
  const coverImages = { design: "assets/works/graphic-novel.webp", robotics: "Carcharodon-cutout.png", comics: "Sayfa_1.png", editorial: "MS1.png", characters: "Nihilunus.png", misc: "Macbeth 3.png" };
  const shortNames = { design: "VISUAL\nDESIGN", robotics: "RC\nMAKERS", comics: "GRAPHIC\nNOVELS", editorial: "EDITORIAL", characters: "CHARACTER\nART", misc: "OTHER\nWORLDS" };
  return `<a class="graphic-folder folder-${safe(cover)} ${extraClass}" href="${safe(href)}" aria-label="Open ${safe(title)} folder">
    <span class="folder-tab" aria-hidden="true">${count} WORKS</span>
    <span class="folder-front"><span class="folder-edge" aria-hidden="true"></span>
      <span class="folder-cover-art" aria-hidden="true">${coverImages[cover] ? `<img src="${coverImages[cover]}" alt="" loading="lazy">` : ""}</span>
      <span class="folder-cover-type" aria-hidden="true">${safe(shortNames[cover] || title).replace(/\n/g,"<br>")}</span>
      <span class="folder-label"><strong>${safe(title)}</strong><b aria-hidden="true">↗</b></span>
    </span></a>`;
}

function albumCard(album, index) {
  return `<article class="album-folder-card">
    ${folderCover(album.name, album.pieces.length, `#a=${index}`, album.folderCover)}
  </article>`;
}

function workspaceMarkup(extraClass = "") {
  return `<div class="sculpture-stage ${extraClass}" data-sculpture>
    <div class="sculpture-fallback" aria-hidden="true"><span class="sculpture-fallback-mark"></span></div>
    <canvas data-sculpture-canvas tabindex="0" role="img" aria-label="Interactive 3D creative workspace. Drag or use arrow keys to rotate."></canvas>
    <div class="sculpture-toolbar"><div class="sculpture-models" role="group" aria-label="Creative workspace"><button type="button" data-sculpture-model="code" aria-pressed="true">Code</button><button type="button" data-sculpture-model="design" aria-pressed="false">Design</button><button type="button" data-sculpture-model="art" aria-pressed="false">Art</button></div><button type="button" data-sculpture-motion aria-pressed="false" aria-label="Pause workspace motion">Pause</button></div>
    <p class="sr-only" data-sculpture-status aria-live="polite">Code scene selected.</p>
  </div>`;
}

function renderHome() {
  const home = data.home || {};
  const menu = (id, label, href, className = "") => `<a href="${href}" class="launch-link ${className}" data-launch="${id}"><strong>${label}</strong><span aria-hidden="true">↗</span></a>`;
  root.innerHTML = `
    <section class="launch-screen" aria-label="Bahar Yüksel portfolio">
      <div class="launch-backdrop" aria-hidden="true"><div class="backdrop-purple"></div><div class="backdrop-cyan"></div><div class="backdrop-hatch"></div><span class="backdrop-word">CREATE.</span>${identitySymbol("pink", "burst burst-one")}${identitySymbol("lime", "burst burst-two")}<div class="speed-lines"><i></i><i></i><i></i></div></div>
      <div class="launch-heading"><p class="launch-kicker">Code / Design / Art</p><h1><span>${safe(data.person.name.split(" ")[0])}</span><span>${safe(data.person.name.split(" ").slice(1).join(" "))}${identitySymbol("lime", "name-logo")}</span></h1><p class="launch-intro">${safe(home.intro || data.person.intro)}</p></div>
      <figure class="launch-portrait"><div class="portrait-frame" aria-hidden="true"></div><div class="portrait-halftone" aria-hidden="true"></div>${data.focusPhoto?.src ? `<img src="${safe(data.focusPhoto.src)}" alt="${safe(data.focusPhoto.alt)}" fetchpriority="high" decoding="async">` : `<span class="portrait-initials">${safe(data.person.initials)}</span>`}<figcaption><span>Istanbul, Türkiye</span><b>Always making.</b></figcaption></figure>
      <nav class="launch-menu launch-menu-left" aria-label="Explore my work">
        ${menu("work","Work","work.html","selected")}
        ${menu("art","Art","art.html")}
        ${menu("research","Research","research.html")}
      </nav>
      <nav class="launch-menu launch-menu-right" aria-label="More about me">
        ${menu("about","About","about.html")}
        ${menu("writing","Writing","writing.html")}
        ${menu("contact","Contact","contact.html")}
      </nav>
      ${codePanel("launch-code")}
      <div class="launch-bottom"><a href="logs.html"><span class="status-dot"></span> Build logs <span>↗</span></a><button type="button" class="studio-trigger" data-open-workspace>3D studio <span>⤢</span></button><span class="launch-key-hint">↑ ↓ TO EXPLORE · ENTER TO OPEN</span></div>
    </section>`;
  const menuLinks = $$("[data-launch]");
  let selected = 0;
  const select = (index) => { selected = index; menuLinks.forEach((el, i) => el.classList.toggle("selected", i === index)); };
  menuLinks.forEach((el,i) => { el.addEventListener("pointerenter", () => select(i)); el.addEventListener("focus", () => select(i)); });
  document.addEventListener("keydown", event => {
    if (page !== "home" || $("dialog[open]") || $(".topbar").classList.contains("menu-open") || /INPUT|TEXTAREA|BUTTON/.test(event.target.tagName)) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      select((selected + (event.key === "ArrowDown" ? 1 : -1) + menuLinks.length) % menuLinks.length);
      menuLinks[selected].focus({preventScroll:true});
    } else if (event.key === "Enter" && event.target === document.body) {
      menuLinks[selected].click();
    }
  });
  window.initPortraitVFX?.($(".launch-portrait"));
}

function openWorkspace() {
  const dialog = $("#featureDialog");
  dialog.classList.remove("art-dialog");
  dialog.innerHTML = `<form method="dialog"><button aria-label="Close 3D studio">×</button></form><article class="workspace-modal"><p class="kicker">Playground</p><h2>3D studio</h2>${workspaceMarkup("workspace-expanded")}</article>`;
  dialog.showModal();
  const stage = dialog.querySelector("[data-sculpture]");
  Promise.resolve(window.initSculpture?.(stage)).then(destroy => { if (!dialog.open) destroy?.(); });
  dialog.addEventListener("close", () => stage.sculpture?.destroy(), { once: true });
}

function renderWork() {
  const cats = ["All", ...new Set(data.projects.map((p) => p.category))];
  root.innerHTML = `${hero("", "Work", "Selected software, products, and prototypes.")}
    <div class="filters">${cats.map((cat, index) => `<button class="filter ${index === 0 ? "active" : ""}" aria-pressed="${index === 0}" data-filter="${cat}">${cat}</button>`).join("")}</div>
    <div class="project-grid wide">${data.projects.map(projectCard).join("")}</div>`;
}

function renderResearch() {
  root.innerHTML = `${hero("", "Research", "Questions I am exploring across learning, technology, and design.")}
    <section class="research-grid">${data.research.map(researchCard).join("")}</section>`;
}

function renderArt() {
  const albums = getAlbums();
  const match = location.hash.match(/a=(\d+)/);
  const activeIndex = match ? Number(match[1]) : -1;
  const active = albums[activeIndex];

  if (active) {
    root.innerHTML = `<a class="back-link" href="#">← All folders</a>
      ${hero("", safe(active.name), active.description ? safe(active.description) : "")}
      <div class="art-grid">${active.pieces.map((piece, i) => artCard(piece, i, activeIndex)).join("")}</div>`;
    return;
  }

  root.innerHTML = `${hero("", "Art", "Posters, identities, comics, and illustrations.")}
    <div class="album-grid">${albums.map(albumCard).join("")}</div>`;
}

function renderWriting() {
  root.innerHTML = `${hero("", "Writing", "Notes on building, learning, and design.")}
    <section class="writing-layout">
      <div class="post-grid">${data.posts.map((post, index) => `<article class="post-card" data-post="${index}" tabindex="0" role="button" aria-label="Read ${safe(post.title)}"><div class="post-topline"><small>${post.category} · ${post.read}</small></div><h2>${post.title}</h2><p>${safe(post.excerpt)}</p><footer><time>${new Date(post.date).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}</time><span class="post-read">Read <span aria-hidden="true">↗</span></span></footer></article>`).join("")}</div>
    </section>`;
}

function logDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" });
}

function renderLogs() {
  const projects = Array.isArray(data.logProjects) ? data.logProjects : [];
  root.innerHTML = `${hero("", "Logs", "Build histories and source records.")}
    <section class="log-folders" aria-label="Project log folders">${projects.map((project) => `<a class="log-folder" href="${safe(project.href)}"${project.external ? ' target="_blank" rel="noopener noreferrer"' : ""}><small>${safe(project.status)}</small><h2>${safe(project.title)}</h2><p>${safe(project.description)}</p><span class="log-folder-arrow" aria-hidden="true">↗</span></a>`).join("")}</section>`;
}

function casparelDayHistory(date) {
  const start = new Date(`${date}T00:00:00+03:00`);
  const end = new Date(start.getTime() + 86_400_000 - 1);
  const params = new URLSearchParams({ since: start.toISOString(), until: end.toISOString() });
  return `https://github.com/springdev28/casparel/commits/main/?${params}`;
}

function renderCasparelLogs() {
  const logs = Array.isArray(data.casparelLogs) ? data.casparelLogs : [];
  const highlights = data.casparelHighlights || {};
  const commitTotal = logs.reduce((sum, entry) => sum + Number(entry.commits || 0), 0);
  const activeDays = logs.filter((entry) => entry.commits > 0).length;
  const quietDays = logs.length - activeDays;
  const entries = logs
    .map((entry) => {
      const commits = Number(entry.commits || 0);
      const count = commits === 0 ? "Quiet day" : `${commits} ${commits === 1 ? "commit" : "commits"}`;
      const work = Array.isArray(highlights[entry.date]) ? highlights[entry.date] : [];
      const linkedWork = work.length ? `<section class="log-work"><h3>Selected work</h3><ul>${work.map(([sha, label]) => `<li><a href="https://github.com/springdev28/casparel/commit/${safe(sha)}" target="_blank" rel="noopener noreferrer"><code>${safe(sha)}</code><span>${safe(label)}</span><b aria-hidden="true">↗</b></a></li>`).join("")}</ul></section>` : "";
      const allCommits = commits > 0 ? `<a class="log-day-link" href="${safe(casparelDayHistory(entry.date))}" target="_blank" rel="noopener noreferrer">View all ${commits} ${commits === 1 ? "commit" : "commits"} from this day <span>↗</span></a>` : "";
      return `<article class="log-entry${commits === 0 ? " quiet" : ""}">
        <span class="log-marker" aria-hidden="true"></span>
        <header><div><time datetime="${safe(entry.date)}">${logDate(entry.date)}</time></div><strong>${count}</strong></header>
        <h2>${safe(entry.title)}</h2>
        <p>${safe(entry.summary)}</p>
        ${linkedWork}
        ${entry.tags?.length ? `<div class="log-tags">${tags(entry.tags)}</div>` : ""}
        ${allCommits}
      </article>`;
    })
    .join("");

  root.innerHTML = `<a class="back-link" href="logs.html">← Logs</a>${hero(
    "",
    "Casparel",
    "Daily development notes from the first commit.",
    '<a class="button" href="https://github.com/springdev28/casparel/commits/main" target="_blank" rel="noopener noreferrer">GitHub<span>↗</span></a>'
  )}
    <section class="log-summary" aria-label="Casparel log summary">
      <article><strong>${logs.length}</strong><span>calendar days</span></article>
      <article><strong>${commitTotal}</strong><span>commits recorded</span></article>
      <article><strong>${activeDays}</strong><span>active days</span></article>
      <article><strong>${quietDays}</strong><span>quiet days</span></article>
    </section>
    <section class="log-timeline" aria-label="Casparel development timeline">${entries}</section>`;
}

function renderAbout() {
  const story = (data.person.story || []).map((para) => `<p>${safe(para)}</p>`).join("");
  const skillGroups = (data.skillGroups || [])
    .map((g) => `<div class="skill-group"><small>${safe(g.group)}</small><div>${tags(g.items)}</div></div>`)
    .join("");
  const lookingFor = (data.person.lookingFor || []).map((item) => `<li>${safe(item)}</li>`).join("");
  const approach = (data.approach || [])
    .map((item) => `<div class="approach-item"><strong>${safe(item.title)}</strong><p>${safe(item.text)}</p></div>`)
    .join("");

  const portrait = data.focusPhoto?.src ? `<figure class="about-portrait"><img src="${safe(data.focusPhoto.src)}" alt="${safe(data.focusPhoto.alt)}"><figcaption>${safe(data.person.name)}<span>${safe(data.person.location)}</span></figcaption></figure>` : '';
  root.innerHTML = `${hero("", "About", `${safe(data.person.name)} · ${safe(data.person.role)}`, portrait)}
    <section class="story-layout">
      <article class="story-card">${story || `<p>${safe(data.person.about || "")}</p>`}</article>
      <aside class="story-side">
        <div class="side-panel"><p class="kicker">Now</p><p>${safe(data.person.now)}</p></div>
        ${lookingFor ? `<div class="side-panel"><p class="kicker">What I'm looking for</p><ul>${lookingFor}</ul></div>` : ""}
        <a class="button" href="contact.html">Get in touch<span>→</span></a>
      </aside>
    </section>
    ${skillGroups ? `<section class="section-block"><div class="section-head"><div><p class="kicker">Toolkit</p><h2>What I work with</h2></div></div><div class="skill-groups">${skillGroups}</div></section>` : ""}
    ${approach ? `<section class="section-block approach-block"><div class="section-head"><div><p class="kicker">How I work</p><h2>Principles in practice</h2></div></div><div class="approach-grid">${approach}</div></section>` : ""}`;
}

function renderContact() {
  root.innerHTML = `${hero("", "Contact", safe(data.person.available))}
    <section class="contact-grid">
      <article class="link-panel">${data.links.map((link) => `<a href="${link.href}" target="_blank" rel="noopener noreferrer"><strong>${link.label}<b aria-hidden="true">↗</b></strong></a>`).join("")}</article>
      <form class="contact-form" id="contactForm"><div class="letter-address"><strong>${safe(data.person.name)}</strong><a href="mailto:${safe(data.person.email)}">${safe(data.person.email)}</a>${identitySymbol("ink", "letter-stamp")}</div><label><span>Email</span><input type="email" required placeholder="name@example.com" autocomplete="email"></label><label><span>Message</span><textarea required rows="7"></textarea></label><div class="letter-actions"><button class="button" type="submit">Email<span>↗</span></button></div></form>
    </section>`;
}

function renderPage() {
  ({ home: renderHome, work: renderWork, research: renderResearch, art: renderArt, writing: renderWriting, logs: renderLogs, "casparel-logs": renderCasparelLogs, about: renderAbout, contact: renderContact }[page] || renderHome)();
  bindPage();
  animateIn();
  bindMotion();
}

// Reveal elements as they scroll into view (staggered by position in their row/grid).
// Note: elements centered via CSS transform (.intro-copy, .intro-portrait) are
// excluded, a transform-based reveal would fight their positioning.
const REVEAL_SELECTOR = ".hero, .section-block, .project-card, .research-card, .art-card, .album-card, .discipline-card, .post-card, .log-folder, .log-summary article, .log-entry, .story-card, .side-panel, .skill-group, .approach-item, .back-link";
function animateIn() {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const els = $$(REVEAL_SELECTOR);
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in"));
    return;
  }
  els.forEach((el) => {
    el.classList.add("reveal");
    const sibs = el.parentElement ? Array.from(el.parentElement.children) : [el];
    const idx = Math.max(0, sibs.indexOf(el));
    el.style.setProperty("--reveal-delay", `${Math.min(idx, 5) * 70}ms`);
  });
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
  );
  els.forEach((el) => io.observe(el));
}


let motionObserver;
const codeTimers = new Set();
function bindMotion() {
  codeTimers.forEach(clearTimeout); codeTimers.clear();
  motionObserver?.disconnect();
  const reduced = () => document.documentElement.classList.contains("motion-paused") || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const type = el => {
    if (el._typeTimer) { clearTimeout(el._typeTimer); codeTimers.delete(el._typeTimer); }
    const full = el.dataset.typeCode;
    if (reduced()) { el.textContent = full; return; }
    el.textContent = "";
    let i = 0;
    const tick = () => {
      if (!el.isConnected || reduced()) { el.textContent = full; return; }
      if (document.hidden) { el._typeTimer = setTimeout(tick,250); codeTimers.add(el._typeTimer); return; }
      el.textContent = full.slice(0, ++i);
      if (i < full.length) {
        el._typeTimer = setTimeout(() => { codeTimers.delete(el._typeTimer); tick(); }, full[i-1] === "\n" ? 150 : 32);
        codeTimers.add(el._typeTimer);
      }
    };
    tick();
  };
  motionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { type(entry.target); motionObserver.unobserve(entry.target); }
  }), {threshold: .35});
  $$("[data-type-code]").forEach(el => motionObserver.observe(el));
  $$("[data-replay-code]").forEach(button => button.addEventListener("click", () => type(button.closest(".code-panel").querySelector("[data-type-code]"))));
}

function renderFooter() {
  const shell = document.querySelector(".shell");
  if (!shell) return;
  shell.querySelector(".sitefoot")?.remove();
  const footer = document.createElement("footer");
  footer.className = "sitefoot";
  footer.innerHTML = `<div class="footer-bottom"><a href="mailto:${data.person.email}">${safe(data.person.email)}</a><div class="footer-socials">${data.links.filter(l => /github|linkedin/i.test(l.label)).map(l => `<a href="${l.href}" target="_blank" rel="noopener noreferrer">${safe(l.label)} ↗</a>`).join('')}</div><small>© ${new Date().getFullYear()} ${safe(data.person.name)}</small></div>`;
  shell.appendChild(footer);
}

function bindPage() {
  $$("[data-open-workspace]").forEach(button => button.addEventListener("click", openWorkspace));
  const featureDialog = $("#featureDialog");
  featureDialog.onkeydown = (event) => {
    const viewer = featureDialog.querySelector("[data-art-album][data-art-piece]");
    if (!viewer || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const albumIndex = Number(viewer.dataset.artAlbum);
    const pieceIndex = Number(viewer.dataset.artPiece);
    const length = getAlbums()[albumIndex]?.pieces.length || 1;
    openArt(albumIndex, event.key === "ArrowRight" ? (pieceIndex + 1) % length : (pieceIndex - 1 + length) % length);
  };
  $$(".interactive-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const box = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${((event.clientX - box.left) / box.width) * 100}%`);
      card.style.setProperty("--my", `${((event.clientY - box.top) / box.height) * 100}%`);
    });
  });
  $$(".filter").forEach((filter) => {
    filter.addEventListener("click", () => {
      $$(".filter").forEach((item) => { item.classList.remove("active"); item.setAttribute("aria-pressed", "false"); });
      filter.classList.add("active");
      filter.setAttribute("aria-pressed", "true");
      $$(".project-card").forEach((card) => {
        card.hidden = filter.dataset.filter !== "All" && filter.dataset.filter !== card.dataset.category;
      });
    });
  });
  $$("[data-open-project]").forEach((buttonEl) => buttonEl.addEventListener("click", () => openProject(Number(buttonEl.dataset.openProject))));
  $$("[data-piece]").forEach((buttonEl) => buttonEl.addEventListener("click", () => openArt(Number(buttonEl.dataset.album), Number(buttonEl.dataset.piece))));
  $$("[data-post]").forEach((el) => {
    el.addEventListener("click", () => openPost(Number(el.dataset.post)));
    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openPost(Number(el.dataset.post)); }
    });
  });
  $("#colorRange")?.addEventListener("input", (event) => $("#colorField").style.setProperty("--mix", `${event.target.value}%`));
  $("#contactForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const [email, message] = Array.from(event.currentTarget.elements);
    location.href = `mailto:${data.person.email}?subject=Portfolio inquiry&body=${encodeURIComponent(`From: ${email.value}\n\n${message.value}`)}`;
  });
}

function mediaBlock(item, title) {
  if (item.embed) return `<div class="modal-embed"><iframe src="${item.embed}" title="${safe(title)}" loading="lazy" allowfullscreen></iframe></div>`;
  const imgs = imageList(item);
  if (imgs.length > 1) {
    return `<div class="modal-gallery">${imgs
      .map((src) => `<div class="gal-item"><img class="zoomable" src="${src}" alt="${safe(title)}" loading="lazy" onerror="this.parentElement.classList.add('img-failed');this.remove()"></div>`)
      .join("")}</div>`;
  }
  if (imgs.length === 1) {
    const m = mediaAttrs(item);
    return `<div class="modal-media${m.cls}"${m.style}><img class="zoomable" src="${imgs[0]}" alt="${safe(title)}" onerror="this.parentElement.classList.add('img-failed');this.remove()"></div>`;
  }
  return "";
}

function openProject(index) {
  const p = data.projects[index];
  $("#featureDialog").classList.remove("art-dialog");
  $("#featureDialog").innerHTML = `<form method="dialog"><button aria-label="Close">×</button></form><article class="modal-card" style="--accent:${p.color}">${mediaBlock(p, p.title)}<p class="kicker">${p.type} / ${p.year}</p><h2>${p.title}</h2><p>${p.summary}</p>${p.why ? `<p class="modal-why"><span>Why I built it</span>${safe(p.why)}</p>` : ""}<dl><div><dt>Role</dt><dd>${p.role}</dd></div><div><dt>Result</dt><dd>${p.result}</dd></div></dl><div>${tags(p.tags)}</div>${p.href ? `<a class="button" href="${safe(p.href)}" target="_blank" rel="noopener noreferrer">Open project<span>↗</span></a>` : ""}</article>`;
  $("#featureDialog").showModal();
}

function openArt(albumIndex, pieceIndex) {
  const album = getAlbums()[albumIndex];
  const a = album?.pieces[pieceIndex];
  if (!a) return;
  const pieces = album.pieces;
  const previous = (pieceIndex - 1 + pieces.length) % pieces.length;
  const next = (pieceIndex + 1) % pieces.length;
  const visual = a.embed || imageList(a).length ? mediaBlock(a, a.title) : canvasArt(a, "large");
  const dialog = $("#featureDialog");
  dialog.classList.add("art-dialog");
  dialog.setAttribute("aria-label", `${a.title} — artwork viewer`);
  dialog.innerHTML = `<form method="dialog" class="art-viewer-close"><button aria-label="Close artwork viewer">×</button></form><article class="art-viewer" data-art-album="${albumIndex}" data-art-piece="${pieceIndex}" style="--a:${a.palette[0]};--b:${a.palette[1]};--c:${a.palette[2]}">
    <div class="art-viewer-stage">${visual}<div class="art-viewer-count">${pieceIndex + 1} / ${pieces.length}</div></div>
    <aside class="art-viewer-copy"><p class="kicker">${safe(album.name)} · ${safe(a.medium)} · ${safe(a.year)}</p><h2>${safe(a.title)}</h2><p>${safe(a.text)}</p><div>${tags((a.tags || []).filter((tag) => !/^figma$/i.test(tag)))}</div><div class="art-viewer-nav"><button type="button" data-art-piece-target="${previous}" aria-label="Previous artwork">←</button><button type="button" data-art-piece-target="${next}" aria-label="Next artwork">→</button></div></aside>
    <nav class="art-viewer-strip" aria-label="Works in ${safe(album.name)}">${pieces.map((piece, index) => `<button type="button" data-art-piece-target="${index}" class="${index === pieceIndex ? "active" : ""}" aria-label="View ${safe(piece.title)}"><strong>${safe(piece.title)}</strong></button>`).join("")}</nav>
  </article>`;
  dialog.querySelectorAll("[data-art-piece-target]").forEach((control) => control.addEventListener("click", () => openArt(albumIndex, Number(control.dataset.artPieceTarget))));
  if (!dialog.open) dialog.showModal();
  dialog.querySelector(".art-viewer-close button").focus({ preventScroll: true });
}

function openPost(index) {
  const post = data.posts[index];
  if (!post) return;
  $("#featureDialog").classList.remove("art-dialog");
  const body = Array.isArray(post.body) && post.body.length
    ? post.body.map((para) => `<p>${safe(para)}</p>`).join("")
    : `<p>${safe(post.excerpt || "")}</p>`;
  const date = new Date(post.date).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" });
  $("#featureDialog").innerHTML = `<form method="dialog"><button aria-label="Close">×</button></form><article class="modal-card modal-article"><p class="kicker">${safe(post.category)} / ${safe(post.read)}</p><h2>${safe(post.title)}</h2><time>${date}</time><div class="article-body">${body}</div></article>`;
  $("#featureDialog").showModal();
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function searchable() {
  return [
    ...data.pages.map(([id, label, href]) => ({ title: label, meta: "Page", text: id, href })),
    ...data.projects.map((p) => ({ title: p.title, meta: p.type, text: p.summary, href: "work.html" })),
    ...data.research.map((r) => ({ title: r.title, meta: r.area, text: r.question, href: "research.html" })),
    ...getAlbums().flatMap((al, albumIndex) => al.pieces.map((a) => ({ title: a.title, meta: a.medium, text: a.text, href: `art.html#a=${albumIndex}` }))),
    ...data.posts.map((p) => ({ title: p.title, meta: p.category, text: p.excerpt, href: "writing.html" })),
    ...(data.logProjects || []).map((project) => ({ title: project.title, meta: project.type, text: project.description, href: project.href })),
    ...(data.casparelLogs || []).map((entry) => ({ title: entry.title, meta: `Casparel / ${entry.date}`, text: entry.summary, href: "casparel-logs.html" })),
  ];
}

function searchResultMarkup(query = "") {
  const q = query.toLowerCase();
  return searchable()
    .filter((item) => `${item.title} ${item.meta} ${item.text}`.toLowerCase().includes(q))
    .slice(0, 8)
    .map((item) => `<a href="${item.href}"><span>${item.meta}</span><strong>${item.title}</strong><p>${item.text}</p></a>`)
    .join("");
}

function renderSearch() {
  $("#searchDialog").innerHTML = `<form method="dialog" class="search-head"><label>Search<input id="searchInput" type="search" placeholder="Project, art, writing..."></label><button aria-label="Close">×</button></form><div id="searchResults" class="search-results">${searchResultMarkup()}</div>`;
  $("#searchInput")?.addEventListener("input", (event) => {
    $("#searchResults").innerHTML = searchResultMarkup(event.target.value);
  });
  $("#searchResults")?.addEventListener("click", () => $("#searchDialog").close());
}

function bindSearch() {
  $("#openSearch").addEventListener("click", () => {
    renderSearch();
    $("#searchDialog").showModal();
    $("#searchInput").focus();
  });
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      renderSearch();
      $("#searchDialog").showModal();
      $("#searchInput").focus();
    }
  });
}

// --- Image preview lightbox (click any .zoomable image to open; scroll or the
// +/- buttons to zoom; drag to pan; Esc / click outside / × to close) ---
function ensureLightbox() {
  let lb = document.getElementById("lightbox");
  if (lb) return lb;
  lb = document.createElement("dialog");
  lb.id = "lightbox";
  lb.className = "lightbox";
  lb.innerHTML =
    '<button class="lb-btn lb-close" type="button" aria-label="Close preview">×</button>' +
    '<div class="lb-stage"><img class="lb-img" alt=""></div>' +
    '<div class="lb-controls">' +
    '<button class="lb-btn lb-out" type="button" aria-label="Zoom out">−</button>' +
    '<button class="lb-btn lb-reset" type="button" aria-label="Reset zoom">100%</button>' +
    '<button class="lb-btn lb-in" type="button" aria-label="Zoom in">+</button></div>';
  document.body.appendChild(lb);

  const img = lb.querySelector(".lb-img");
  const stage = lb.querySelector(".lb-stage");
  const resetBtn = lb.querySelector(".lb-reset");
  const s = { scale: 1, x: 0, y: 0, dragging: false, px: 0, py: 0 };
  lb._img = img;

  function apply() {
    img.style.transform = `translate(${s.x}px, ${s.y}px) scale(${s.scale})`;
    resetBtn.textContent = Math.round(s.scale * 100) + "%";
    img.style.cursor = s.scale > 1 ? (s.dragging ? "grabbing" : "grab") : "zoom-in";
  }
  function setScale(next) {
    s.scale = Math.min(6, Math.max(1, Math.round(next * 100) / 100));
    if (s.scale === 1) { s.x = 0; s.y = 0; }
    apply();
  }
  lb._setScale = setScale;

  lb.querySelector(".lb-in").addEventListener("click", (e) => { e.stopPropagation(); setScale(s.scale + 0.4); });
  lb.querySelector(".lb-out").addEventListener("click", (e) => { e.stopPropagation(); setScale(s.scale - 0.4); });
  resetBtn.addEventListener("click", (e) => { e.stopPropagation(); setScale(1); });
  lb.querySelector(".lb-close").addEventListener("click", () => lb.close());
  // Click on the empty stage (not the image) closes.
  stage.addEventListener("click", (e) => { if (e.target === stage) lb.close(); });
  img.addEventListener("dblclick", (e) => { e.preventDefault(); setScale(s.scale > 1 ? 1 : 2.5); });
  img.addEventListener("wheel", (e) => { e.preventDefault(); setScale(s.scale + (e.deltaY < 0 ? 0.25 : -0.25)); }, { passive: false });
  img.addEventListener("pointerdown", (e) => {
    if (s.scale <= 1) return;
    s.dragging = true; s.px = e.clientX - s.x; s.py = e.clientY - s.y;
    img.setPointerCapture(e.pointerId); apply();
  });
  img.addEventListener("pointermove", (e) => {
    if (!s.dragging) return;
    s.x = e.clientX - s.px; s.y = e.clientY - s.py; apply();
  });
  const endDrag = () => { if (s.dragging) { s.dragging = false; apply(); } };
  img.addEventListener("pointerup", endDrag);
  img.addEventListener("pointercancel", endDrag);
  lb.addEventListener("close", () => { setScale(1); });
  return lb;
}
function openLightbox(src, alt) {
  const lb = ensureLightbox();
  lb._img.src = src;
  lb._img.alt = alt || "";
  lb._setScale(1);
  lb.showModal();
}
document.addEventListener("click", (event) => {
  const zoomable = event.target.closest("img.zoomable");
  if (zoomable && zoomable.getAttribute("src")) {
    event.preventDefault();
    openLightbox(zoomable.currentSrc || zoomable.src, zoomable.alt);
  }
});

renderShell();
renderPage();
renderFooter();
bindSearch();

if (page === "art") {
  addEventListener("hashchange", () => {
    renderPage();
    scrollTo({ top: 0, behavior: "smooth" });
  });
}
