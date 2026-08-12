const data = window.portfolio;
const page = document.body.dataset.page || "home";
const root = document.querySelector("#pageRoot");
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function safe(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function tags(items) {
  return items.map((item) => `<span class="tag">${safe(item)}</span>`).join("");
}

function renderShell() {
  const nav = data.pages.map(([id, label, href]) => `<a class="${id === page ? "active" : ""}" href="${href}">${label}</a>`).join("");
  document.querySelector("[data-shell]").innerHTML = `
    <a class="brand" href="index.html"><span>${data.person.initials}</span><b>${data.person.name}</b></a>
    <nav class="nav" aria-label="Portfolio navigation">${nav}</nav>
    <button id="openSearch" class="search-btn" type="button" aria-label="Search portfolio">Search</button>`;
}

function hero(kicker, title, body = "", action = "") {
  return `<header class="hero"><div><p class="kicker">${kicker}</p><h1>${title}</h1>${body ? `<p>${body}</p>` : ""}</div>${action}</header>`;
}

function button(label, href) {
  return `<a class="button" href="${href}">${label}<span>→</span></a>`;
}

function projectCard(project, index) {
  const art = project.image
    ? `<div class="project-art has-media"><img src="${project.image}" alt="${safe(project.title)}" loading="lazy"></div>`
    : `<div class="project-art"><span></span><i></i></div>`;
  return `<article class="project-card interactive-card" data-index="${index}" data-category="${project.category}" style="--accent:${project.color}">
    ${art}
    <div class="project-copy">
      <small>${project.type} / ${project.year}</small>
      <h2>${project.title}</h2>
      <p>${project.summary}</p>
      <div>${tags(project.tags)}</div>
      <footer><button type="button" data-open-project="${index}">Details</button><a href="${project.href}">Open</a></footer>
    </div>
  </article>`;
}

function researchCard(item) {
  return `<article class="research-card interactive-card" style="--accent:${item.color}">
    <small>${item.area} / ${item.year}</small>
    <h2>${item.title}</h2>
    <p>${item.question}</p>
    <div>${tags(item.notes)}</div>
    <footer>${item.status}</footer>
  </article>`;
}

function getAlbums() {
  if (Array.isArray(data.artAlbums) && data.artAlbums.length) return data.artAlbums;
  if (Array.isArray(data.art) && data.art.length) return [{ name: "Art", description: "", pieces: data.art }];
  return [];
}

function canvasArt(item, extraClass = "") {
  return item.image
    ? `<div class="canvas-art has-media ${extraClass}"><img src="${item.image}" alt="${safe(item.title || "")}" loading="lazy"></div>`
    : `<div class="canvas-art ${extraClass}"><i></i><b></b><span></span></div>`;
}

function artCard(item, pieceIndex, albumIndex) {
  return `<button class="art-card interactive-card" data-album="${albumIndex}" data-piece="${pieceIndex}" style="--a:${item.palette[0]};--b:${item.palette[1]};--c:${item.palette[2]}">
    ${canvasArt(item)}
    <strong>${safe(item.title)}</strong>
    <p>${safe(item.medium)} / ${safe(item.year)}</p>
  </button>`;
}

function albumCard(album, index) {
  const first = album.pieces[0] || {};
  const cover = first.palette || ["#4de2d0", "#17204a", "#966dff"];
  const count = album.pieces.length;
  const coverArt = first.image
    ? `<div class="canvas-art album-cover has-media"><img src="${first.image}" alt="${safe(album.name)}" loading="lazy"><em>${count} piece${count === 1 ? "" : "s"}</em></div>`
    : `<div class="canvas-art album-cover"><i></i><b></b><span></span><em>${count} piece${count === 1 ? "" : "s"}</em></div>`;
  return `<a class="album-card interactive-card" href="#a=${index}" style="--a:${cover[0]};--b:${cover[1]};--c:${cover[2]}">
    ${coverArt}
    <strong>${safe(album.name)}</strong>
    <p>${album.description ? safe(album.description) : "&nbsp;"}</p>
  </a>`;
}

const SOCIAL_ICONS = {
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.85 9.73.5.1.68-.22.68-.49l-.01-1.9c-2.79.62-3.38-1.22-3.38-1.22-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.34 9.34 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.1c0-1.22-.02-2.8-1.9-2.8-1.9 0-2.2 1.35-2.2 2.7V21H9z"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
};

function socialIcon(label) {
  const key = String(label).toLowerCase();
  if (key.includes("mail")) return SOCIAL_ICONS.email;
  if (key.includes("github")) return SOCIAL_ICONS.github;
  if (key.includes("linkedin")) return SOCIAL_ICONS.linkedin;
  return SOCIAL_ICONS.link;
}

// Animated binary "matrix rain" background for the Code card.
function matrixRain() {
  const cols = 16, colW = 200 / cols, rows = 15, rowH = 132 / rows, cyan = "#4de2d0";
  let groups = "";
  for (let c = 0; c < cols; c++) {
    const x = ((c + 0.5) * colW).toFixed(1);
    const head = Math.floor(Math.random() * rows);
    const trail = 5 + Math.floor(Math.random() * 5);
    const tile = [];
    for (let r = 0; r < rows; r++) {
      const d = head - r;
      let fill = cyan, op;
      if (d === 0) { fill = "#e9fffb"; op = 0.95; }
      else if (d > 0 && d <= trail) { op = 0.5 * (1 - d / trail) + 0.14; }
      else { op = 0.08 + (r % 3) * 0.02; }
      tile.push({ bit: Math.random() < 0.5 ? "0" : "1", fill, op: op.toFixed(2) });
    }
    let digits = "";
    for (let copy = 0; copy < 2; copy++) {
      const yOff = copy * 132;
      tile.forEach((t, r) => {
        digits += `<text x="${x}" y="${(yOff + r * rowH + rowH).toFixed(1)}" fill="${t.fill}" fill-opacity="${t.op}">${t.bit}</text>`;
      });
    }
    const dur = (3 + Math.random() * 4).toFixed(1);
    const delay = (-Math.random() * 6).toFixed(1);
    groups += `<g class="mcol" style="animation-duration:${dur}s;animation-delay:${delay}s">${digits}</g>`;
  }
  return `<svg class="role-svg matrix" viewBox="0 0 200 132" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="mbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1a34"/><stop offset="1" stop-color="#081428"/></linearGradient></defs><rect width="200" height="132" fill="url(#mbg)"/><g font-family="'DM Mono', ui-monospace, monospace" font-size="8" text-anchor="middle">${groups}</g></svg>`;
}

// Small stylized "preview" mockups for the homepage role cards.
const ROLE_THUMBS = {
  design: `<svg class="role-svg" viewBox="0 0 200 132" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="200" height="132" fill="#0b1026"/>
    <rect width="200" height="18" fill="rgba(255,255,255,.05)"/>
    <circle cx="12" cy="9" r="3" fill="var(--accent)"/>
    <rect x="22" y="6" width="9" height="6" rx="1.5" fill="rgba(255,255,255,.3)"/>
    <rect x="35" y="6" width="9" height="6" rx="1.5" fill="rgba(255,255,255,.18)"/>
    <rect x="0" y="18" width="42" height="114" fill="rgba(255,255,255,.03)"/>
    <rect x="8" y="30" width="26" height="6" rx="2" fill="var(--accent)" opacity=".85"/>
    <rect x="8" y="42" width="26" height="6" rx="2" fill="rgba(255,255,255,.18)"/>
    <rect x="8" y="54" width="20" height="6" rx="2" fill="rgba(255,255,255,.14)"/>
    <rect x="8" y="66" width="24" height="6" rx="2" fill="rgba(255,255,255,.14)"/>
    <rect x="54" y="30" width="132" height="92" rx="6" fill="rgba(255,255,255,.02)" stroke="rgba(255,255,255,.08)"/>
    <line class="d-guide" x1="100" y1="34" x2="100" y2="118" stroke="#4de2d0" stroke-width="1" stroke-dasharray="3 3"/>
    <rect x="130" y="76" width="40" height="30" rx="6" fill="#966dff" opacity=".62"/>
    <g class="d-select">
      <rect x="74" y="50" width="52" height="34" rx="6" fill="var(--accent)"/>
      <g fill="#fff" stroke="#0b1026" stroke-width=".8">
        <rect x="71.5" y="47.5" width="5" height="5" rx="1"/>
        <rect x="123.5" y="47.5" width="5" height="5" rx="1"/>
        <rect x="71.5" y="81.5" width="5" height="5" rx="1"/>
        <rect x="123.5" y="81.5" width="5" height="5" rx="1"/>
      </g>
    </g>
    <path class="d-cursor" d="M0 0 L0 13 L3.4 9.7 L5.6 14 L7.7 13 L5.5 8.8 L10 8.8 Z" fill="#fff" stroke="#0b1026" stroke-width=".8" transform="translate(118 88)"/>
  </svg>`,
  art: `<svg class="role-svg" viewBox="0 0 200 132" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <radialGradient id="ablob" cx="38%" cy="34%" r="72%"><stop offset="0" stop-color="#a97bff"/><stop offset="1" stop-color="#5a3fb8"/></radialGradient>
      <radialGradient id="ablob2" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#ff8fd6"/><stop offset="1" stop-color="#ff5db4"/></radialGradient>
    </defs>
    <rect width="200" height="132" fill="#0b1026"/>
    <circle class="a-blob1" cx="78" cy="60" r="48" fill="url(#ablob)" opacity=".92"/>
    <circle class="a-blob2" cx="128" cy="84" r="36" fill="url(#ablob2)" opacity=".62"/>
    <path d="M18 106 q 34 -22 70 -8 t 80 -12" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="3.2" stroke-linecap="round"/>
    <rect class="a-square" x="98" y="24" width="42" height="42" rx="9" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2"/>
    <circle cx="30" cy="28" r="5" fill="#4de2d0"/><circle cx="46" cy="24" r="5" fill="#ffd166"/><circle cx="62" cy="26" r="4" fill="var(--accent)"/>
  </svg>`,
};

function roleThumb(key) {
  const k = String(key).toLowerCase();
  if (k.includes("code")) return matrixRain();
  if (k.includes("design")) return ROLE_THUMBS.design;
  return ROLE_THUMBS.art;
}

function renderHome() {
  const portrait = data.focusPhoto?.src
    ? `<img src="${data.focusPhoto.src}" alt="${safe(data.focusPhoto.alt || data.person.name)}">`
    : `<span class="portrait-initials">${safe(data.person.initials)}</span>`;

  const roleCards = (data.disciplines || [])
    .slice(0, 3)
    .map((d) => `<div class="role-card" style="--accent:${d.color}">
        <div class="role-thumb">${roleThumb(d.key)}</div>
        <span class="role-pill">${safe(d.key)}</span>
      </div>`)
    .join("");

  const socialLinks = data.links.filter((l) => /email|github|linkedin/i.test(l.label));
  const socials = socialLinks
    .map((l) => {
      const external = /^https?:/i.test(l.href);
      return `<a class="social" href="${l.href}" aria-label="${safe(l.label)}"${external ? ' target="_blank" rel="noopener"' : ""}>${socialIcon(l.label)}</a>`;
    })
    .join("");

  const disciplines = (data.disciplines || [])
    .map((d) => `<article class="discipline-card" style="--accent:${d.color}"><span class="discipline-dot"></span><strong>${safe(d.key)}</strong><p>${safe(d.text)}</p></article>`)
    .join("");

  root.innerHTML = `
    <header class="intro-hero">
      <div class="intro-copy">
        <p class="hello">Hello, I'm</p>
        <h1 class="intro-name">${safe(data.person.name)}</h1>
        <p class="intro-bio">${safe(data.person.intro)}</p>
        ${data.person.available ? `<span class="status-pill"><i></i>${safe(data.person.available)}</span>` : ""}
        <div class="intro-actions">
          <a class="email-pill" href="mailto:${data.person.email}">${safe(data.person.email)}</a>
          <div class="socials">${socials}</div>
        </div>
      </div>
      <div class="intro-portrait">
        <span class="portrait-glow" aria-hidden="true"></span>
        <div class="portrait-frame">${portrait}</div>
      </div>
      <div class="intro-roles">${roleCards}</div>
    </header>
    ${disciplines ? `<section class="section-block disciplines-block">
      <div class="section-head"><div><p class="kicker">What I do</p><h2>Three things, one person</h2></div><a href="about.html">More about me</a></div>
      <div class="disciplines-grid">${disciplines}</div>
    </section>` : ""}
    <section class="section-block">
      <div class="section-head"><div><p class="kicker">Featured work</p><h2>Selected projects</h2></div><a href="work.html">All work</a></div>
      <div class="project-grid">${data.projects.filter((p) => p.featured).map(projectCard).join("")}</div>
    </section>`;

  // If the portrait photo is missing or fails to load, fall back to the initials
  // so visitors never see a broken image.
  const portraitImg = root.querySelector(".portrait-frame img");
  if (portraitImg) {
    portraitImg.addEventListener("error", () => {
      portraitImg.parentElement.innerHTML = `<span class="portrait-initials">${safe(data.person.initials)}</span>`;
    });
  }
}

function renderWork() {
  const cats = ["All", ...new Set(data.projects.map((p) => p.category))];
  root.innerHTML = `${hero("Work", "Things I've built.", "A mix of shipped products, prototypes, and experiments. Open any card to see why I made it.")}
    <div class="filters">${cats.map((cat, index) => `<button class="filter ${index === 0 ? "active" : ""}" data-filter="${cat}">${cat}</button>`).join("")}</div>
    <div class="project-grid wide">${data.projects.map(projectCard).join("")}</div>`;
}

function renderResearch() {
  root.innerHTML = `${hero("Research", "Questions, notes, directions.", "")}
    <section class="research-grid">${data.research.map(researchCard).join("")}</section>`;
}

function renderArt() {
  const albums = getAlbums();
  const match = location.hash.match(/a=(\d+)/);
  const activeIndex = match ? Number(match[1]) : -1;
  const active = albums[activeIndex];

  if (active) {
    root.innerHTML = `<a class="back-link" href="#">← All albums</a>
      ${hero("Album", safe(active.name), active.description ? safe(active.description) : "")}
      <div class="art-grid">${active.pieces.map((piece, i) => artCard(piece, i, activeIndex)).join("")}</div>`;
    return;
  }

  root.innerHTML = `${hero("Art & visuals", "Albums of studies and experiments.", "Browse by album, visual studies, posters, and creative-coding sketches. Click an album to open it.")}
    <div class="album-grid">${albums.map(albumCard).join("")}</div>
    <section class="section-block mixer"><div class="section-head"><div><p class="kicker">Interactive study</p><h2>Color field mixer</h2></div><span>Drag</span></div><input id="colorRange" type="range" min="0" max="100" value="46"><div id="colorField"></div></section>`;
}

function renderWriting() {
  root.innerHTML = `${hero("Writing", "Notes on building, learning, AI, and design.", "")}
    <section class="writing-layout">
      <div class="post-grid">${data.posts.map((post) => `<article class="post-card"><small>${post.category} / ${post.read}</small><h2>${post.title}</h2><time>${new Date(post.date).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}</time></article>`).join("")}</div>
      <aside class="idea-card writing-note"><p class="kicker">Themes</p><div>${tags(["AI", "Education", "Design", "Building"])}</div></aside>
    </section>`;
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

  root.innerHTML = `${hero("About", data.person.name, data.person.role)}
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
  root.innerHTML = `${hero("Contact", "Send the signal.", "")}
    <section class="contact-grid">
      <article class="link-panel"><p class="kicker">Links</p>${data.links.map((link) => `<a href="${link.href}"><span>${link.note}</span><strong>${link.label}</strong></a>`).join("")}</article>
      <form class="contact-form" id="contactForm"><label><span>Your email</span><input type="email" placeholder="name@example.com"></label><label><span>Message</span><textarea rows="7" placeholder="What should I know?"></textarea></label><button class="button" type="submit">Prepare email<span>→</span></button></form>
    </section>`;
}

function renderPage() {
  ({ home: renderHome, work: renderWork, research: renderResearch, art: renderArt, writing: renderWriting, about: renderAbout, contact: renderContact }[page] || renderHome)();
  bindPage();
  animateIn();
}

// Reveal elements as they scroll into view (staggered by position in their row/grid).
// Note: elements centered via CSS transform (.intro-copy, .intro-portrait) are
// excluded, a transform-based reveal would fight their positioning.
const REVEAL_SELECTOR = ".hero, .role-card, .section-block, .project-card, .research-card, .art-card, .album-card, .discipline-card, .post-card, .story-card, .side-panel, .skill-group, .approach-item, .back-link";
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

function renderFooter() {
  const shell = document.querySelector(".shell");
  if (!shell || shell.querySelector(".sitefoot")) return;
  const year = new Date().getFullYear();
  const nav = data.pages
    .filter(([id]) => id !== page)
    .map(([, label, href]) => `<a href="${href}">${label}</a>`)
    .join("");
  const footer = document.createElement("footer");
  footer.className = "sitefoot";
  footer.innerHTML = `
    <div class="sitefoot-brand">
      <strong>${safe(data.person.name)}</strong>
      <span>${safe(data.person.role)}</span>
    </div>
    <nav class="sitefoot-nav" aria-label="Footer navigation">${nav}</nav>
    <div class="sitefoot-meta">
      <a href="mailto:${data.person.email}">${data.person.email}</a>
      <small>© ${year} · Designed &amp; built by ${safe(data.person.name)}</small>
    </div>`;
  shell.appendChild(footer);
}

function bindPage() {
  $$(".interactive-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const box = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${((event.clientX - box.left) / box.width) * 100}%`);
      card.style.setProperty("--my", `${((event.clientY - box.top) / box.height) * 100}%`);
    });
  });
  $$(".filter").forEach((filter) => {
    filter.addEventListener("click", () => {
      $$(".filter").forEach((item) => item.classList.remove("active"));
      filter.classList.add("active");
      $$(".project-card").forEach((card) => {
        card.hidden = filter.dataset.filter !== "All" && card.dataset.filter !== card.dataset.category;
      });
    });
  });
  $$("[data-open-project]").forEach((buttonEl) => buttonEl.addEventListener("click", () => openProject(Number(buttonEl.dataset.openProject))));
  $$("[data-piece]").forEach((buttonEl) => buttonEl.addEventListener("click", () => openArt(Number(buttonEl.dataset.album), Number(buttonEl.dataset.piece))));
  $("#colorRange")?.addEventListener("input", (event) => $("#colorField").style.setProperty("--mix", `${event.target.value}%`));
  $("#contactForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const [email, message] = Array.from(event.currentTarget.elements);
    location.href = `mailto:${data.person.email}?subject=Portfolio inquiry&body=${encodeURIComponent(`From: ${email.value}\n\n${message.value}`)}`;
  });
}

