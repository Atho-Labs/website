import { siteContent } from "./site-data.js";

const iconPaths = {
  shield: "M12 2.4 4 5.6v5.7c0 5.2 3.4 9.9 8 11.3 4.6-1.4 8-6.1 8-11.3V5.6l-8-3.2Zm0 3.3 4.7 1.9v3.8c0 3.3-1.9 6.4-4.7 7.6-2.8-1.2-4.7-4.3-4.7-7.6V7.6L12 5.7Z",
  hash: "M10 2 4.8 22h2.4L12.4 2H10Zm6.4 0L11.2 22h2.4L18.8 2h-2.4ZM2 8.2v2.2h20V8.2H2Zm-1 5.4v2.2h20v-2.2H1Z",
  grid: "M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z",
  layers: "M12 3 2 8l10 5 10-5-10-5Zm-8.6 8.5L12 16l8.6-4.5L22 13l-10 5-10-5 1.4-1.5Zm0 4.6L12 20l8.6-3.9L22 17.6l-10 5-10-5 1.4-1.5Z",
  pickaxe: "M20.8 5.1c-2.4-2-6.1-2.3-8.8-.7l2.6 2.6-2.1 2.1-3-3-6.7 6.7 1.4 1.4 2.6-2.6 2.9 2.9-4.6 4.6 1.5 1.5 4.6-4.6 2.9 2.9-2.6 2.6 1.4 1.4 6.7-6.7-3-3 2.1-2.1 2.6 2.6c1.6-2.7 1.3-6.4-.7-8.8ZM10.3 12.2l-1.8-1.8 1.5-1.5 1.8 1.8-1.5 1.5Z",
  bolt: "M13 2 4 13h5l-1 9 9-11h-5l1-9Z",
  server: "M4 4h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 9h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2Zm3-6a1.2 1.2 0 1 0 0 2.4A1.2 1.2 0 0 0 7 7Zm0 9a1.2 1.2 0 1 0 0 2.4A1.2 1.2 0 0 0 7 16Z",
  globe: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 9h-3.1a15.4 15.4 0 0 0-1.6-5A8.1 8.1 0 0 1 18.9 11ZM12 4.1c.9 1.1 2.1 3.2 2.6 6H9.4c.5-2.8 1.7-4.9 2.6-6ZM5.8 6A15.4 15.4 0 0 0 4.2 11H1.1A8.1 8.1 0 0 1 5.8 6Zm0 12A8.1 8.1 0 0 1 1.1 13h3.1c.2 1.8.8 3.5 1.6 5ZM12 19.9c-.9-1.1-2.1-3.2-2.6-6h5.2c-.5 2.8-1.7 4.9-2.6 6Zm2.8-1.9a15.4 15.4 0 0 0 1.6-5h3.1a8.1 8.1 0 0 1-4.7 5Z",
  wallet: "M4 6.5A2.5 2.5 0 0 1 6.5 4H19a2 2 0 0 1 2 2v2.2H6.5A1.5 1.5 0 0 0 5 9.7v7.8A2.5 2.5 0 0 1 2.5 15V8A2 2 0 0 1 4 6.5Zm2.5 3.2H21v7.8a2.5 2.5 0 0 1-2.5 2.5h-12A1.5 1.5 0 0 1 5 18.5v-7.3A1.5 1.5 0 0 1 6.5 9.7Zm10.3 4.1a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Z",
  monitor: "M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-6l1.2 2H18v2H6v-2h2.8l1.2-2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2v10h16V6H4Z",
  spark: "M12 2.5 14 8l5.5.3-4.3 3.4 1.5 5.3L12 13.7 7.3 17l1.5-5.3-4.3-3.4L10 8l2-5.5Z",
  code: "M8.6 7 3.2 12l5.4 5 1.5-1.6L6.5 12l3.6-3.4L8.6 7Zm6.8 0-1.5 1.6 3.6 3.4-3.6 3.4 1.5 1.6 5.4-5-5.4-5ZM9.8 20h2.4l2-16H11.8l-2 16Z",
  database: "M12 3C7 3 3 4.6 3 6.5v11C3 19.4 7 21 12 21s9-1.6 9-3.5v-11C21 4.6 17 3 12 3Zm0 2c4.4 0 7 .9 7 1.5S16.4 8 12 8 5 7.1 5 6.5 7.6 5 12 5Zm0 6c4.4 0 7-.9 7-1.5v2.6c0 .6-2.6 1.5-7 1.5s-7-.9-7-1.5V9.5c0 .6 2.6 1.5 7 1.5Zm0 6c4.4 0 7-.9 7-1.5v2c0 .6-2.6 1.5-7 1.5s-7-.9-7-1.5v-2c0 .6 2.6 1.5 7 1.5Z",
  terminal: "M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13Zm3.2 2.3 3.1 3.1-3.1 3.1 1.4 1.4 4.5-4.5-4.5-4.5-1.4 1.4ZM12 15h5v-2h-5v2Z",
  package: "M12 2 3 6.5V17L12 22l9-5V6.5L12 2Zm0 2.3 6.4 3.2L12 10.7 5.6 7.5 12 4.3Zm-7 5.2 6 3v7.1l-6-3v-7.1Zm8 10.1v-7.1l6-3v7.1l-6 3Z"
};

