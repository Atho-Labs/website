import { docsAliasMap, docsNavGroups, docsSectionOrder, docsSections } from "./docs-content.js";

const docsSidebar = document.querySelector("#docs-sidebar");
const docsToggle = document.querySelector("[data-docs-toggle]");
const docsNav = document.querySelector("[data-docs-nav]");
const docsViewRoot = document.querySelector("[data-docs-view-root]");
const docsCurrentTitle = document.querySelector("[data-docs-current-title]");
const searchInput = document.querySelector("[data-docs-search]");
const resultsBox = document.querySelector("[data-docs-results]");
const mainShell = document.querySelector("#main");

let currentSectionId = "overview";

function normalizeHashKey(rawHash = "") {
  const trimmed = (rawHash || "").replace(/^#/, "").trim();
  if (!trimmed) {
    return "";
  }

  try {
    return decodeURIComponent(trimmed);
  } catch {
    return trimmed;
  }
}

function getSectionById(id) {
  return docsSections[id] || docsSections.overview;
}

function getSectionIndex(id) {
  return docsSectionOrder.indexOf(id);
}

function resolveTarget(rawHash = window.location.hash) {
  const key = normalizeHashKey(rawHash);
  if (!key) {
    return { sectionId: "overview", anchorId: "overview", hash: "#overview" };
  }

  const match = docsAliasMap[key];
  if (match) {
    return { ...match, hash: `#${key}` };
  }

  return { sectionId: "overview", anchorId: "overview", hash: "#overview" };
}

function stripHtml(html = "") {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function closeSidebar() {
  docsSidebar?.classList.remove("is-open");
  docsToggle?.setAttribute("aria-expanded", "false");
}

function buildSidebar() {
  if (!(docsNav instanceof HTMLElement)) {
    return;
  }

  docsNav.innerHTML = "";

  docsNavGroups.forEach((group) => {
    const label = document.createElement("strong");
    label.textContent = group.title;
    docsNav.appendChild(label);

    group.ids.forEach((id) => {
      const section = getSectionById(id);
      const link = document.createElement("a");
      link.href = `#${id}`;
      link.textContent = section.title;
      docsNav.appendChild(link);
    });
  });
}

function renderOverviewGrid() {
  const grid = docsViewRoot?.querySelector("[data-docs-overview-grid]");
  if (!(grid instanceof HTMLElement)) {
    return;
  }

  const groups = [
    {
      title: "Start Here",
      ids: ["what-is-atho", "design-philosophy", "falcon-512-and-quantum-security", "units-and-fees"]
    },
    {
      title: "Payments and Wallets",
      ids: ["wallets", "transactions", "wallet-transaction-pow", "mempool"]
    },
    {
      title: "Mining and Nodes",
      ids: ["mining", "nodes", "peer-network", "storage-and-sync"]
    },
    {
      title: "Security",
      ids: ["mainnet-vs-testnet", "security", "replay-protection"]
    },
    {
      title: "Developers",
      ids: ["developer-reference", "troubleshooting", "faq"]
    }
  ];

  grid.innerHTML = "";

  groups.forEach((group) => {
    const card = document.createElement("article");
    card.className = "docs-overview-card";

    const heading = document.createElement("h2");
    heading.textContent = group.title;
    card.appendChild(heading);

    group.ids.forEach((id) => {
      const section = getSectionById(id);
      const link = document.createElement("a");
      link.href = `#${id}`;
      link.textContent = section.title;
      card.appendChild(link);
    });

    grid.appendChild(card);
  });
}

function renderRelatedLinks(related = []) {
  if (!related.length) {
    return "";
  }

  return `
    <section class="docs-related">
      <h2>Related Sections</h2>
      <div class="docs-related-links">
        ${related.map((item) => `<a href="${item.href}">${item.label}</a>`).join("")}
      </div>
    </section>
  `;
}

function renderPrevNext(sectionId) {
  const index = getSectionIndex(sectionId);
  const prevId = docsSectionOrder[index - 1] || null;
  const nextId = docsSectionOrder[index + 1] || null;

  const linkMarkup = (id, direction) => {
    const isNext = direction === "next";
    const label = isNext ? "Next" : "Previous";
    const title = getSectionById(id).title;
    return `
      <a class="docs-prev-next-link ${isNext ? "is-next" : "is-prev"}" href="#${id}">
        ${isNext ? "" : `<span class="docs-prev-next-arrow" aria-hidden="true">&larr;</span>`}
        <span class="docs-prev-next-copy">
          <small>${label}</small>
          <strong>${title}</strong>
        </span>
        ${isNext ? `<span class="docs-prev-next-arrow" aria-hidden="true">&rarr;</span>` : ""}
      </a>
    `;
  };

  if (sectionId === "overview") {
    return `
      <nav class="docs-prev-next">
        ${linkMarkup("what-is-atho", "next")}
      </nav>
    `;
  }

  const prevLink = linkMarkup(prevId || "overview", "prev");
  const nextLink = linkMarkup(nextId || "overview", "next");

  return `<nav class="docs-prev-next">${prevLink}${nextLink}</nav>`;
}

function updateTitle(section) {
  document.title = `${section.title} | Atho Documentation`;
}

function updateActiveNav(sectionId) {
  if (!(docsNav instanceof HTMLElement)) {
    return;
  }

  docsNav.querySelectorAll("a").forEach((link) => {
    const active = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("is-active", active);
    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (docsCurrentTitle instanceof HTMLElement) {
    docsCurrentTitle.textContent = getSectionById(sectionId).title;
  }
}

function scrollView(targetId) {
  const headerOffset = 104;
  const target = targetId && targetId !== currentSectionId
    ? docsViewRoot?.querySelector(`#${CSS.escape(targetId)}`)
    : docsViewRoot;
  const node = target instanceof HTMLElement ? target : docsViewRoot;
  if (!(node instanceof HTMLElement)) {
    return;
  }

  const top = node.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

function highlightTarget(targetId) {
  if (!targetId) {
    return;
  }

  const target = docsViewRoot?.querySelector(`#${CSS.escape(targetId)}`);
  if (!(target instanceof HTMLElement)) {
    return;
  }

  target.classList.add("docs-search-hit");
  window.setTimeout(() => target.classList.remove("docs-search-hit"), 1400);
}

function renderSection(target = resolveTarget()) {
  if (!(docsViewRoot instanceof HTMLElement)) {
    return;
  }

  const section = getSectionById(target.sectionId);
  currentSectionId = target.sectionId;
  updateActiveNav(target.sectionId);
  updateTitle(section);

  docsViewRoot.innerHTML = `
    <article class="docs-view-card">
      <header class="docs-view-header">
        <span class="section-kicker">${section.eyebrow}</span>
        <h1 class="docs-view-title">${section.title}</h1>
        <p class="docs-view-summary">${section.summary}</p>
      </header>
      <div class="docs-view-content">
        ${section.content}
      </div>
      ${renderRelatedLinks(section.related)}
      ${renderPrevNext(target.sectionId)}
    </article>
  `;

  if (target.sectionId === "overview") {
    renderOverviewGrid();
  }

  requestAnimationFrame(() => {
    if (target.anchorId && target.anchorId !== target.sectionId) {
      scrollView(target.anchorId);
      highlightTarget(target.anchorId);
      return;
    }
    scrollView(target.sectionId);
  });
}

function buildSearchIndex() {
  const entries = [];

  docsSectionOrder.forEach((sectionId) => {
    const section = getSectionById(sectionId);
    const contentText = stripHtml(section.content || "");
    entries.push({
      type: "section",
      sectionId,
      anchorId: sectionId,
      label: section.title,
      meta: section.eyebrow,
      text: [section.title, section.summary, ...(section.keywords || []), contentText].join(" ").toLowerCase()
    });

    (section.topics || []).forEach((topic) => {
      entries.push({
        type: "topic",
        sectionId,
        anchorId: topic.id,
        label: topic.title,
        meta: section.title,
        text: [
          topic.title,
          ...(topic.aliases || []),
          section.title,
          section.summary,
          ...(section.keywords || []),
          contentText
        ].join(" ").toLowerCase()
      });
    });
  });

  return entries;
}

const searchIndex = buildSearchIndex();

function scoreSearchEntry(entry, query) {
  const label = (entry.label || "").toLowerCase();
  const meta = (entry.meta || "").toLowerCase();
  const text = (entry.text || "").toLowerCase();
  let score = 0;

  if (label === query) {
    score += 1000;
  }
  if (label.startsWith(query)) {
    score += 700;
  } else if (label.includes(query)) {
    score += 520;
  }
  if (meta.includes(query)) {
    score += 180;
  }
  if (entry.type === "topic") {
    score += 45;
  }

  const index = text.indexOf(query);
  if (index !== -1) {
    score += Math.max(0, 240 - index);
  }

  return score;
}

function renderSearchResults(query) {
  if (!(resultsBox instanceof HTMLElement)) {
    return;
  }

  const clean = query.trim().toLowerCase();
  resultsBox.innerHTML = "";

  if (!clean) {
    resultsBox.hidden = true;
    return;
  }

  const matches = searchIndex
    .filter((entry) => entry.text.includes(clean))
    .map((entry) => ({ ...entry, score: scoreSearchEntry(entry, clean) }))
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
    .reduce((acc, entry) => {
      const key = `${entry.sectionId}:${entry.anchorId}`;
      if (!acc.some((item) => `${item.sectionId}:${item.anchorId}` === key)) {
        acc.push(entry);
      }
      return acc;
    }, [])
    .slice(0, 8);

  resultsBox.hidden = false;

  if (!matches.length) {
    resultsBox.innerHTML = "<p>No matching section found.</p>";
    return;
  }

  matches.forEach((entry) => {
    const link = document.createElement("a");
    link.href = `#${entry.anchorId}`;
    link.innerHTML = `<strong>${entry.label}</strong><small>${entry.meta}</small>`;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      resultsBox.hidden = true;
      searchInput.value = "";
      if (window.location.hash === `#${entry.anchorId}`) {
        renderSection({ sectionId: entry.sectionId, anchorId: entry.anchorId, hash: `#${entry.anchorId}` });
      } else {
        window.location.hash = `#${entry.anchorId}`;
      }
      closeSidebar();
    });
    resultsBox.appendChild(link);
  });
}

function initSearch() {
  searchInput?.addEventListener("input", (event) => {
    renderSearchResults(event.target.value);
  });

  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      searchInput.value = "";
      resultsBox.hidden = true;
    }
  });
}

