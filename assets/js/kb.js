(() => {
  const LS_KEY = "kb_notes_v1";

  // DOM
  const noteList = document.getElementById("noteList");
  const titleInput = document.getElementById("titleInput");
  const bodyInput = document.getElementById("bodyInput");
  const newBtn = document.getElementById("newBtn");
  const saveBtn = document.getElementById("saveBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const exportBtn = document.getElementById("exportBtn");
  const importBtn = document.getElementById("importBtn");
  const rebuildBtn = document.getElementById("rebuildBtn");
  const fitBtn = document.getElementById("fitBtn");

  const searchInput = document.getElementById("searchInput");
  const statusText = document.getElementById("statusText");

  const canvas = document.getElementById("graph");
  const ctx = canvas?.getContext("2d");

  const viewNotes = document.getElementById("view-notes");
  const viewGraph = document.getElementById("view-graph");
  const tabs = document.querySelectorAll(".kb-tab");

  // State
  let notes = [];
  let activeId = null;

  let searchQuery = "";
  let saveTimer = null;

  let graphState = {
    nodes: [],
    edges: [],
    byId: new Map(),
    view: { x: 0, y: 0, scale: 1 },
    running: false,
    raf: 0,
    lastTick: 0,
  };

  // Helpers
  const uid = () => "n_" + Math.random().toString(16).slice(2) + Date.now().toString(16);

  function setStatus(t) {
    if (statusText) statusText.textContent = t;
  }

  function loadNotes() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveNotes(arr) {
    localStorage.setItem(LS_KEY, JSON.stringify(arr));
  }

  function nowISO() {
    return new Date().toISOString();
  }

  function notePreview(text, max = 90) {
    const s = (text || "").replace(/\s+/g, " ").trim();
    return s.length > max ? s.slice(0, max) + "…" : s;
  }

  function setActive(id) {
    activeId = id;
    renderList();
    const n = notes.find(x => x.id === id);
    if (n) {
      titleInput.value = n.title || "";
      bodyInput.value = n.body || "";
    }
  }

  function createNote() {
    const n = {
      id: uid(),
      title: "Untitled",
      body: "",
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    notes.push(n);
    saveNotes(notes);
    setActive(n.id);
    setStatus("saved");
  }

  function upsertActive() {
    if (!activeId) return;
    const n = notes.find(x => x.id === activeId);
    if (!n) return;

    n.title = (titleInput.value || "").trim() || "Untitled";
    n.body = bodyInput.value || "";
    n.updatedAt = nowISO();

    saveNotes(notes);
    renderList();
  }

  function deleteActive() {
    if (!activeId) return;
    const idx = notes.findIndex(x => x.id === activeId);
    if (idx === -1) return;

    notes.splice(idx, 1);
    saveNotes(notes);

    activeId = notes[0]?.id || null;
    if (activeId) {
      setActive(activeId);
    } else {
      titleInput.value = "";
      bodyInput.value = "";
      renderList();
    }

    setStatus("saved");
  }

  function scheduleAutosave() {
    setStatus("saving…");
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      upsertActive();
      setStatus("saved");
    }, 600);
  }

  function renderList() {
    if (!noteList) return;

    noteList.innerHTML = "";

    const list = notes
      .slice()
      .sort((a, b) => (a.title || "").localeCompare(b.title || "", "ru"))
      .filter(n => {
        if (!searchQuery) return true;
        const t = (n.title || "").toLowerCase();
        const b = (n.body || "").toLowerCase();
        return t.includes(searchQuery) || b.includes(searchQuery);
      });

    if (list.length === 0) {
      const empty = document.createElement("div");
      empty.className = "kb-muted";
      empty.style.padding = "10px";
      empty.textContent = "Нет заметок по фильтру.";
      noteList.appendChild(empty);
      return;
    }

    list.forEach(n => {
      const item = document.createElement("div");
      item.className = "kb-item" + (n.id === activeId ? " active" : "");
      item.innerHTML = `
        <strong>${escapeHtml(n.title || "Untitled")}</strong>
        <small>${escapeHtml(notePreview(n.body))}</small>
      `;
      item.addEventListener("click", () => setActive(n.id));
      noteList.appendChild(item);
    });
  }

  function escapeHtml(s) {
    return (s || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // Tabs
  function setView(name) {
    tabs.forEach(t => t.classList.toggle("active", t.dataset.view === name));
    if (name === "notes") {
      viewNotes.style.display = "";
      viewGraph.style.display = "none";
      stopGraph();
    } else {
      viewNotes.style.display = "none";
      viewGraph.style.display = "";
      resizeCanvas();
      rebuildGraph();
      startGraph();
    }
  }

  tabs.forEach(t => t.addEventListener("click", () => setView(t.dataset.view)));

  // Export/Import
  exportBtn?.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "knowledge-base.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  importBtn?.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!Array.isArray(data)) throw new Error("Invalid format");
        notes = data.map(x => ({
          id: x.id || uid(),
          title: x.title || "Untitled",
          body: x.body || "",
          createdAt: x.createdAt || nowISO(),
          updatedAt: x.updatedAt || nowISO(),
        }));
        saveNotes(notes);
        activeId = notes[0]?.id || null;
        if (activeId) setActive(activeId);
        renderList();
        setStatus("imported");
      } catch {
        alert("Не удалось импортировать JSON.");
      }
    };
    input.click();
  });

  // Buttons
  newBtn?.addEventListener("click", createNote);
  saveBtn?.addEventListener("click", () => { upsertActive(); setStatus("saved"); });
  deleteBtn?.addEventListener("click", deleteActive);

  // Search
  searchInput?.addEventListener("input", () => {
    searchQuery = (searchInput.value || "").trim().toLowerCase();
    renderList();
  });

  // Hotkeys
  window.addEventListener("keydown", (e) => {
    const isMac = navigator.platform.toLowerCase().includes("mac");
    const mod = isMac ? e.metaKey : e.ctrlKey;

    if (mod && e.key.toLowerCase() === "s") {
      e.preventDefault();
      upsertActive();
      setStatus("saved");
    }

    if (mod && e.key.toLowerCase() === "k") {
      e.preventDefault();
      searchInput?.focus();
    }
  });

  // Autosave on typing
  titleInput?.addEventListener("input", scheduleAutosave);
  bodyInput?.addEventListener("input", scheduleAutosave);

  // ===== Graph =====

  function parseWikiLinks(text) {
    const out = [];
    const re = /\[\[([^\]]+)\]\]/g;
    let m;
    while ((m = re.exec(text || "")) !== null) {
      const raw = (m[1] || "").trim();
      if (raw) out.push(raw);
    }
    return out;
  }

  function buildGraphData() {
    const nodes = [];
    const edges = [];
    const byTitle = new Map();
    const byId = new Map();

    // nodes from notes
    notes.forEach(n => {
      const node = {
        id: n.id,
        title: n.title || "Untitled",
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 400,
        vx: 0,
        vy: 0,
        r: 18,
      };
      nodes.push(node);
      byTitle.set(node.title.toLowerCase(), node);
      byId.set(node.id, node);
    });

    // edges from wiki links (by title match)
    notes.forEach(n => {
      const from = byId.get(n.id);
      if (!from) return;
      const links = parseWikiLinks(n.body);
      links.forEach(t => {
        const to = byTitle.get(t.toLowerCase());
        if (to && to.id !== from.id) {
          edges.push({ a: from.id, b: to.id });
        }
      });
    });

    return { nodes, edges, byId };
  }

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const box = canvas.parentElement;
    if (!box) return;

    const rect = box.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function fitGraph() {
    const nodes = graphState.nodes;
    if (!nodes.length) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x);
      maxY = Math.max(maxY, n.y);
    });

    const w = canvas.clientWidth || 800;
    const h = canvas.clientHeight || 500;

    const pad = 60;
    const gw = Math.max(1, (maxX - minX) + pad * 2);
    const gh = Math.max(1, (maxY - minY) + pad * 2);

    const sx = w / gw;
    const sy = h / gh;
    const scale = Math.max(0.25, Math.min(2.2, Math.min(sx, sy)));

    graphState.view.scale = scale;
    graphState.view.x = (w / 2) - ((minX + maxX) / 2) * scale;
    graphState.view.y = (h / 2) - ((minY + maxY) / 2) * scale;
  }

  function rebuildGraph() {
    const g = buildGraphData();
    graphState.nodes = g.nodes;
    graphState.edges = g.edges;
    graphState.byId = g.byId;
    graphState.view = { x: 0, y: 0, scale: 1 };
    fitGraph();
    drawGraph();
  }

  function startGraph() {
    if (graphState.running) return;
    graphState.running = true;
    graphState.lastTick = 0;

    const targetFrameMs = 1000 / 30;

    const step = (ts) => {
      if (!graphState.running) return;
      if (!graphState.lastTick) graphState.lastTick = ts;

      const elapsed = ts - graphState.lastTick;
      if (elapsed >= targetFrameMs) {
        const dt = Math.min(2, elapsed / (1000 / 60));
        graphState.lastTick = ts;
        tick(dt);
        drawGraph();
      }
      graphState.raf = requestAnimationFrame(step);
    };
    graphState.raf = requestAnimationFrame(step);
  }

  function stopGraph() {
    graphState.running = false;
    cancelAnimationFrame(graphState.raf);
  }

  class Quadtree {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.mass = 0;
      this.cx = 0;
      this.cy = 0;
      this.point = null;
      this.children = null;
    }

    contains(p) {
      return p.x >= this.x && p.x <= this.x + this.size &&
        p.y >= this.y && p.y <= this.y + this.size;
    }

    addMass(p) {
      const m = this.mass;
      this.mass = m + 1;
      this.cx = (this.cx * m + p.x) / this.mass;
      this.cy = (this.cy * m + p.y) / this.mass;
    }

    subdivide() {
      const half = this.size / 2;
      this.children = [
        new Quadtree(this.x, this.y, half),
        new Quadtree(this.x + half, this.y, half),
        new Quadtree(this.x, this.y + half, half),
        new Quadtree(this.x + half, this.y + half, half),
      ];
    }

    insert(p) {
      if (!this.contains(p)) return false;
      this.addMass(p);

      if (!this.point && !this.children) {
        this.point = p;
        return true;
      }

      if (!this.children) {
        this.subdivide();
        if (this.point) {
          this.children.some(child => child.insert(this.point));
          this.point = null;
        }
      }

      return this.children.some(child => child.insert(p));
    }
  }

  function buildQuadtree(nodes) {
    if (!nodes.length) return null;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    nodes.forEach(n => {
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x);
      maxY = Math.max(maxY, n.y);
    });

    const size = Math.max(1, Math.max(maxX - minX, maxY - minY)) + 120;
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const root = new Quadtree(cx - size / 2, cy - size / 2, size);
    nodes.forEach(n => root.insert(n));
    return root;
  }

  function applyRepulsion(node, quad, theta, repulsion, softening, dt) {
    if (!quad || quad.mass === 0) return;
    const dx = node.x - quad.cx;
    const dy = node.y - quad.cy;
    const dist = Math.sqrt(dx * dx + dy * dy) + softening;

    if (quad.point === node && !quad.children) return;

    if (!quad.children || (quad.size / dist) < theta) {
      const force = (repulsion * quad.mass) / (dist * dist);
      node.vx += (dx / dist) * force * dt;
      node.vy += (dy / dist) * force * dt;
      return;
    }

    quad.children.forEach(child => applyRepulsion(node, child, theta, repulsion, softening, dt));
  }

  function tick(dt) {
    const nodes = graphState.nodes;
    const edges = graphState.edges;

    if (nodes.length === 0) return;

    // physics params
    const repulsion = 4200;
    const spring = 0.0026;
    const springLen = 140;
    const damp = 0.86;
    const theta = 0.6;
    const softening = 1.2;

    const quad = buildQuadtree(nodes);

    nodes.forEach(n => {
      applyRepulsion(n, quad, theta, repulsion, softening, dt);
    });

    // springs (FAST via byId)
    edges.forEach(e => {
      const a = graphState.byId.get(e.a);
      const b = graphState.byId.get(e.b);
      if (!a || !b) return;

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const diff = dist - springLen;
      const fx = (dx / dist) * diff * spring;
      const fy = (dy / dist) * diff * spring;

      a.vx += fx * dt; a.vy += fy * dt;
      b.vx -= fx * dt; b.vy -= fy * dt;
    });

    // integrate
    nodes.forEach(n => {
      const decay = Math.pow(damp, dt);
      n.vx *= decay;
      n.vy *= decay;
      n.x += n.vx * dt;
      n.y += n.vy * dt;
    });
  }

  function drawGraph() {
    if (!ctx || !canvas) return;

    const w = canvas.clientWidth || 800;
    const h = canvas.clientHeight || 500;

    ctx.clearRect(0, 0, w, h);

    const { x: ox, y: oy, scale } = graphState.view;

    // edges
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = 1;

    graphState.edges.forEach(e => {
      const a = graphState.byId.get(e.a);
      const b = graphState.byId.get(e.b);
      if (!a || !b) return;

      ctx.strokeStyle = "rgba(159,176,218,0.22)";
      ctx.beginPath();
      ctx.moveTo(ox + a.x * scale, oy + a.y * scale);
      ctx.lineTo(ox + b.x * scale, oy + b.y * scale);
      ctx.stroke();
    });

    // nodes
    graphState.nodes.forEach(n => {
      const px = ox + n.x * scale;
      const py = oy + n.y * scale;

      const isActive = n.id === activeId;

      ctx.fillStyle = isActive ? "rgba(47,198,246,0.95)" : "rgba(255,255,255,0.12)";
      ctx.strokeStyle = isActive ? "rgba(47,198,246,0.35)" : "rgba(255,255,255,0.18)";

      const r = isActive ? 22 : 18;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // label
      ctx.fillStyle = "rgba(232,238,255,0.92)";
      ctx.font = "12px Inter, sans-serif";
      ctx.fillText(n.title.slice(0, 18), px + r + 6, py + 4);
    });
  }

  function canvasToWorld(mx, my) {
    const { x: ox, y: oy, scale } = graphState.view;
    return {
      x: (mx - ox) / scale,
      y: (my - oy) / scale
    };
  }

  function findNearestNode(mx, my) {
    const p = canvasToWorld(mx, my);
    let best = null;
    let bestD = Infinity;
    graphState.nodes.forEach(n => {
      const dx = n.x - p.x;
      const dy = n.y - p.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestD) {
        bestD = d2;
        best = n;
      }
    });
    return best;
  }

  canvas?.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const n = findNearestNode(mx, my);
    if (!n) return;

    setActive(n.id);
    setView("notes");
  });

  // Buttons for graph
  rebuildBtn?.addEventListener("click", () => {
    rebuildGraph();
    setStatus("saved");
  });

  fitBtn?.addEventListener("click", () => {
    fitGraph();
    drawGraph();
  });

  window.addEventListener("resize", () => {
    if (viewGraph.style.display !== "none") {
      resizeCanvas();
      fitGraph();
      drawGraph();
    }
  });

  // Init
  notes = loadNotes();
  if (!notes.length) {
    notes = [{
      id: uid(),
      title: "Старт",
      body: "Пример: [[Bitrix24]] [[DevOps]]\n\nЗдесь будут твои заметки.",
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }];
    saveNotes(notes);
  }

  activeId = notes[0].id;
  setActive(activeId);
  renderList();
  setStatus("saved");

  // default view
  setView("notes");
})();