const statusClassMap = {
  Live: "status-live",
  Building: "status-building",
  Pending: "status-placeholder",
  Published: "status-live",
  Planned: "status-planned",
  Docs: "status-docs",
  Editable: "status-editable",
  Placeholder: "status-placeholder",
  Now: "status-now",
  "In Progress": "status-progress",
  Next: "status-next"
};

function createIcon(name) {
  const wrap = document.createElement("span");
  wrap.className = name === "shield" || name === "hash" || name === "grid" || name === "layers" || name === "pickaxe" || name === "bolt"
    ? "feature-icon"
    : "ecosystem-icon";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", iconPaths[name] || iconPaths.spark);
  svg.appendChild(path);
  wrap.appendChild(svg);
  return wrap;
}

function createBadge(label) {
  const badge = document.createElement("span");
  badge.className = `status-badge ${statusClassMap[label] || "status-planned"}`;
  badge.textContent = label;
  return badge;
}

function renderHeroSignals() {
  const target = document.querySelector("#hero-signals");
  if (!(target instanceof HTMLElement)) {
    return;
  }

  siteContent.heroSignals.forEach((label) => {
    const chip = document.createElement("span");
    chip.className = "signal-chip";
    chip.textContent = label;
    target.appendChild(chip);
  });
}

function renderProtocolHighlights() {
  const target = document.querySelector("#protocol-highlights");
  if (!(target instanceof HTMLElement)) {
    return;
  }

  siteContent.protocolHighlights.forEach((item) => {
    const article = document.createElement("article");
    article.className = "card number-card";
    article.setAttribute("data-reveal", "");
    article.innerHTML = `
      <span class="eyebrow-number">${item.number}</span>
      <div>
        <h3>${item.title}</h3>
        <p>${item.copy}</p>
      </div>
    `;
    target.appendChild(article);
  });
}

function renderRuntimePills() {
  const target = document.querySelector("#runtime-pills");
  if (!(target instanceof HTMLElement)) {
    return;
  }

  siteContent.runtimePills.forEach((item) => {
    const card = document.createElement("article");
    card.className = "pill-card";
    card.setAttribute("data-reveal", "");
    card.innerHTML = `
      <span class="pill-label">${item.label}</span>
      <strong>${item.value}</strong>
      <p>${item.copy}</p>
    `;
    target.appendChild(card);
  });
}