function initSidebarToggle() {
  docsToggle?.addEventListener("click", () => {
    const open = docsSidebar?.classList.toggle("is-open");
    docsToggle.setAttribute("aria-expanded", String(Boolean(open)));
  });
}

function initInternalLinks() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='#']");
    if (!(link instanceof HTMLAnchorElement)) {
      return;
    }

    const hash = link.getAttribute("href");
    if (!hash) {
      return;
    }

    const target = resolveTarget(hash);
    if (!target.sectionId) {
      return;
    }

    event.preventDefault();
    closeSidebar();
    if (window.location.hash === hash) {
      renderSection(target);
    } else {
      window.location.hash = hash;
    }
  });
}

function initHashRouting() {
  window.addEventListener("hashchange", () => {
    renderSection(resolveTarget());
  });
}

function initKeyboardNav() {
  document.addEventListener("keydown", (event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
      return;
    }

    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    const index = getSectionIndex(currentSectionId);
    if (index === -1) {
      return;
    }

    const targetId = event.key === "ArrowRight"
      ? docsSectionOrder[index + 1]
      : docsSectionOrder[index - 1];

    if (!targetId) {
      return;
    }

    event.preventDefault();
    window.location.hash = `#${targetId}`;
  });
}

function initDocs() {
  if (!(docsViewRoot instanceof HTMLElement)) {
    return;
  }

  buildSidebar();
  initSidebarToggle();
  initSearch();
  initInternalLinks();
  initHashRouting();
  initKeyboardNav();
  renderSection(resolveTarget());

  window.__AthoDocs = {
    sectionIds: docsSectionOrder.slice(),
    openSection(hash) {
      const target = resolveTarget(hash.startsWith("#") ? hash : `#${hash}`);
      renderSection(target);
    },
    getState() {
      return {
        currentSectionId,
        currentHash: window.location.hash || "#overview"
      };
    }
  };
}

initDocs();
