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
  return `<article class="project-card interactive-card" data-index="${index}" data-category="${project.category}" style="--accent:${project.color}">
    <div class="project-art"><span></span><i></i></div>
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

function artCard(item, pieceIndex, albumIndex) {
  return `<button class="art-card interactive-card" data-album="${albumIndex}" data-piece="${pieceIndex}" style="--a:${item.palette[0]};--b:${item.palette[1]};--c:${item.palette[2]}">
    <div class="canvas-art"><i></i><b></b><span></span></div>
    <strong>${safe(item.title)}</strong>
    <p>${safe(item.medium)} / ${safe(item.year)}</p>
  </button>`;
}

function albumCard(album, index) {
  const cover = album.pieces[0]?.palette || ["#4de2d0", "#17204a", "#966dff"];
  const count = album.pieces.length;
  return `<a class="album-card interactive-card" href="#a=${index}" style="--a:${cover[0]};--b:${cover[1]};--c:${cover[2]}">
    <div class="canvas-art album-cover"><i></i><b></b><span></span><em>${count} piece${count === 1 ? "" : "s"}</em></div>
    <strong>${safe(album.name)}</strong>
    <p>${album.description ? safe(album.description) : "&nbsp;"}</p>
  </a>`;
}

function renderHome() {
  const focusNodes = data.focusNodes
    .map((node) => `<a class="signal-node" href="${node.href}" style="--angle:${node.angle}deg"><span>${safe(node.label)}</span></a>`)
    .join("");
  const focusPhoto = data.focusPhoto?.src
    ? `<img src="${data.focusPhoto.src}" alt="${safe(data.focusPhoto.alt || data.person.name)}">`
    : `<span>${data.person.initials}</span>`;

  const heroAction = `<div class="hero-actions">
      ${data.person.available ? `<span class="status-pill"><i></i>${safe(data.person.available)}</span>` : ""}
      ${button("Explore work", "work.html")}
    </div>`;

  root.innerHTML = `
    ${hero(data.person.role, data.person.headline, data.person.intro, heroAction)}
    <section class="stat-strip">${data.stats.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("")}</section>
    <section class="home-stage">
      <div class="focus-card">
        <p class="kicker">Now</p>
        <h2>${data.person.now}</h2>
        <div class="signal-map">
          <span class="signal-ring" aria-hidden="true"></span>
          <div class="signal-orbit">${focusNodes}</div>
          <div class="signal-photo">${focusPhoto}</div>
        </div>
      </div>
      <div class="jump-card">
        <p class="kicker">Sections</p>
        ${data.pages.slice(1).map(([, label, href]) => `<a href="${href}">${label}<span>→</span></a>`).join("")}
      </div>
    </section>
    ${data.disciplines ? `<section class="section-block disciplines-block">
      <div class="section-head"><div><p class="kicker">What I do</p><h2>Three things, one person</h2></div><a href="about.html">More about me</a></div>
      <div class="disciplines-grid">${data.disciplines
        .map((d) => `<article class="discipline-card" style="--accent:${d.color}"><span class="discipline-dot"></span><strong>${safe(d.key)}</strong><p>${safe(d.text)}</p></article>`)
        .join("")}</div>
    </section>` : ""}
    <section class="section-block">
      <div class="section-head"><div><p class="kicker">Featured work</p><h2>Three active threads</h2></div><a href="work.html">All work</a></div>
      <div class="project-grid">${data.projects.filter((p) => p.featured).map(projectCard).join("")}</div>
    </section>`;
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

  root.innerHTML = `${hero("Art & visuals", "Albums of studies and experiments.", "Browse by album — visual studies, posters, and creative-coding sketches. Click an album to open it.")}
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

function openProject(index) {
  const p = data.projects[index];
  $("#featureDialog").innerHTML = `<form method="dialog"><button aria-label="Close">×</button></form><article class="modal-card" style="--accent:${p.color}"><p class="kicker">${p.type} / ${p.year}</p><h2>${p.title}</h2><p>${p.summary}</p>${p.why ? `<p class="modal-why"><span>Why I built it</span>${safe(p.why)}</p>` : ""}<dl><div><dt>Role</dt><dd>${p.role}</dd></div><div><dt>Result</dt><dd>${p.result}</dd></div></dl><div>${tags(p.tags)}</div><a class="button" href="${p.href}">Open project<span>→</span></a></article>`;
  $("#featureDialog").showModal();
}

function openArt(albumIndex, pieceIndex) {
  const a = getAlbums()[albumIndex]?.pieces[pieceIndex];
  if (!a) return;
  $("#featureDialog").innerHTML = `<form method="dialog"><button aria-label="Close">×</button></form><article class="modal-card" style="--a:${a.palette[0]};--b:${a.palette[1]};--c:${a.palette[2]}"><div class="canvas-art large"><i></i><b></b><span></span></div><p class="kicker">${safe(a.medium)} / ${safe(a.year)}</p><h2>${safe(a.title)}</h2><p>${safe(a.text)}</p><div>${tags(a.tags)}</div></article>`;
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
