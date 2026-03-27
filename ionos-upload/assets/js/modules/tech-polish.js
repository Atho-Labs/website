function supportsMotion() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function supportsPointerTilt() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function initHeaderState() {
  const header = document.querySelector(".site-header");
  if (!(header instanceof HTMLElement)) return;

  let queued = false;

  const apply = () => {
    queued = false;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  apply();

  window.addEventListener(
    "scroll",
    () => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(apply);
    },
    { passive: true }
  );
}

function initHeroTilt() {
  if (!supportsMotion() || !supportsPointerTilt()) return;

  const panels = Array.from(document.querySelectorAll(".hero-panel"));
  if (!panels.length) return;

  panels.forEach((panel) => {
    if (!(panel instanceof HTMLElement)) return;
    panel.classList.add("tech-tilt");

    let frame = 0;
    let rotX = 0;
    let rotY = 0;

    const paint = () => {
      frame = 0;
      panel.style.transform = `perspective(1100px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    };

    const queuePaint = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(paint);
    };

    const reset = () => {
      rotX = 0;
      rotY = 0;
      queuePaint();
    };

    panel.addEventListener("pointermove", (event) => {
      if (window.innerWidth < 980) {
        reset();
        return;
      }

      const rect = panel.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;

      rotY = Math.max(-4.5, Math.min(4.5, nx * 7.8));
      rotX = Math.max(-3.2, Math.min(3.2, -ny * 6.2));
      queuePaint();
    });

    panel.addEventListener("pointerleave", reset);
    panel.addEventListener("pointerup", reset);
    panel.addEventListener("pointercancel", reset);
  });
}

export function initTechPolish(options = {}) {
  const { liteEffects = false } = options;

  initHeaderState();
  if (!liteEffects) {
    initHeroTilt();
  }
}
