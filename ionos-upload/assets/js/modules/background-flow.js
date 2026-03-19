const TAU = Math.PI * 2;

export function initBackgroundFlow() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  if (document.querySelector(".background-flow-canvas")) {
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.className = "background-flow-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    canvas.remove();
    return;
  }

  let width = 0;
  let height = 0;
  let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let rafId = 0;
  let lastTs = performance.now();

  const points = [];

  const resize = () => {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedPoints();
  };

  const seedPoints = () => {
    const targetCount = Math.max(22, Math.min(56, Math.round((width * height) / 24000)));

    while (points.length < targetCount) {
      points.push(makePoint(width, height));
    }

    while (points.length > targetCount) {
      points.pop();
    }
  };

  const frame = (ts) => {
    const dt = Math.min(42, ts - lastTs);
    lastTs = ts;

    tickPoints(points, dt, width, height, ts);
    drawField(ctx, points, width, height);

    rafId = window.requestAnimationFrame(frame);
  };

  const onVisibility = () => {
    if (document.hidden) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
      return;
    }

    if (!rafId) {
      lastTs = performance.now();
      rafId = window.requestAnimationFrame(frame);
    }
  };

  resize();
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  rafId = window.requestAnimationFrame(frame);
}

function makePoint(width, height) {
  const depth = Math.random();
  const speed = 0.015 + depth * 0.03;
  const angle = Math.random() * TAU;

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    z: depth,
    vz: (Math.random() * 2 - 1) * 0.00045,
    phase: Math.random() * TAU
  };
}

function tickPoints(points, dt, width, height, ts) {
  const margin = 42;

  for (const point of points) {
    point.z += point.vz * dt;
    if (point.z > 1 || point.z < 0.08) {
      point.vz *= -1;
      point.z = Math.max(0.08, Math.min(1, point.z));
    }

    const drift = Math.sin(ts * 0.00042 + point.phase) * 0.015;
    const speedScale = 1 + point.z * 0.45;

    point.x += (point.vx + drift) * dt * speedScale;
    point.y += (point.vy + drift * 0.5) * dt * speedScale;

    if (point.x < -margin) point.x = width + margin;
    if (point.x > width + margin) point.x = -margin;
    if (point.y < -margin) point.y = height + margin;
    if (point.y > height + margin) point.y = -margin;
  }
}

function drawField(ctx, points, width, height) {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];

    for (let j = i + 1; j < points.length; j += 1) {
      const b = points[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);

      const depthMix = (a.z + b.z) * 0.5;
      const maxDist = 92 + depthMix * 118;
      if (dist > maxDist) continue;

      const t = 1 - dist / maxDist;
      const alpha = 0.07 + t * t * (0.138 + depthMix * 0.18);

      ctx.strokeStyle = `rgba(0, 122, 86, ${alpha.toFixed(3)})`;
      ctx.lineWidth = 0.35 + depthMix * 0.75;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }

  for (const point of points) {
    const radius = 0.95 + point.z * 1.9;
    const alpha = 0.318 + point.z * 0.552;

    ctx.fillStyle = `rgba(6, 138, 98, ${alpha.toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, TAU);
    ctx.fill();
  }
}
