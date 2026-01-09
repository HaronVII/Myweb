(() => {
  const canvas = document.getElementById("bg-stars");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  let w = 0, h = 0, dpr = 1;
  const stars = [];
  const shooting = [];
  let lastShoot = 0;

  // настройки
  const STAR_COUNT = 140;        // плотность “неба”
  const SHOOT_INTERVAL = 1200;   // мс между “падающими”
  const MAX_SHOOTS = 2;          // максимум одновременно

  function resize() {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function init() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: rand(0.6, 1.6),
        a: rand(0.12, 0.55),
        tw: rand(0.004, 0.02),
      });
    }
  }

  function spawnShooting() {
    if (shooting.length >= MAX_SHOOTS) return;

    // старт сверху/слева, полёт вниз/вправо
    const fromLeft = Math.random() < 0.5;
    const x = fromLeft ? -50 : rand(0, w * 0.7);
    const y = fromLeft ? rand(0, h * 0.4) : -50;

    const speed = rand(10, 18);
    const ang = rand(Math.PI * 0.20, Math.PI * 0.30); // направление
    const vx = Math.cos(ang) * speed;
    const vy = Math.sin(ang) * speed;

    shooting.push({
      x, y, vx, vy,
      life: rand(28, 45),
      max: 0
    });
  }

  function drawStar(s) {
    // лёгкое мерцание
    s.a += s.tw * (Math.random() < 0.5 ? -1 : 1);
    s.a = Math.max(0.08, Math.min(0.65, s.a));

    ctx.globalAlpha = s.a;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawShooting(p) {
    // “хвост”
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x - p.vx * 3.2, p.y - p.vy * 3.2);
    ctx.stroke();

    // “голова”
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }

  let running = false;
  let rafId = 0;

  function tick(ts) {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);

    // цвет “звёзд”
    ctx.fillStyle = "rgba(229,231,235,1)";
    ctx.strokeStyle = "rgba(56,189,248,0.55)";

    // обычные звёзды
    for (const s of stars) drawStar(s);

    // падающие
    for (let i = shooting.length - 1; i >= 0; i--) {
      const p = shooting[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      drawShooting(p);

      if (p.life <= 0 || p.x > w + 120 || p.y > h + 120) {
        shooting.splice(i, 1);
      }
    }

    // иногда создаём “падающую”
    if (ts - lastShoot > SHOOT_INTERVAL) {
      lastShoot = ts;
      if (Math.random() < 0.75) spawnShooting();
    }

    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    resize();
    init();
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  window.addEventListener("resize", () => {
    resize();
    init();
  });

  if (window.AnimationManager) {
    window.AnimationManager.register("bg-stars", { start, stop });
  } else {
    start();
  }
})();
