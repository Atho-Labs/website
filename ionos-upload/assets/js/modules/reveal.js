export function initReveal(options = {}) {
  const { immediate = false } = options;
  const nodes = Array.from(document.querySelectorAll("[data-reveal], [data-stagger]"));
  if (!nodes.length) return;

  if (immediate || !("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const reveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        reveal.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  nodes.forEach((node) => reveal.observe(node));
}
