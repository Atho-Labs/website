export function renderFeatureCards(target, cards = []) {
  if (!target) return;
  target.innerHTML = cards
    .map(
      (card) => `
        <article class="card card-pad feature-card" data-reveal>
          <h3>${escapeHtml(card.title)}</h3>
          <p>${escapeHtml(card.body)}</p>
          <span class="feature-tag">${escapeHtml(card.tag)}</span>
        </article>
      `
    )
    .join("");
}

export function renderRoadmapCards(target, items = []) {
  if (!target) return;
  target.innerHTML = items
    .map(
      (item) => `
        <article class="card card-pad roadmap-card" data-reveal>
          <header class="roadmap-head">
            <h3 class="roadmap-phase">${escapeHtml(item.phase)}</h3>
            <span class="roadmap-state state-${escapeHtml(item.state)}">${escapeHtml(item.state)}</span>
          </header>
          <p>${escapeHtml(item.summary)}</p>
        </article>
      `
    )
    .join("");
}

export function renderMetricCards(target, metrics = []) {
  if (!target) return;
  target.innerHTML = metrics
    .map(
      (metric) => `
        <article class="card card-pad metric-card" data-reveal>
          <div class="metric-label">${escapeHtml(metric.label)}</div>
          <div class="metric-value" data-counter data-target="${Number(metric.value)}" data-suffix="${escapeHtml(
            metric.suffix || ""
          )}">0${escapeHtml(metric.suffix || "")}</div>
          <div class="metric-foot">${escapeHtml(metric.foot || "")}</div>
        </article>
      `
    )
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
