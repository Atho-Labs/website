import { initNavigation } from "./modules/nav.js";
import { initReveal } from "./modules/reveal.js";
import { initYear } from "./modules/year.js";

const FALLBACK_SOCIAL_LINKS = [
  {
    href: "https://github.com/Atho-Labs",
    label: "GitHub",
    title: "GitHub",
    external: true,
    path: "M12 2a10 10 0 0 0-3.16 19.49c.5.1.68-.21.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.14-1.11-1.45-1.11-1.45-.9-.62.07-.61.07-.61 1 .08 1.53 1.03 1.53 1.03.89 1.52 2.33 1.08 2.9.83.09-.64.35-1.08.64-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.1.39-2 1.03-2.71-.11-.26-.45-1.29.1-2.69 0 0 .84-.27 2.75 1.03a9.46 9.46 0 0 1 5 0c1.9-1.3 2.74-1.03 2.74-1.03.56 1.4.22 2.43.11 2.69.64.71 1.03 1.61 1.03 2.71 0 3.85-2.34 4.69-4.57 4.94.36.31.68.91.68 1.84v2.73c0 .27.18.59.69.48A10 10 0 0 0 12 2Z"
  },
  {
    href: "https://x.com/Atho_io",
    label: "X",
    title: "X",
    external: true,
    path: "M18.24 3h2.94l-6.43 7.35L22 21h-5.64l-4.42-5.78L6.88 21H3.94l6.88-7.86L2 3h5.78l4 5.28L18.24 3Zm-.99 16.3h1.56L6.93 4.62H5.26L17.25 19.3Z"
  },
  {
    href: "https://www.reddit.com/r/Atho/",
    label: "Reddit",
    title: "Reddit",
    external: true,
    path: "M20 11.5a2.5 2.5 0 0 0-4.6-1.4 11.1 11.1 0 0 0-2.8-.8l.6-2.8 2 .4a1.8 1.8 0 1 0 .2-1.2l-2.4-.5a.7.7 0 0 0-.8.5l-.7 3.3a11.8 11.8 0 0 0-3 .9A2.5 2.5 0 1 0 4 11.5c0 .4.1.8.3 1.1a4.9 4.9 0 0 0-.1.9c0 2.9 3.5 5.2 7.8 5.2s7.8-2.3 7.8-5.2c0-.3 0-.6-.1-.9.2-.3.3-.7.3-1.1Zm-11 2.9a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Zm6 0a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Zm-5 2.6a.7.7 0 0 1 1-.1 2 2 0 0 0 2.2 0 .7.7 0 0 1 .9 1 3.4 3.4 0 0 1-4 0 .7.7 0 0 1-.1-1Z"
  },
  {
    href: "https://www.instagram.com/atho.io",
    label: "Instagram",
    title: "Instagram",
    external: true,
    path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm11 1.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
  },
  {
    href: "https://discord.gg/W5fV4aGcUR",
    label: "Discord",
    title: "Discord",
    external: true,
    path: "M19.54 5.23A16.4 16.4 0 0 0 15.35 4l-.2.41a15.3 15.3 0 0 1 3.72 1.14 11.7 11.7 0 0 0-3.35-1.03 11.1 11.1 0 0 0-.5 1.02 14.4 14.4 0 0 0-6.04 0 10.7 10.7 0 0 0-.5-1.02 11.3 11.3 0 0 0-3.36 1.03 15.1 15.1 0 0 1 3.72-1.14L8.66 4a16.3 16.3 0 0 0-4.2 1.23C1.9 9.08 1.2 12.82 1.55 16.5a16.5 16.5 0 0 0 5.15 2.62l1.12-1.5c-.62-.22-1.21-.5-1.77-.83.15.11.31.22.47.32 1.52.9 3.27 1.37 5.48 1.37s3.96-.47 5.48-1.37c.16-.1.32-.2.47-.32-.56.33-1.15.61-1.77.83l1.12 1.5a16.4 16.4 0 0 0 5.15-2.62c.42-4.27-.72-7.97-2.91-11.27ZM8.86 14.23c-.96 0-1.74-.88-1.74-1.95s.77-1.95 1.74-1.95c.98 0 1.75.88 1.74 1.95 0 1.07-.77 1.95-1.74 1.95Zm6.28 0c-.96 0-1.74-.88-1.74-1.95s.77-1.95 1.74-1.95c.98 0 1.75.88 1.74 1.95 0 1.07-.77 1.95-1.74 1.95Z"
  },
  {
    href: "https://t.me/atho_labs",
    label: "Telegram",
    title: "Telegram",
    external: true,
    path: "M21.8 4.2a1.3 1.3 0 0 0-1.4-.2L3 10.8a1.2 1.2 0 0 0 .1 2.3l4.4 1.4 1.7 5.2a1.2 1.2 0 0 0 2 .5l2.4-2.5 4.5 3.3a1.2 1.2 0 0 0 1.9-.7L22 5.4a1.3 1.3 0 0 0-.2-1.2ZM9.2 14.8l-.8-2.3 8.5-5.3-7.7 7.6Z"
  },
  {
    href: "./contact.html",
    label: "Email",
    title: "Email",
    external: false,
    path: "M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Zm2 .46V17.5c0 .28.22.5.5.5h13a.5.5 0 0 0 .5-.5V6.96l-6.4 5.04a1 1 0 0 1-1.24 0L5 6.96Zm12.33-.96H6.67L12 10.2 17.33 6Z"
  }
];