function mediaBlock(item, title) {
  if (item.embed) return `<div class="modal-embed"><iframe src="${item.embed}" title="${safe(title)}" loading="lazy" allowfullscreen></iframe></div>`;
  if (item.image) return `<div class="modal-media"><img src="${item.image}" alt="${safe(title)}"></div>`;
  return "";
}

function openProject(index) {
  const p = data.projects[index];
  $("#featureDialog").innerHTML = `<form method="dialog"><button aria-label="Close">×</button></form><article class="modal-card" style="--accent:${p.color}">${mediaBlock(p, p.title)}<p class="kicker">${p.type} / ${p.year}</p><h2>${p.title}</h2><p>${p.summary}</p>${p.why ? `<p class="modal-why"><span>Why I built it</span>${safe(p.why)}</p>` : ""}<dl><div><dt>Role</dt><dd>${p.role}</dd></div><div><dt>Result</dt><dd>${p.result}</dd></div></dl><div>${tags(p.tags)}</div><a class="button" href="${p.href}">Open project<span>→</span></a></article>`;
  $("#featureDialog").showModal();
}

function openArt(albumIndex, pieceIndex) {
  const a = getAlbums()[albumIndex]?.pieces[pieceIndex];
  if (!a) return;
  const visual = a.image ? mediaBlock(a, a.title) : `<div class="canvas-art large"><i></i><b></b><span></span></div>`;
  $("#featureDialog").innerHTML = `<form method="dialog"><button aria-label="Close">×</button></form><article class="modal-card" style="--a:${a.palette[0]};--b:${a.palette[1]};--c:${a.palette[2]}">${visual}<p class="kicker">${safe(a.medium)} / ${safe(a.year)}</p><h2>${safe(a.title)}</h2><p>${safe(a.text)}</p><div>${tags(a.tags)}</div></article>`;
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
    ...getAlbums().flatMap((al) => al.pieces).map((a) => ({ title: a.title, meta: a.medium, text: a.text, href: "art.html" })),
    ...data.posts.map((p) => ({ title: p.title, meta: p.category, text: p.excerpt, href: "writing.html" })),
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

function startMotion() {
  const canvas = $("#motionCanvas");
  const ctx = canvas.getContext("2d");
  const points = Array.from({ length: 46 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 2 + 0.6, vx: (Math.random() - 0.5) * 0.00045, vy: (Math.random() - 0.5) * 0.00045 }));
  function resize() {
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
  }
  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.forEach((p, index) => {
      p.x = (p.x + p.vx + 1) % 1;
      p.y = (p.y + p.vy + 1) % 1;
      const x = p.x * canvas.width;
      const y = p.y * canvas.height;
      ctx.globalAlpha = 0.48;
      ctx.fillStyle = index % 3 === 0 ? "#4de2d0" : index % 3 === 1 ? "#64a8ff" : "#966dff";
      ctx.beginPath();
      ctx.arc(x, y, p.r * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
      points.slice(index + 1).forEach((q) => {
        const dx = x - q.x * canvas.width;
        const dy = y - q.y * canvas.height;
        const distance = Math.hypot(dx, dy);
        if (distance < 126 * devicePixelRatio) {
          ctx.globalAlpha = 0.09 * (1 - distance / (126 * devicePixelRatio));
          ctx.strokeStyle = "#64a8ff";
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(q.x * canvas.width, q.y * canvas.height);
          ctx.stroke();
        }
      });
    });
    requestAnimationFrame(frame);
  }
  resize();
  addEventListener("resize", resize);
  frame();
}

renderShell();
renderPage();
renderFooter();
bindSearch();
startMotion();

if (page === "art") {
  addEventListener("hashchange", () => {
    renderPage();
    scrollTo({ top: 0, behavior: "smooth" });
  });
}
