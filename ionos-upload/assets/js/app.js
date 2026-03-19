import { featureCards, roadmapItems, metricCards } from "./data/site-data.js";
import { renderFeatureCards, renderRoadmapCards, renderMetricCards } from "./modules/render.js";
import { initNavigation } from "./modules/nav.js";
import { initReveal } from "./modules/reveal.js";
import { initCounters } from "./modules/counters.js";
import { initYear } from "./modules/year.js";
import { initDocsCatalog } from "./modules/docs.js";
import { initInteractionEffects } from "./modules/interaction-effects.js";

function boot() {
  renderMetricCards(document.querySelector("#metric-grid"), metricCards);
  renderFeatureCards(document.querySelector("#feature-grid"), featureCards);
  renderRoadmapCards(document.querySelector("#roadmap-grid"), roadmapItems);

  initNavigation();
  initReveal();
  initCounters();
  initYear();
  initDocsCatalog();
  initInteractionEffects();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
