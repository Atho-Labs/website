const SURFACE_SELECTOR = [
  ".card",
  ".btn",
  ".social-link",
  ".menu-toggle",
  ".section-eyebrow",
  ".nav-live-pill",
  ".docs-search-input"
].join(", ");

const INTERACTIVE_SELECTOR = "a, button, input, textarea, select, label, [role='button']";

export function initInteractionEffects() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  document.addEventListener(
    "pointerdown",
    (event) => {
      if (event.button !== 0) {
        return;
      }

      const target = event.target instanceof Element ? event.target : null;
      if (!target) {
        return;
      }

      const surface = target.closest(SURFACE_SELECTOR);
      if (surface instanceof HTMLElement) {
        spawnSurfaceRipple(surface, event.clientX, event.clientY);
        return;
      }

      const clickedInMain = target.closest("main");
      const clickedControl = target.closest(INTERACTIVE_SELECTOR);
      if (clickedInMain && !clickedControl) {
        spawnPagePulse(event.clientX, event.clientY);
      }
    },
    { passive: true }
  );
}

function spawnSurfaceRipple(surface, clientX, clientY) {
  const rect = surface.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return;
  }

  surface.classList.add("fx-host");

  const ripple = document.createElement("span");
  ripple.className = "surface-ripple";

  const size = Math.max(rect.width, rect.height) * 1.35;
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${clientX - rect.left}px`;
  ripple.style.top = `${clientY - rect.top}px`;

  surface.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  window.setTimeout(() => ripple.remove(), 850);
}

function spawnPagePulse(clientX, clientY) {
  const pulse = document.createElement("span");
  pulse.className = "site-click-pulse";
  pulse.style.left = `${clientX}px`;
  pulse.style.top = `${clientY}px`;

  document.body.appendChild(pulse);
  pulse.addEventListener("animationend", () => pulse.remove(), { once: true });
  window.setTimeout(() => pulse.remove(), 700);
}
