export function initReveal() {
  const nodes = Array.from(document.querySelectorAll("[data-reveal], [data-stagger]"));
  if (!nodes.length) return;

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
