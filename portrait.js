/* Graphic VFX overlays. The original portrait is always stationary. */
(() => {
  const NS = "http://www.w3.org/2000/svg";
  const make = (tag, attrs = {}) => {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  };

  window.initPortraitVFX = async portrait => {
    const image = portrait?.querySelector(":scope > img");
    if (!image) return;
    try {
      const response = await fetch("assets/portrait/shape-vfx.json?v=20261117-vfx4");
      if (!response.ok) return;
      const shapes = await response.json();
      if (image.getAttribute("src").split("?")[0] !== shapes.source) return;
      await image.decode();
      if (!image.isConnected) return;
      const svg = make("svg", { class: "portrait-vfx", viewBox: `0 0 ${shapes.width} ${shapes.height}`, "aria-hidden": "true", focusable: "false" });
      const defs = make("defs");
      svg.append(defs);
      shapes.pieces.forEach((piece, index) => {
        const id = `portrait-fx-clip-${piece.id}`;
        const clip = make("clipPath", { id, clipPathUnits: "userSpaceOnUse" });
        clip.append(make("path", { d: piece.path, "clip-rule": "evenodd" }));
        defs.append(clip);
        const color = piece.family === "cyan" || index % 2 === 0 ? "cyan" : "violet";
        const layer = make("g", { class: "portrait-fx-piece", "data-fx-shape": piece.id, style: `--fx-period:${7.2 + index % 4 * .7}s;--fx-delay:${-(index % 11) * .73}s` });
        const ink = color === "cyan" ? "#51e4db" : "#c169f0";
        layer.append(make("path", { d: piece.path, fill: "none", stroke: ink, "stroke-width": 1.5, "stroke-linejoin": "miter", transform: `translate(${color === "cyan" ? 2 : -2} 0)` }));
        const cut = make("g", { "clip-path": `url(#${id})`, fill: color === "cyan" ? "#51e4db" : "#c169f0" });
        cut.append(make("rect", { x: 0, y: piece.center[1], width: shapes.width, height: 2 }));
        layer.append(cut);
        svg.append(layer);
      });
      portrait.append(svg);
      const reduced = matchMedia("(prefers-reduced-motion: reduce)");
      let inView = true;
      const sync = () => svg.classList.toggle("vfx-paused", !inView || document.hidden || reduced.matches);
      document.addEventListener("visibilitychange", sync);
      reduced.addEventListener("change", sync);
      const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
      observer.observe(portrait);
      sync();
    } catch (error) {
      console.warn("Portrait effects could not be loaded.", error);
    }
  };
})();
