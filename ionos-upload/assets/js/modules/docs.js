import { docsCatalog } from "../data/docs-catalog.js";

function normalizeEntry(entry) {
  const headings = Array.isArray(entry.headings) ? entry.headings.filter(Boolean) : [];
  const keywords = Array.isArray(entry.keywords) ? entry.keywords.filter(Boolean) : [];
  const blob = [
    entry.title || "",
    entry.category || "",
    entry.summary || "",
    entry.source || "",
    entry.type || "",
    ...keywords,
    ...headings
  ]
    .join(" ")
    .toLowerCase();
  return { ...entry, headings, keywords, blob };
}

function buildText(tag, className, value) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  el.textContent = value;
  return el;
}

function clipCopy(value, maxChars = 190) {
  const clean = String(value || "").replace(/\s+/g, " ").trim();
  if (clean.length <= maxChars) return clean;
  return `${clean.slice(0, maxChars - 1).trimEnd()}…`;
}

function buildDocCard(entry) {
  const article = document.createElement("article");
  article.className = "card card-pad doc-catalog-card";

  article.appendChild(buildText("h3", "doc-catalog-title", entry.title || "Untitled"));
  article.appendChild(buildText("p", "doc-catalog-summary", clipCopy(entry.summary || "")));

  const meta = document.createElement("div");
  meta.className = "doc-meta";
  meta.appendChild(buildText("span", "feature-tag", entry.category || "Reference"));
  meta.appendChild(buildText("span", "doc-meta-type", entry.type || "Doc"));
  article.appendChild(meta);

  if (entry.headings.length) {
    const chips = document.createElement("div");
    chips.className = "doc-chips";
    entry.headings.slice(0, 4).forEach((heading) => {
      chips.appendChild(buildText("span", "doc-chip", heading));
    });
    article.appendChild(chips);
  }

  const source = buildText("div", "doc-source", entry.source || "");
  article.appendChild(source);

  const actions = document.createElement("div");
  actions.className = "doc-actions";
  const openLink = document.createElement("a");
  openLink.className = "btn btn-primary btn-inline";
  openLink.href = entry.href || "#";
  openLink.target = "_blank";
  openLink.rel = "noopener noreferrer";
  openLink.textContent = entry.type === "External" ? "Open Reference" : "Open PDF";
  if (entry.type === "PDF") {
    openLink.download = "";
  }
  actions.appendChild(openLink);
  article.appendChild(actions);

  return article;
}

export function initDocsCatalog() {
  const container = document.querySelector("[data-docs-catalog]");
  if (!container) return;

  const searchInput = document.querySelector("[data-docs-search]");
  const searchButton = document.querySelector("[data-docs-search-btn]");
  const filtersHost = document.querySelector("[data-docs-filters]");
  const countHost = document.querySelector("[data-docs-count]");
  const emptyHost = document.querySelector("[data-docs-empty]");

  const items = docsCatalog.map(normalizeEntry);
  const defaultCategory = "All";
  const categories = [defaultCategory, ...new Set(items.map((item) => item.category || "Reference"))];

  let activeCategory = categories.includes(defaultCategory) ? defaultCategory : categories[0];
  let query = "";
  let searchRaf = 0;

  if (searchInput) {
    searchInput.value = "";
  }

  const renderFilters = () => {
    if (!filtersHost) return;
    filtersHost.innerHTML = "";
    categories.forEach((category) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `doc-filter${category === activeCategory ? " is-active" : ""}`;
      btn.textContent = category;
      btn.addEventListener("click", () => {
        activeCategory = category;
        renderFilters();
        renderResults();
      });
      filtersHost.appendChild(btn);
    });
  };

  const renderResults = () => {
    container.innerHTML = "";
    if (!categories.includes(activeCategory)) {
      activeCategory = defaultCategory;
      renderFilters();
    }
    const q = query.trim().toLowerCase();
    const queryTokens = q.split(/\s+/).filter(Boolean);

    const filtered = items.filter((item) => {
      if (activeCategory !== defaultCategory && item.category !== activeCategory) return false;
      if (!queryTokens.length) return true;
      return queryTokens.every((token) => item.blob.includes(token));
    });

    if (countHost) {
      countHost.textContent = `${filtered.length} document${filtered.length === 1 ? "" : "s"} shown`;
    }

    if (!filtered.length) {
      if (emptyHost) emptyHost.hidden = false;
      return;
    }

    if (emptyHost) emptyHost.hidden = true;
    const fragment = document.createDocumentFragment();
    filtered.forEach((entry) => fragment.appendChild(buildDocCard(entry)));
    container.appendChild(fragment);
  };

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      query = String(event.target?.value || "");
      if (searchRaf) {
        window.cancelAnimationFrame(searchRaf);
      }
      searchRaf = window.requestAnimationFrame(() => {
        searchRaf = 0;
        renderResults();
      });
    });
  }

  if (searchButton) {
    searchButton.addEventListener("click", () => {
      query = String(searchInput?.value || "");
      renderResults();
    });
  }

  renderFilters();
  renderResults();
}
