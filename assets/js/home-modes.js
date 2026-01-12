(() => {
  const STORAGE_KEY = "home_mode_v1";
  const { COPY = {}, PANEL = {} } = window.HOME_CONTENT || {};

  // ====== timings (sync with CSS) ======
  const FADE_MS = 180;        // длительность затухания/появления
  const CARD_STAGGER_MS = 70; // задержка между карточками (каскад)

  // ====== helpers ======
  function setText(el, text) {
    if (el) el.textContent = text;
  }

  function renderList(ul, items) {
    if (!ul) return;
    ul.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });
  }

  function renderActions(container, actions) {
    if (!container) return;
    container.innerHTML = "";
    (actions || []).forEach((a) => {
      const link = document.createElement("a");
      link.className = a.kind === "primary" ? "home-btn" : "home-btn ghost";
      link.href = a.href;
      link.textContent = a.text;
      container.appendChild(link);
    });
  }

  function setButtonsActive(mode) {
    document.querySelectorAll(".home-mode").forEach((btn) => {
      const active = btn.dataset.mode === mode;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
  }

  function getCards() {
    return Array.from(document.querySelectorAll(".home-grid .home-card[data-module]"));
  }

  // ====== main apply (with cascade) ======
  function applyMode(mode) {
    if (!COPY[mode]) mode = "recruiter";

    const grid = document.querySelector(".home-grid");
    const panel = document.querySelector(".home-panel");
    const cards = getCards();

    // включаем каскад на grid (CSS будет читать --delay)
    if (grid) grid.classList.add("is-cascade");

    // сбрасываем задержки (чтобы не копились)
    cards.forEach((card) => card.style.removeProperty("--delay"));

    // UI должен реагировать сразу
    setButtonsActive(mode);

    // fade-out: панель + все карточки сразу
    if (panel) panel.classList.add("is-fading");
    cards.forEach((card) => card.classList.add("is-fading"));

    // если ты кликаешь режимы быстро — отменяем прошлый таймер
    clearTimeout(applyMode._t);

    applyMode._t = setTimeout(() => {
      // ===== update cards content =====
      const pack = COPY[mode];
      cards.forEach((card) => {
        const key = card.dataset.module;
        const data = pack[key];
        if (!data) return;

        const desc = card.querySelector(".home-card-desc");
        const hoverTitle = card.querySelector(".home-hover-title");
        const hoverList = card.querySelector(".home-hover-list");
        const action = card.querySelector(".home-hover-action");

        setText(desc, data.desc);
        setText(hoverTitle, data.hoverTitle);
        renderList(hoverList, data.hoverList);
        setText(action, data.action);
      });

      // ===== update right panel =====
      const p = PANEL[mode] || PANEL.recruiter;

      setText(document.getElementById("panel-kicker"), p.kicker);
      setText(document.getElementById("panel-title"), p.title);
      setText(document.getElementById("panel-text"), p.text);

      setText(document.getElementById("stat-1-num"), p.stats?.[0]?.num ?? "");
      setText(document.getElementById("stat-1-label"), p.stats?.[0]?.label ?? "");
      setText(document.getElementById("stat-2-num"), p.stats?.[1]?.num ?? "");
      setText(document.getElementById("stat-2-label"), p.stats?.[1]?.label ?? "");
      setText(document.getElementById("stat-3-num"), p.stats?.[2]?.num ?? "");
      setText(document.getElementById("stat-3-label"), p.stats?.[2]?.label ?? "");

      renderActions(document.getElementById("panel-actions"), p.actions);

      // persist
      localStorage.setItem(STORAGE_KEY, mode);

      // ===== set stagger delays for fade-in (panel first, then cards) =====
      // ===== stagger order: Featured first, then normal, then future =====
const featured = [];
const normal = [];
const future = [];

cards.forEach((card) => {
  if (card.classList.contains("featured")) featured.push(card);
  else if (card.classList.contains("future")) future.push(card);
  else normal.push(card);
});

// порядок появления карточек (после панели):
// featured → normal → future
const ordered = [...featured, ...normal, ...future];

// назначаем задержки (featured получит 0ms)
ordered.forEach((card, i) => {
  card.style.setProperty("--delay", `${160 + i * CARD_STAGGER_MS}ms`);

});


      // fade-in:
      // 1) панель сразу
      // 2) карточки — по очереди (за счёт transition-delay)
      requestAnimationFrame(() => {
        if (panel) panel.classList.remove("is-fading");
        cards.forEach((card) => card.classList.remove("is-fading"));
      });
    }, FADE_MS);
  }

  // ====== init ======
  function init() {
    let mode = localStorage.getItem(STORAGE_KEY);
    if (!mode || !COPY[mode]) mode = "recruiter";

    applyMode(mode);

    document.querySelectorAll(".home-mode").forEach((btn) => {
      btn.addEventListener("click", () => applyMode(btn.dataset.mode));
    });

    // hotkeys 1/2/3 (ignore inputs)
    window.addEventListener("keydown", (e) => {
      const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
      if (tag === "input" || tag === "textarea") return;

      if (e.key === "1") applyMode("recruiter");
      if (e.key === "2") applyMode("architect");
      if (e.key === "3") applyMode("personal");
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
