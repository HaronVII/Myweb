(() => {
  const canvas = document.getElementById("bg-fog");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  let w = 0, h = 0, dpr = 1;
  let t = 0;

  // параметры тумана
  const LAYERS = 5;          // слои глубины
  const BASE_SPEED = 0.0006; // общая скорость дрейфа
  const NOISE_SCALE = 0.0015;
  const OPACITY = 0.35;

  function resize(){
    dpr = Math.max(1, window.devicePixelRatio || 1);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function noise(x, y){
    // псевдошум (быстрый и достаточный для тумана)
    return Math.sin(x * 12.9898 + y * 78.233) * 43758.5453 % 1;
  }

  function drawLayer(layer){
    const speed = BASE_SPEED * (layer + 1);
    const scale = NOISE_SCALE * (layer + 1);
    const alpha = OPACITY / (layer + 1);

    const img = ctx.createImageData(w, h);
    const data = img.data;

    for(let y = 0; y < h; y += 2){
      for(let x = 0; x < w; x += 2){
        const nx = x * scale + t * speed * w;
        const ny = y * scale + t * speed * h;
        const n = noise(nx, ny);

        if (n > 0.45) {
          const i = (y * w + x) * 4;
          data[i]     = 80 + layer * 40;  // R
          data[i + 1] = 90 + layer * 30;  // G
          data[i + 2] = 130 + layer * 40; // B
          data[i + 3] = Math.floor(255 * alpha * n);
        }
      }
    }

    ctx.putImageData(img, 0, 0);
  }

  let running = false;
  let rafId = 0;

  function tick(){
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    for(let i = 0; i < LAYERS; i++){
      drawLayer(i);
    }
    t += 1;
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    resize();
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  window.addEventListener("resize", resize);

  if (window.AnimationManager) {
    window.AnimationManager.register("bg-fog", { start, stop });
  } else {
    start();
  }
})();
