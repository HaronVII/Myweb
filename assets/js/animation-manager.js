(() => {
  const animations = new Map();
  const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  let prefersReducedMotion = mediaQuery?.matches ?? false;

  function shouldRun() {
    return document.visibilityState === "visible" && !prefersReducedMotion;
  }

  function startAll() {
    if (!shouldRun()) return;
    animations.forEach((anim) => anim.start());
  }

  function stopAll() {
    animations.forEach((anim) => anim.stop());
  }

  function handleVisibility() {
    if (shouldRun()) startAll();
    else stopAll();
  }

  function handleMotionChange(event) {
    prefersReducedMotion = event.matches;
    handleVisibility();
  }

  if (mediaQuery) {
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMotionChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleMotionChange);
    }
  }

  document.addEventListener("visibilitychange", handleVisibility);

  window.AnimationManager = {
    register(name, { start, stop }) {
      if (!name || typeof start !== "function" || typeof stop !== "function") return;
      animations.set(name, { start, stop });
      if (shouldRun()) start();
    }
  };
})();
