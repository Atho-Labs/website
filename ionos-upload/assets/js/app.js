import { initNavigation } from "./modules/nav.js";
import { initReveal } from "./modules/reveal.js";
import { initYear } from "./modules/year.js";

function getPerformanceProfile() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = navigator;
  const cores = typeof nav.hardwareConcurrency === "number" ? nav.hardwareConcurrency : 8;
  const memory = typeof nav.deviceMemory === "number" ? nav.deviceMemory : 8;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  const saveData = Boolean(connection && connection.saveData);
  const liteEffects = reduceMotion || saveData || cores <= 4 || memory <= 4;

  return { liteEffects };
}

function deferVisualWork(task, liteEffects) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(task, { timeout: liteEffects ? 700 : 1200 });
    return;
  }

  window.setTimeout(task, liteEffects ? 120 : 220);
}

async function initRenderedSections() {
  const metricTarget = document.querySelector("#metric-grid");
  const featureTarget = document.querySelector("#feature-grid");
  const roadmapTarget = document.querySelector("#roadmap-grid");
  if (!metricTarget && !featureTarget && !roadmapTarget) {
    return;
  }

  const [renderModule, dataModule] = await Promise.all([
    import("./modules/render.js"),
    import("./data/site-data.js")
  ]);

  const { renderFeatureCards, renderRoadmapCards, renderMetricCards } = renderModule;
  const { featureCards, roadmapItems, metricCards } = dataModule;

  renderMetricCards(metricTarget, metricCards);
  renderFeatureCards(featureTarget, featureCards);
  renderRoadmapCards(roadmapTarget, roadmapItems);

  if (document.querySelector("[data-counter]")) {
    const { initCounters } = await import("./modules/counters.js");
    initCounters();
  }
}

async function initDocsCatalogIfNeeded() {
  if (!document.querySelector("[data-docs-catalog]")) {
    return;
  }

  const { initDocsCatalog } = await import("./modules/docs.js");
  initDocsCatalog();
}

async function initInteractionLayer(liteEffects) {
  const [{ initInteractionEffects }, { initTechPolish }] = await Promise.all([
    import("./modules/interaction-effects.js"),
    import("./modules/tech-polish.js")
  ]);

  initInteractionEffects({ liteEffects });
  initTechPolish({ liteEffects });
}

async function initHomeVisualLayer(liteEffects) {
  const [{ initBackgroundFlow }, { initByteOverlay }] = await Promise.all([
    import("./modules/background-flow.js"),
    import("./modules/byte-overlay.js")
  ]);

  initBackgroundFlow({ liteEffects });
  initByteOverlay({ liteEffects });
}

function boot() {
  const { liteEffects } = getPerformanceProfile();
  document.documentElement.classList.toggle("perf-lite", liteEffects);
  const isHomePage = document.body.classList.contains("home-page");

  initNavigation();
  initYear();

  Promise.all([initRenderedSections(), initDocsCatalogIfNeeded()])
    .catch(() => {})
    .finally(() => {
      initReveal();
    });

  deferVisualWork(() => {
    initInteractionLayer(liteEffects).catch(() => {});
  }, liteEffects);

  if (isHomePage) {
    deferVisualWork(() => {
      initHomeVisualLayer(liteEffects).catch(() => {});
    }, liteEffects);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
