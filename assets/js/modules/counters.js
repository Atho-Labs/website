export function initCounters() {
  const counters = Array.from(document.querySelectorAll("[data-counter]"));
  if (!counters.length) return;

  const watcher = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        watcher.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => watcher.observe(counter));
}

function animateCounter(node) {
  const target = Number(node.getAttribute("data-target") || 0);
  const suffix = node.getAttribute("data-suffix") || "";
  const duration = 1400;
  const start = performance.now();

  const render = (ts) => {
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    node.textContent = `${formatNumber(value, target)}${suffix}`;
    if (progress < 1) requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
}

function formatNumber(value, target) {
  if (target >= 1000000) {
    return Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(value));
  }
  if (target >= 1000) {
    return Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(value));
  }
  if (target >= 1) {
    return Number(value).toFixed(target % 1 === 0 ? 0 : 2);
  }
  return Number(value).toFixed(2);
}