function renderNetworkConstants() {
  const target = document.querySelector("#network-constants");
  if (!(target instanceof HTMLElement)) {
    return;
  }

  siteContent.networkConstants.forEach((item) => {
    const card = document.createElement("article");
    card.className = "network-constant-card";
    card.setAttribute("data-reveal", "");
    card.innerHTML = `
      <span>${item.name}</span>
      <strong class="stack-value">${item.value}</strong>
      <p><code>${item.detail}</code></p>
      <p>${item.copy}</p>
    `;
    target.appendChild(card);
  });
}

function renderStats() {
  const target = document.querySelector("#network-stats");
  if (!(target instanceof HTMLElement)) {
    return;
  }

  siteContent.stats.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card stat-card";
    card.setAttribute("data-reveal", "");
    card.dataset.statKey = item.key;
    card.innerHTML = `
      <span class="stat-meta ${statusClassMap[item.badge] || ""}">${item.badge}</span>
      <strong class="stat-value">${item.value}</strong>
      <h3>${item.label}</h3>
      <p>${item.detail}</p>
    `;
    target.appendChild(card);
  });
}

function renderCoreFeatures() {
  const target = document.querySelector("#core-features");
  if (!(target instanceof HTMLElement)) {
    return;
  }

  siteContent.coreFeatures.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card feature-card";
    card.setAttribute("data-reveal", "");
    card.appendChild(createIcon(item.icon));

    const content = document.createElement("div");
    content.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.copy}</p>
    `;
    card.appendChild(content);
    target.appendChild(card);
  });
}

function renderEcosystem() {
  const target = document.querySelector("#ecosystem-groups");
  if (!(target instanceof HTMLElement)) {
    return;
  }

  siteContent.ecosystemGroups.forEach((group) => {
    const wrapper = document.createElement("section");
    wrapper.className = "ecosystem-group";
    wrapper.setAttribute("data-reveal", "");

    const head = document.createElement("div");
    head.className = "ecosystem-group-head";
    head.innerHTML = `<h3>${group.title}</h3>`;
    wrapper.appendChild(head);

    const grid = document.createElement("div");
    grid.className = "ecosystem-grid";

    group.items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "ecosystem-card";

      const top = document.createElement("div");
      top.className = "ecosystem-card-top";

      const left = document.createElement("div");
      left.style.display = "flex";
      left.style.gap = "14px";
      left.style.alignItems = "flex-start";
      left.appendChild(createIcon(item.icon));

      const text = document.createElement("div");
      text.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.copy}</p>
      `;
      left.appendChild(text);
      top.appendChild(left);
      top.appendChild(createBadge(item.status));

      const action = document.createElement("a");
      action.className = "ecosystem-action";
      action.href = item.actionHref;
      action.textContent = item.actionLabel;
      if (item.external) {
        action.target = "_blank";
        action.rel = "noopener noreferrer";
      }

      card.appendChild(top);
      card.appendChild(action);
      grid.appendChild(card);
    });

    wrapper.appendChild(grid);
    target.appendChild(wrapper);
  });
}

function renderEconomics() {
  const target = document.querySelector("#economics-grid");
  if (!(target instanceof HTMLElement)) {
    return;
  }

  siteContent.economics.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card economics-card";
    card.setAttribute("data-reveal", "");
    card.innerHTML = `
      <span class="economics-badge ${statusClassMap[item.badge] || ""}">${item.badge}</span>
      <h3>${item.label}</h3>
      <strong class="economics-value">${item.value}</strong>
      <p>${item.note}</p>
    `;
    target.appendChild(card);
  });
}

function renderDeveloperPoints() {
  const target = document.querySelector("#developer-points");
  if (!(target instanceof HTMLElement)) {
    return;
  }

  siteContent.developerPoints.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    target.appendChild(li);
  });
}

