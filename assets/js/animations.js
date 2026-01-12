document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".resume-card");

  cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("active");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("active");
    });
  });
});

(() => {
  let lastFocusedCard = null;
  let escPressed = false;

  // запоминаем последний фокус на карточке
  document.addEventListener("focusin", (e) => {
    const card = e.target.closest(".home-card");
    if (card) {
      lastFocusedCard = card;
    }
  });

  // обработка Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (document.activeElement?.classList.contains("home-card")) {
        escPressed = true;
        document.activeElement.blur();
      }
    }
  });

  // перехватываем следующий Tab
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab" && escPressed && lastFocusedCard) {
      e.preventDefault();
      lastFocusedCard.focus();
      escPressed = false;
    }
  });
})();
