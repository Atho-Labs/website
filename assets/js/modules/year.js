export function initYear() {
  const node = document.querySelector("[data-year]");
  if (!node) return;
  node.textContent = String(new Date().getFullYear());
}
