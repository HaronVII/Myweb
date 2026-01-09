(() => {
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
      devops: {
        desc: "CI/CD, контейнеризация, инфраструктура как код, стабильные релизы.",
        hoverTitle: "Key skills",
        hoverList: ["CI/CD", "Docker", "IaC", "Release flow"],
        action: "Open →"
      },
      strategy: {
        desc: "Логика продукта и бизнеса: ценность, позиционирование, рост.",
        hoverTitle: "Key skills",
        hoverList: ["Product logic", "Go-to-market", "Metrics", "Research"],
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
      devops: {
        desc: "Платформа поставки: пайплайны, стандарты, SRE-подходы.",
        hoverTitle: "System view",
        hoverList: ["CI/CD platform", "Reliability", "Automation", "SLO/SLA"],
        action: "Open →"
      },
      strategy: {
        desc: "Стратегия продукта: портфель, фокус, устойчивый рост.",
        hoverTitle: "System view",
        hoverList: ["Roadmap", "Unit-экономика", "Portfolio", "Prioritization"],
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
      devops: {
        desc: "Интересно делать релизы предсказуемыми и быстрыми.",
        hoverTitle: "I enjoy",
        hoverList: ["Automation", "Pipelines", "Observability", "Quality gates"],
        action: "Open →"
      },
      strategy: {
        desc: "Нравится искать смысл и рост: для кого и зачем продукт.",
        hoverTitle: "I enjoy",
        hoverList: ["Value", "Hypotheses", "Market fit", "Story"],
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

  window.HOME_CONTENT = { COPY, PANEL };
})();
