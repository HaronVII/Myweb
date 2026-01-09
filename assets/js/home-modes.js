(() => {
  const STORAGE_KEY = "home_mode_v1";

  // ====== CARD COPY (per mode) ======
  const COPY = {
    recruiter: {
      crm: {
        desc: "Внедрение CRM, автоматизация продаж и процессов, интеграции и аналитика.",
        hoverTitle: "Key skills",
        hoverList: ["Bitrix24", "Автоматизация", "Интеграции", "Аналитика"],
        action: "Open →"
      },
      infra: {
        desc: "Администрирование, надежность, мониторинг, сети и безопасность.",
        hoverTitle: "Key skills",
        hoverList: ["Linux/Windows", "Networking", "Monitoring", "Security"],
        action: "Open →"
      },
      product: {
        desc: "Стратегия, рост, ценность продукта, метрики и гипотезы.",
        hoverTitle: "Key skills",
        hoverList: ["Product thinking", "Metrics", "Go-to-market", "Research"],
        action: "Open →"
      },
      creative: {
        desc: "Концепции, смыслы, дизайн-логика, нестандартные форматы.",
        hoverTitle: "Key skills",
        hoverList: ["Concept", "UX logic", "Story", "Visual system"],
        action: "Open →"
      },
      knowledge: {
        desc: "База знаний: заметки, процессы, системное мышление.",
        hoverTitle: "Purpose",
        hoverList: ["Notes", "Frameworks", "Checklists"],
        action: "Explore →"
      },
      research: {
        desc: "Эксперименты и прототипы: идея → тест → результат.",
        hoverTitle: "Focus",
        hoverList: ["Prototypes", "R&D", "Hypotheses"],
        action: "Explore →"
      }
    },

    architect: {
      crm: {
        desc: "Проектирую CRM-архитектуру: роли, сущности, автоматизации, контрольные точки.",
        hoverTitle: "System view",
        hoverList: ["Воронки/стадии", "SLA и контроль", "Сущности/смарт-процессы", "Интеграционный контур"],
        action: "Open →"
      },
      infra: {
        desc: "Инфраструктура как система: сегментация, отказоустойчивость, наблюдаемость.",
        hoverTitle: "System view",
        hoverList: ["Архитектура сети", "Backup/DR", "Observability", "Access control"],
        action: "Open →"
      },
      product: {
        desc: "Строю продуктовые системы: метрики, циклы обратной связи, рост.",
        hoverTitle: "System view",
        hoverList: ["North Star", "A/B подход", "Funnel logic", "Value loop"],
        action: "Open →"
      },
      creative: {
        desc: "Собираю визуальные системы: правила, ритм, композиция, смысл.",
        hoverTitle: "System view",
        hoverList: ["Design system", "Hierarchy", "Consistency", "Narrative"],
        action: "Open →"
      },
      knowledge: {
        desc: "Knowledge как инфраструктура: структуры, связи, стандарты заметок.",
        hoverTitle: "System view",
        hoverList: ["Taxonomy", "Linking", "Templates", "Review cycles"],
        action: "Explore →"
      },
      research: {
        desc: "R&D как конвейер: гипотеза → прототип → проверка → вывод.",
        hoverTitle: "System view",
        hoverList: ["Experiment design", "Validation", "Iteration"],
        action: "Explore →"
      }
    },

    personal: {
      crm: {
        desc: "Мне нравится превращать хаос процессов в управляемую систему.",
        hoverTitle: "I enjoy",
        hoverList: ["Разбирать бизнес", "Собирать логику", "Делать удобно", "Доводить до результата"],
        action: "Open →"
      },
      infra: {
        desc: "Люблю, когда всё работает тихо: мониторинг, порядок, надежность.",
        hoverTitle: "I enjoy",
        hoverList: ["Автоматизация рутины", "Стабильность", "Чистые схемы"],
        action: "Open →"
      },
      product: {
        desc: "Интересно искать рост и смысл: зачем, кому и почему это нужно.",
        hoverTitle: "I enjoy",
        hoverList: ["Смысл и ценность", "Гипотезы", "Системное мышление"],
        action: "Open →"
      },
      creative: {
        desc: "Тянет к концептам, эстетике и нестандартным решениям.",
        hoverTitle: "I enjoy",
        hoverList: ["Идеи", "Формы", "Смыслы", "Истории"],
        action: "Open →"
      },
      knowledge: {
        desc: "Собираю личную базу знаний: заметки, связи, шаблоны мышления.",
        hoverTitle: "I enjoy",
        hoverList: ["Notes", "Mind maps", "Связи", "Рефлексия"],
        action: "Explore →"
      },
      research: {
        desc: "Эксперименты как способ учиться: пробовать и собирать опыт.",
        hoverTitle: "I enjoy",
        hoverList: ["Прототипы", "Тесты", "Новые подходы"],
        action: "Explore →"
      }
    }
  };

  // ====== RIGHT PANEL (per mode) ======
  const PANEL = {
    recruiter: {
      kicker: "Recruiter snapshot",
      title: "Denis · CRM / Infrastructure / Automation",
      text: "Коротко и по делу: чем полезен, какие задачи закрываю, какой результат даю команде.",
      stats: [
        { num: "12", label: "Projects" },
        { num: "3", label: "Active" },
        { num: "7", label: "Core skills" }
      ],
      actions: [
        { text: "Open CRM →", href: "../resume/crm-bitrix24.html", kind: "primary" },
        { text: "Email →", href: "mailto:you@example.com", kind: "ghost" }
      ]
    },
    architect: {
      kicker: "Architect view",
      title: "Systems · Processes · Reliability",
      text: "Системный режим: архитектура решений, контроль качества, наблюдаемость, масштабирование.",
      stats: [
        { num: "6", label: "Systems" },
        { num: "4", label: "Stacks" },
        { num: "99%", label: "Stability" }
      ],
      actions: [
        { text: "Infra resume →", href: "../resume/sysadmin.html", kind: "primary" },
        { text: "Notes →", href: "../kb/index.html", kind: "ghost" }
      ]
    },
    personal: {
      kicker: "Personal mode",
      title: "Learning · Experiments · Growth",
      text: "Личное: интересы, развитие, эксперименты и то, что я строю как систему.",
      stats: [
        { num: "48", label: "Notes" },
        { num: "9", label: "Concepts" },
        { num: "5", label: "Experiments" }
      ],
      actions: [
        { text: "Knowledge →", href: "../kb/index.html", kind: "primary" },
        { text: "Research →", href: "../resume/devops.html", kind: "ghost" }
      ]
    }
  };

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