function renderDeveloperCommands() {
  const target = document.querySelector("#developer-commands");
  if (!(target instanceof HTMLElement)) {
    return;
  }

  siteContent.developerCommands.forEach((item) => {
    if (item.kind === "comment") {
      const comment = document.createElement("div");
      comment.className = "terminal-comment";
      comment.textContent = item.text;
      target.appendChild(comment);
      return;
    }

    const line = document.createElement("div");
    line.className = "terminal-line";
    const prompt = document.createElement("span");
    prompt.className = "terminal-prompt";
    prompt.textContent = item.prompt;
    const command = document.createElement("span");
    command.className = "terminal-command";
    command.textContent = item.text;
    line.append(prompt, command);
    target.appendChild(line);
  });
}

function renderStatusCards() {
  const target = document.querySelector("#status-cards");
  if (!(target instanceof HTMLElement)) {
    return;
  }

  siteContent.statusCards.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card status-card";
    card.setAttribute("data-reveal", "");
    card.appendChild(createBadge(item.label));
    const body = document.createElement("div");
    body.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.copy}</p>
    `;
    card.appendChild(body);
    target.appendChild(card);
  });
}

function renderCommunityActions() {
  const target = document.querySelector("#community-actions");
  if (!(target instanceof HTMLElement)) {
    return;
  }

  siteContent.communityActions.forEach((item) => {
    const link = document.createElement("a");
    link.className = `button button-${item.variant}`;
    link.href = item.href;
    link.textContent = item.label;
    if (item.external) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    target.appendChild(link);
  });
}

function renderFooterColumns() {
  const target = document.querySelector("#footer-columns");
  if (!(target instanceof HTMLElement)) {
    return;
  }

  siteContent.footerColumns.forEach((column) => {
    const section = document.createElement("div");
    section.className = "footer-column";

    const title = document.createElement("span");
    title.className = "footer-column-title";
    title.textContent = column.title;
    section.appendChild(title);

    column.links.forEach((item) => {
      const link = document.createElement("a");
      link.href = item.href;
      const label = document.createElement("span");
      label.textContent = item.label;
      link.appendChild(label);
      if (item.badge) {
        link.classList.add("has-badge");
        const badge = createBadge(item.badge);
        badge.classList.add("footer-link-badge");
        link.appendChild(badge);
      }
      if (item.external) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      section.appendChild(link);
    });

    target.appendChild(section);
  });
}

function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  if (params.has("capture")) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px"
  });

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  items.forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < viewportHeight * 0.92) {
      item.classList.add("is-visible");
      return;
    }

    observer.observe(item);
  });
}

function initMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const panel = document.querySelector("[data-nav-panel]");
  if (!(toggle instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
    return;
  }

  const closeMenu = () => {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 980) {
      closeMenu();
    }
  });
}

function initYear() {
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}

async function hydrateStats() {
  const endpoint = document.body.dataset.statsEndpoint?.trim();
  if (!endpoint) {
    return;
  }

  try {
    const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
    if (!response.ok) {
      throw new Error(`Stats request failed with ${response.status}`);
    }

    const data = await response.json();
    siteContent.stats.forEach((item) => {
      if (!(item.key in data)) {
        return;
      }

      const card = document.querySelector(`[data-stat-key="${item.key}"]`);
      if (!(card instanceof HTMLElement)) {
        return;
      }

      const value = card.querySelector(".stat-value");
      const meta = card.querySelector(".stat-meta");
      const detail = card.querySelector("p");
      if (value) {
        value.textContent = String(data[item.key]);
      }
      if (meta) {
        meta.textContent = "Live";
        meta.className = "stat-meta status-live";
      }
      if (detail) {
        detail.textContent = "Live network feed.";
      }
    });
  } catch {
    /* keep placeholders when no public stats feed is connected */
  }
}

function renderPage() {
  renderHeroSignals();
  renderProtocolHighlights();
  renderRuntimePills();
  renderNetworkConstants();
  renderStats();
  renderCoreFeatures();
  renderEcosystem();
  renderEconomics();
  renderDeveloperPoints();
  renderDeveloperCommands();
  renderStatusCards();
  renderCommunityActions();
  renderFooterColumns();
  initMenu();
  initReveal();
  initYear();
  hydrateStats();
}

renderPage();