let fallbackSocialTemplate = null;

function getPerformanceProfile(options = {}) {
  const { isHomePage = false, isWalletPage = false } = options;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = navigator;
  const cores = typeof nav.hardwareConcurrency === "number" ? nav.hardwareConcurrency : 8;
  const memory = typeof nav.deviceMemory === "number" ? nav.deviceMemory : 8;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  const saveData = Boolean(connection && connection.saveData);
  const effectiveType = String(connection?.effectiveType || "").toLowerCase();
  const slowerConnection = effectiveType === "slow-2g" || effectiveType === "2g" || effectiveType === "3g";
  const midRangeDevice = cores <= 6 || memory <= 6;
  const nonHomeLite = !isHomePage && !isWalletPage;
  const liteEffects = reduceMotion || saveData || slowerConnection || midRangeDevice || nonHomeLite;

  return { liteEffects };
}

function deferVisualWork(task, liteEffects) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(task, { timeout: liteEffects ? 700 : 1200 });
    return;
  }

  window.setTimeout(task, liteEffects ? 120 : 220);
}

function buildFallbackSocialLinks(className, ariaLabel) {
  const container = document.createElement("div");
  container.className = className;
  container.setAttribute("aria-label", ariaLabel);

  FALLBACK_SOCIAL_LINKS.forEach((item) => {
    const link = document.createElement("a");
    link.className = "social-link";
    link.href = item.href;
    link.setAttribute("aria-label", item.label);
    link.title = item.title;
    if (item.external) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", item.path);
    svg.appendChild(path);
    link.appendChild(svg);
    container.appendChild(link);
  });

  return container;
}

function cloneOrBuildSocialLinks(className, ariaLabel) {
  const source = document.querySelector(".header-right .social-links");
  if (source instanceof HTMLElement && source.querySelector(".social-link")) {
    const socialClone = source.cloneNode(true);
    if (socialClone instanceof HTMLElement) {
      socialClone.className = className;
      socialClone.setAttribute("aria-label", ariaLabel);
      return socialClone;
    }
  }

  if (!(fallbackSocialTemplate instanceof HTMLElement)) {
    fallbackSocialTemplate = buildFallbackSocialLinks("social-links", "Social media");
  }

  const fallbackClone = fallbackSocialTemplate.cloneNode(true);
  if (fallbackClone instanceof HTMLElement) {
    fallbackClone.className = className;
    fallbackClone.setAttribute("aria-label", ariaLabel);
    return fallbackClone;
  }

  return buildFallbackSocialLinks(className, ariaLabel);
}

function mountFooterSocialLinks() {
  const footer = document.querySelector(".site-footer");
  if (!(footer instanceof HTMLElement) || footer.querySelector(".footer-social-row")) {
    return;
  }

  const row = document.createElement("div");
  row.className = "wrap footer-social-row";

  row.appendChild(cloneOrBuildSocialLinks("footer-social-links", "Footer social media"));
  footer.appendChild(row);
}

function mountHomeSocialLinks(isHomePage) {
  if (!isHomePage) {
    return;
  }

  const slot = document.querySelector("[data-home-social-slot]");
  if (!(slot instanceof HTMLElement) || slot.querySelector(".home-social-links-row")) {
    return;
  }

  slot.appendChild(cloneOrBuildSocialLinks("footer-social-links home-social-links-row", "Home social media"));
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

async function initInteractionLayer({ liteEffects, enableClickFx }) {
  const { initTechPolish } = await import("./modules/tech-polish.js");
  initTechPolish({ liteEffects });

  if (!liteEffects && enableClickFx) {
    const { initInteractionEffects } = await import("./modules/interaction-effects.js");
    initInteractionEffects({ liteEffects });
  }
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
  const isHomePage = document.body.classList.contains("home-page");
  const isWalletPage = document.body.classList.contains("wallet-page");
  const { liteEffects } = getPerformanceProfile({ isHomePage, isWalletPage });
  document.documentElement.classList.toggle("perf-lite", liteEffects);

  initNavigation();
  initYear();

  Promise.all([initRenderedSections(), initDocsCatalogIfNeeded()])
    .catch(() => {})
    .finally(() => {
      initReveal({ immediate: liteEffects });
    });

  deferVisualWork(() => {
    mountFooterSocialLinks();
    mountHomeSocialLinks(isHomePage);
  }, liteEffects);

  deferVisualWork(() => {
    initInteractionLayer({ liteEffects, enableClickFx: isHomePage }).catch(() => {});
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
