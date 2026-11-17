/* Detailed, self-hosted creative workspaces. Three.js r180 is vendored with its MIT license. */
(() => {
  "use strict";
  const scriptURL = document.currentScript.src;
  const moduleURL = new URL("vendor/three.module.min.js", scriptURL).href;

  window.initSculpture = async function initSculpture(container) {
    if (!container || container.dataset.sculptureInitialized) return;
    container.dataset.sculptureInitialized = "true";
    const canvas = container.querySelector("[data-sculpture-canvas]");
    const modelButtons = [...container.querySelectorAll("[data-sculpture-model]")];
    const motionButton = container.querySelector("[data-sculpture-motion]");
    const status = container.querySelector("[data-sculpture-status]");
    if (!canvas) return;

    let renderer;
    const fallback = () => {
      container.classList.remove("is-ready");
      container.classList.add("is-static");
      modelButtons.forEach(button => { button.disabled = true; });
      if (motionButton) motionButton.disabled = true;
      canvas.removeAttribute("tabindex");
      if (status) status.textContent = "Creative workspace · static view";
    };

    try {
      const THREE = await import(moduleURL);
      if (!container.isConnected) return;
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-4, 4, 3, -3, 0.1, 50);
      camera.position.set(5, 4.2, 7);
      camera.lookAt(0, 0.7, 0);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x9b9b91, 3));
      const keyLight = new THREE.DirectionalLight(0xffffff, 4);
      keyLight.position.set(-3, 7, 5);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.left = keyLight.shadow.camera.bottom = -5;
      keyLight.shadow.camera.right = keyLight.shadow.camera.top = 5;
      keyLight.shadow.normalBias = 0.04;
      keyLight.shadow.bias = -0.0003;
      keyLight.shadow.radius = 4;
      scene.add(keyLight);
      const fill = new THREE.DirectionalLight(0xe1deff, 2.2);
      fill.position.set(4, 3, -3);
      scene.add(fill);

      const geometries = [];
      const materials = [];
      const textures = [];
      const geometry = item => { geometries.push(item); return item; };
      const material = (color, options = {}) => {
        const m = new THREE.MeshStandardMaterial({ color, roughness: 0.42, metalness: 0.15, ...options });
        materials.push(m);
        return m;
      };
      const navy = material(0x493852);
      const blue = material(0x78c9c8);
      const teal = material(0x78c9c8);
      const purple = material(0xb9adc3);
      const white = material(0xf4f3ed);
      const silver = material(0xc7c8c0, { metalness: 0.65, roughness: 0.3 });
      const dark = material(0x171915);
      const paper = material(0xfffefa, { metalness: 0, roughness: 0.85 });
      const pink = material(0xbc7d74);
      const ink = material(0x171915);
      const boxCache = new Map();
      const box = (parent, w, h, d, m, x = 0, y = 0, z = 0, bevel = 0) => {
        const key = [w, h, d, bevel].join(',');
        let g = boxCache.get(key);
        if (!g) {
          if (bevel) {
            const r = Math.min(bevel, w / 3, h / 3, d / 3);
            const shape = new THREE.Shape();
            const a = -w / 2 + r, b = -h / 2 + r, c = w / 2 - r, e = h / 2 - r;
            shape.moveTo(a, b - r); shape.lineTo(c, b - r); shape.quadraticCurveTo(c + r, b - r, c + r, b);
            shape.lineTo(c + r, e); shape.quadraticCurveTo(c + r, e + r, c, e + r);
            shape.lineTo(a, e + r); shape.quadraticCurveTo(a - r, e + r, a - r, e);
            shape.lineTo(a - r, b); shape.quadraticCurveTo(a - r, b - r, a, b - r);
            g = geometry(new THREE.ExtrudeGeometry(shape, { depth: d - 2 * r, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: r * 0.4, bevelThickness: r, curveSegments: 4 }));
            g.translate(0, 0, -d / 2 + r);
          } else g = geometry(new THREE.BoxGeometry(w, h, d));
          boxCache.set(key, g);
        }
        const mesh = new THREE.Mesh(g, m); mesh.position.set(x, y, z);
        mesh.castShadow = mesh.receiveShadow = true; parent.add(mesh); return mesh;
      };
      const cylinder = (parent, top, bottom, height, m, x = 0, y = 0, z = 0, segments = 24) => {
        const mesh = new THREE.Mesh(geometry(new THREE.CylinderGeometry(top, bottom, height, segments)), m);
        mesh.position.set(x, y, z); mesh.castShadow = mesh.receiveShadow = true; parent.add(mesh); return mesh;
      };
      const beam = (parent, start, end, radius, m) => {
        const a = new THREE.Vector3(...start), b = new THREE.Vector3(...end);
        const mesh = cylinder(parent, radius, radius, a.distanceTo(b), m);
        mesh.position.copy(a).add(b).multiplyScalar(0.5);
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.sub(a).normalize());
        return mesh;
      };
      const sphereGeometry = geometry(new THREE.SphereGeometry(1, 16, 12));
      const sphere = (parent, radius, m, x, y, z) => {
        const mesh = new THREE.Mesh(sphereGeometry, m); mesh.scale.setScalar(radius);
        mesh.position.set(x, y, z); mesh.castShadow = true; parent.add(mesh); return mesh;
      };
      const canvasMaterial = (paint, width = 1024, height = 640) => {
        const c = document.createElement('canvas'); c.width = width; c.height = height;
        paint(c.getContext('2d'), width, height);
        const texture = new THREE.CanvasTexture(c); texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy()); textures.push(texture);
        const m = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }); materials.push(m); return m;
      };
      const imageMaterial = async file => {
        const texture = await new THREE.TextureLoader().loadAsync(new URL(file, scriptURL).href);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy()); textures.push(texture);
        const m = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }); materials.push(m); return m;
      };
      const plane = (parent, width, height, m, x, y, z) => {
        const mesh = new THREE.Mesh(geometry(new THREE.PlaneGeometry(width, height)), m);
        mesh.position.set(x, y, z); parent.add(mesh); return mesh;
      };
      const codeScreen = canvasMaterial((ctx, w, h) => {
        ctx.fillStyle = '#171915'; ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#2e302b'; ctx.fillRect(0, 0, w, 68);
        ['#d9d5ff', '#9e97ff', '#c4c0ff'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(32 + i * 27, 33, 8, 0, 7); ctx.fill(); });
        ctx.font = '20px monospace'; ctx.fillStyle = '#f4f3ed'; ctx.fillText('studio / build.js', 160, 42);
        ctx.fillStyle = '#23251f'; ctx.fillRect(0, 68, 190, h);
        ctx.font = '19px monospace';
        ['EXPLORER', '  src/', '  projects/', '  ideas/', '  artwork/', '', '● main'].forEach((line, i) => { ctx.fillStyle = i === 0 ? '#b4afff' : '#b6b8ae'; ctx.fillText(line, 17, 112 + i * 42); });
        const lines = [ ['#9e97ff', 'const studio = {'], ['#c4c0ff', '  code: "make it work",'], ['#b4afff', '  design: "make it clear",'], ['#d9d5ff', '  art: "make it yours"'], ['#f4f3ed', '};'], ['#f4f3ed', ''], ['#9e97ff', 'function create(idea) {'], ['#c4c0ff', '  return curiosity'], ['#b4afff', '    .explore(idea)'], ['#d9d5ff', '    .build();'], ['#f4f3ed', '}'] ];
        ctx.font = '24px monospace';
        lines.forEach(([color, text], i) => { ctx.fillStyle = '#75776e'; ctx.fillText(String(i + 1).padStart(2, '0'), 211, 116 + i * 38); ctx.fillStyle = color; ctx.fillText(text, 265, 116 + i * 38); });
        ctx.fillStyle = '#c4c0ff'; ctx.fillRect(0, h - 38, w, 38); ctx.fillStyle = '#171915'; ctx.font = '18px monospace'; ctx.fillText('✓ ready to make something', 22, h - 12);
      });
      const blueprint = canvasMaterial((ctx, w, h) => {
        ctx.fillStyle = '#f4f3ed'; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#deded5'; ctx.lineWidth = 2;
        for (let x = 0; x < w; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
        for (let y = 0; y < h; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
        ctx.strokeStyle = '#9e97ff'; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(180, 450); ctx.bezierCurveTo(240, 70, 680, 55, 800, 420); ctx.stroke();
        ctx.strokeStyle = '#b4afff'; ctx.lineWidth = 3;
        [[180,450,240,70],[680,55,800,420]].forEach(a => {ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(a[2],a[3]);ctx.stroke();});
        [[180,450],[240,70],[680,55],[800,420]].forEach(([x,y]) => {ctx.fillStyle='#ffffff';ctx.fillRect(x-9,y-9,18,18);ctx.strokeRect(x-9,y-9,18,18);});
        ctx.fillStyle = '#171915'; ctx.font = 'bold 33px sans-serif'; ctx.fillText('SHAPE / 01', 45, h - 45);
      });
      // These are the owner's actual posters, also available in the portfolio gallery.
      const [comicPoster, wearPoster] = await Promise.all([
        imageMaterial('assets/works/graphic-novel.webp'), imageMaterial('assets/works/rc-wear.webp')
      ]);
      const sculpture = new THREE.Group(); sculpture.position.y = -0.3; scene.add(sculpture);
      const base = group => {
        box(group, 4.6, 0.22, 3.25, navy, 0, -0.13, 0, 0.07);
        box(group, 4.48, 0.08, 3.13, white, 0, 0.02, 0, 0.03);
        box(group, 4.55, 0.025, 0.035, teal, 0, -0.1, 1.62);
        for (const x of [-1.95, 1.95]) for (const z of [-1.2, 1.2]) cylinder(group, .1, .09, .12, dark, x, -.28, z);
      };
      const books = (group, x, z) => {
        [blue, purple, teal].forEach((m, i) => {
          const book = new THREE.Group(); book.position.set(x, 0.13 + i * 0.13, z); book.rotation.y = (i - 1) * .11;
          box(book, .74, .1, .55, paper); box(book, .8, .025, .58, m, 0, .06, 0); box(book, .8, .025, .58, m, 0, -.06, 0);
          group.add(book);
        });
      };
      const lamp = (group, x, z) => {
        cylinder(group, .24, .28, .08, navy, x, .12, z);
        beam(group, [x,.15,z], [x-.1,1.25,z], .045, silver);
        beam(group, [x-.1,1.25,z], [x+.55,1.8,z], .05, blue);
        sphere(group, .09, navy, x-.1, 1.25, z);
        const shade = cylinder(group, .13, .31, .33, teal, x+.55,1.68,z); shade.rotation.z = -.4;
        const glow = cylinder(group,.25,.25,.015,paper,x+.61,1.51,z); glow.rotation.z = -.4;
      };
      const code = new THREE.Group(); base(code);
      box(code, 2.56, 1.75, .18, navy, -.15, 1.72, -.6, .07);
      box(code, 2.38, 1.55, .03, dark, -.15, 1.72, -.49, .035);
      plane(code, 2.27, 1.42, codeScreen, -.15, 1.74, -.469);
      sphere(code, .022, teal, -.15, 2.52, -.47);
      box(code, .26, .6, .17, silver, -.15, .6, -.6, .03);
      box(code, .92, .09, .58, navy, -.15, .16, -.43, .035);
      const keyboard = new THREE.Group(); keyboard.position.set(-.2,.14,.69); keyboard.rotation.y = -.035; code.add(keyboard);
      box(keyboard, 2.06, .12, .72, silver, 0, 0, 0, .035);
      for (let row=0; row<4; row++) for(let col=0;col<12;col++) box(keyboard,.13,.07,.12,(col===0||col===11)?purple:paper,-.9+col*.163,.09,-.23+row*.15,.012);
      box(keyboard,.72,.07,.1,blue,0,.092,.29,.012);
      box(code, .35, .12, .49, white, 1.32, .18, .65, .055);
      box(code, .015, .04, .08, purple, 1.32, .25, .58);
      // Exposed circuitry: chip, traces, capacitor bank, and mounting screws.
      const pcb = new THREE.Group(); pcb.position.set(-1.68,.14,.1); pcb.rotation.y=-.16; code.add(pcb);
      box(pcb,.72,.045,1.15,navy); box(pcb,.34,.09,.33,dark,0,.07,0);
      for(let i=0;i<7;i++) {
        box(pcb,.024,.015,.85,teal,-.3+i*.1,.03,0);
        box(pcb,.58,.015,.018,blue,0,.032,-.46+i*.15);
        box(pcb,.045,.04,.07,silver,-.21,.065,-.2+i*.065);
        box(pcb,.045,.04,.07,silver,.21,.065,-.2+i*.065);
      }
      for(const x of [-.28,.28]) for(const z of [-.49,.49]) cylinder(pcb,.025,.025,.018,silver,x,.04,z,12);
      for(let i=0;i<3;i++) cylinder(pcb,.05,.05,.14,blue,.23,.1,-.39+i*.16,16);
      lamp(code,-1.65,-.92); books(code,1.6,-.63);
      // A clear glass cup with pencils on the right of the terminal.
      cylinder(code,.14,.13,.4,purple,1.85,.32,.05);
      for(let i=0;i<4;i++) beam(code,[1.8+i*.035,.35,.05],[1.72+i*.08,1.03,.04],.018,[teal,blue,paper,pink][i]);

      const design = new THREE.Group(); base(design);
      // A miniature print press: upright frame, platen, rollers and a real printed sheet.
      box(design,2.22,.25,1.38,navy,-.36,.22,-.28,.05);
      for(const x of [-1.35,.65]) { box(design,.14,2.25,.2,silver,x,1.35,-.75,.025); box(design,.26,.11,.55,purple,x,.22,-.65,.03); }
      box(design,2.22,.16,.22,blue,-.36,2.43,-.75,.035);
      const frame = new THREE.Group(); frame.position.set(-.36,1.45,-.61); design.add(frame);
      box(frame,1.55,1.92,.08,white,0,0,0,.025);
      plane(frame,1.4,1.8,wearPoster,0,0,.05);
      for (const y of [.48,2.42]) {
        const roll=cylinder(design,.12,.12,2.05,teal,-.36,y,-.44);roll.rotation.z=Math.PI/2;
        for(const x of [-1.43,.71]) {const knob=cylinder(design,.16,.16,.12,purple,x,y,-.44);knob.rotation.z=Math.PI/2;}
      }
      box(design,1.63,.06,.8,silver,-.36,.29,.5,.02);
      // A small vector construction board sits beside the press.
      const vectorBoard=new THREE.Group(); vectorBoard.position.set(1.42,1.15,-.34);vectorBoard.rotation.y=-.15;design.add(vectorBoard);
      box(vectorBoard,1.14,1.05,.09,navy,0,0,0,.03);plane(vectorBoard,1.04,.94,blueprint,0,0,.055);
      beam(design,[1.42,.1,-.34],[1.42,1,-.34],.045,silver);
      // A hinged fan of physical color chips.
      const chips = new THREE.Group(); chips.position.set(1.35,.15,.86); design.add(chips);
      [purple,blue,teal,pink,paper].forEach((m,i)=>{const card=new THREE.Group();card.rotation.y=(i-2)*.23;card.position.y=i*.028;box(card,.38,.025,.86,m,0,0,-.3,.02);chips.add(card);});
      cylinder(chips,.045,.045,.17,silver,0,.07,.04);
      box(design,1.5,.035,.16,silver,-.7,.13,1.17);
      for(let i=0;i<25;i++) box(design,.012,.008,i%5===0?.11:.055,navy,-1.39+i*.057,.154,1.18);
      beam(design,[.45,.13,.95],[1.12,.13,1.34],.035,navy);
      const nib = new THREE.Mesh(geometry(new THREE.ConeGeometry(.058,.16,4)),silver);nib.position.set(.39,.13,.92);nib.rotation.z=Math.PI/2;nib.rotation.y=-.5;design.add(nib);
      books(design,-1.7,.8);

      const art = new THREE.Group(); base(art);
      // A working A-frame easel with shelf, braces, hinge and stretched canvas.
      for(const x of [-.96,.96]) beam(art,[x*1.18,.1,.38],[x*.65,2.72,-.55],.065,navy);
      beam(art,[0,.1,-1.28],[0,2.55,-.55],.055,silver);
      beam(art,[-1.05,.35,.3],[1.05,.35,.3],.042,silver);
      box(art,2.18,.11,.36,purple,0,.67,-.02,.03);
      box(art,1.81,2.17,.12,navy,0,1.79,-.39,.025);
      box(art,1.7,2.06,.035,paper,0,1.79,-.31);
      plane(art,1.61,2.01,comicPoster,0,1.79,-.287);
      box(art,.32,.1,.21,silver,0,2.91,-.4,.02);
      cylinder(art,.06,.06,.06,blue,0,2.98,-.4,16);
      // Paint jars with removable-looking lids and printed bands.
      [blue,teal,purple,pink].forEach((m,i)=>{
        const x=-1.62+(i%2)*.36,z=.67+Math.floor(i/2)*.42;
        cylinder(art,.13,.13,.32,white,x,.25,z);
        cylinder(art,.132,.132,.11,m,x,.25,z);
        cylinder(art,.145,.145,.06,navy,x,.44,z);
      });
      cylinder(art,.19,.16,.45,blue,1.65,.33,-.23);
      for(let i=0;i<5;i++) {
        const x=1.55+i*.046,z=-.23+(i%2)*.07;
        const end=[x+(i-2)*.055,1.25+(i%3)*.08,z];
        beam(art,[x,.3,z],end,.018,[navy,purple,silver,navy,teal][i]);
        beam(art,end,[end[0],end[1]+.12,z],.028,paper);
      }
      // Open sketchbook, page signatures and binding rings.
      const book=new THREE.Group();book.position.set(.82,.16,1.02);book.rotation.y=-.12;art.add(book);
      const sketch = canvasMaterial((ctx,w,h)=>{
        ctx.fillStyle='#fffefa';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#433af2';ctx.lineWidth=6;
        ctx.beginPath();ctx.moveTo(210,400);ctx.lineTo(195,160);ctx.lineTo(325,235);ctx.quadraticCurveTo(500,120,665,235);ctx.lineTo(800,155);ctx.lineTo(780,410);ctx.quadraticCurveTo(505,610,210,400);ctx.stroke();
        ctx.strokeStyle='#8a84e7';ctx.lineWidth=4;ctx.beginPath();ctx.arc(385,330,30,0,7);ctx.stroke();ctx.beginPath();ctx.arc(620,330,30,0,7);ctx.stroke();
        ctx.fillStyle='#75776e';ctx.font='24px monospace';ctx.fillText('STUDY / 01',55,h-40);
      });
      box(book,1.24,.06,.82,purple);box(book,1.18,.07,.77,paper,0,.05,0);
      const page=plane(book,.57,.72,sketch,.31,.092,0);page.rotation.x=-Math.PI/2;
      const blank=plane(book,.57,.72,blueprint,-.31,.094,0);blank.rotation.x=-Math.PI/2;
      for(let i=0;i<7;i++){const ring=new THREE.Mesh(geometry(new THREE.TorusGeometry(.035,.009,6,12)),silver);ring.position.set(0,.105,-.3+i*.1);ring.rotation.y=Math.PI/2;book.add(ring);}
      beam(art,[-.55,.14,1.2],[.26,.14,1.43],.025,blue);
      books(art,-1.68,-.65);
      const models = { code, design, art };
      const descriptions = {
        code: 'Code / a working terminal, mechanical keyboard, circuitry and desk tools.',
        design: 'Design / a miniature print press, vector curves and color studies.',
        art: 'Art / an easel with my Graphic Novel Club poster, brushes and sketchbook.'
      };
      const modelRotations = { code: -.17, design: -.18, art: -.12 };
      let selected = 'code';
      sculpture.add(code);
      sculpture.rotation.set(0, modelRotations.code, 0);

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const globallyPaused = () => document.documentElement.classList.contains("motion-paused");
      let paused = reducedMotion.matches;
      let visible = true;
      let contextLost = false;
      let dragging = false;
      let pointerId = null;
      let pointerX = 0;
      let pointerY = 0;
      let frameId = 0;
      let previousTime = 0;
      let motionTime = 0;
      let userRotation = 0;
      let disposed = false;
      const events = new AbortController();
      const on = (target, type, callback, options = {}) => target.addEventListener(type, callback, { ...options, signal: events.signal });

      const draw = () => {
        if (!disposed && !contextLost && visible && !document.hidden) renderer.render(scene, camera);
      };
      const shouldAnimate = () => !disposed && !contextLost && visible && !document.hidden && !paused && !globallyPaused() && !dragging;
      const tick = time => {
        frameId = 0;
        if (!shouldAnimate()) return;
        const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
        previousTime = time;
        motionTime += delta;
        sculpture.rotation.y = modelRotations[selected] + userRotation + Math.sin(motionTime * .42) * .09;
        draw();
        frameId = requestAnimationFrame(tick);
      };
      const updateLoop = () => {
        cancelAnimationFrame(frameId);
        frameId = 0;
        previousTime = 0;
        draw();
        if (shouldAnimate()) frameId = requestAnimationFrame(tick);
      };
      const updateMotionButton = () => {
        if (!motionButton) return;
        const stopped = paused || globallyPaused();
        motionButton.disabled = globallyPaused();
        motionButton.setAttribute("aria-pressed", String(!stopped));
        motionButton.setAttribute("aria-label", stopped ? "Play automatic rotation" : "Pause automatic rotation");
        const label = motionButton.querySelector("[data-sculpture-motion-label]") || motionButton;
        label.textContent = stopped ? "Play motion" : "Pause motion";
      };
      const toggleMotion = () => {
        paused = !paused;
        updateMotionButton();
        updateLoop();
      };
      const selectModel = name => {
        if (!models[name]) return;
        sculpture.remove(models[selected]);
        selected = name;
        sculpture.add(models[name]);
        userRotation = 0; motionTime = 0;
        sculpture.rotation.set(0, modelRotations[name], 0);
        container.dataset.model = name;
        modelButtons.forEach(button => {
          const active = button.dataset.sculptureModel === name;
          button.classList.toggle("is-active", active);
          button.setAttribute("aria-pressed", String(active));
        });
        if (status) status.textContent = descriptions[name];
        canvas.setAttribute("aria-label", `${descriptions[name]} Drag or use arrow keys to rotate. Press Space to pause.`);
        draw();
      };
      const resize = () => {
        const width = canvas.clientWidth || container.clientWidth;
        const height = canvas.clientHeight || container.clientHeight;
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        const aspect = width / height;
        const halfHeight = Math.max(2.42, 2.9 / aspect);
        camera.left = -halfHeight * aspect; camera.right = halfHeight * aspect;
        camera.top = halfHeight; camera.bottom = -halfHeight;
        camera.updateProjectionMatrix();
        draw();
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
      const observer = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        updateLoop();
      }, { rootMargin: "60px" });
      observer.observe(container);

      canvas.style.touchAction = "pan-y";
      canvas.style.cursor = "grab";
      if (!canvas.hasAttribute("tabindex")) canvas.tabIndex = 0;
      if (!canvas.hasAttribute("aria-label")) canvas.setAttribute("aria-label", "Interactive 3D sculpture. Drag or use arrow keys to rotate. Press Space to pause motion.");
      on(canvas, "pointerdown", event => {
        if (event.button !== 0) return;
        pointerId = event.pointerId;
        pointerX = event.clientX;
        pointerY = event.clientY;
        dragging = true;
        canvas.style.cursor = "grabbing";
        canvas.setPointerCapture(pointerId);
        updateLoop();
      });
      on(canvas, "pointermove", event => {
        if (!dragging || event.pointerId !== pointerId) return;
        userRotation += (event.clientX - pointerX) * 0.008;
        sculpture.rotation.y += (event.clientX - pointerX) * 0.008;
        sculpture.rotation.x = THREE.MathUtils.clamp(sculpture.rotation.x + (event.clientY - pointerY) * 0.005, -.5, .5);
        pointerX = event.clientX;
        pointerY = event.clientY;
        draw();
      });
      const release = event => {
        if (event.pointerId !== pointerId) return;
        if (canvas.hasPointerCapture(pointerId)) canvas.releasePointerCapture(pointerId);
        pointerId = null;
        dragging = false;
        canvas.style.cursor = "grab";
        updateLoop();
      };
      on(canvas, "pointerup", release);
      on(canvas, "pointercancel", release);
      on(canvas, "lostpointercapture", release);
      on(canvas, "keydown", event => {
        const amounts = { ArrowLeft: [0, -0.15], ArrowRight: [0, 0.15], ArrowUp: [-0.15, 0], ArrowDown: [0.15, 0] };
        if (amounts[event.key]) {
          event.preventDefault();
          sculpture.rotation.x += amounts[event.key][0];
          sculpture.rotation.y += amounts[event.key][1];
          userRotation += amounts[event.key][1];
          draw();
        } else if (event.code === "Space") {
          event.preventDefault();
          toggleMotion();
        }
      });
      modelButtons.forEach(button => on(button, "click", () => selectModel(button.dataset.sculptureModel)));
      if (motionButton) on(motionButton, "click", toggleMotion);
      on(document, "visibilitychange", updateLoop);
      on(document, "portfolio-motion-change", () => {
        updateMotionButton();
        updateLoop();
      });
      on(reducedMotion, "change", event => {
        paused = event.matches;
        updateMotionButton();
        updateLoop();
      });
      on(canvas, "webglcontextlost", event => {
        event.preventDefault();
        contextLost = true;
        updateLoop();
        fallback();
      });
      on(canvas, "webglcontextrestored", () => {
        contextLost = false;
        modelButtons.forEach(button => { button.disabled = false; });
        if (motionButton) motionButton.disabled = false;
        canvas.tabIndex = 0;
        container.classList.remove("is-static");
        selectModel(selected);
        updateLoop();
        container.classList.add("is-ready");
      });

      selectModel("code");
      updateMotionButton();
      resize();
      draw();
      container.classList.add("is-ready");
      updateLoop();
      const destroy = () => {
        if (disposed) return;
        disposed = true;
        cancelAnimationFrame(frameId);
        events.abort();
        observer.disconnect();
        resizeObserver.disconnect();
        geometries.forEach(item => item.dispose());
        materials.forEach(item => item.dispose());
        textures.forEach(item => item.dispose());
        renderer.dispose();
        container.classList.remove("is-ready");
        delete container.dataset.sculptureInitialized;
      };
      container.sculpture = { destroy, selectModel, toggleMotion };
      return destroy;
    } catch (error) {
      if (renderer) renderer.dispose();
      fallback();
      // The decorative model is optional: the portfolio and static artwork stay usable.
      console.info("3D playground is using its static artwork fallback.", error.message);
    }
  };
})();
