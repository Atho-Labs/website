function normalizePath(pathname = "") {
  if (!pathname || pathname === "/") return "/index.html";
  if (pathname.endsWith("/")) return `${pathname}index.html`;
  return pathname;
}

function setActiveLink(links, matcher) {
  let didSet = false;
  links.forEach((link) => {
    const active = Boolean(matcher(link));
    link.classList.toggle("is-active", active);
    if (active) didSet = true;
  });
  return didSet;
}

function updateActiveByLocation(links) {
  const current = new URL(window.location.href);
  const currentPath = normalizePath(current.pathname);
  const currentHash = current.hash || "";

  const matched = setActiveLink(links, (link) => {
    const href = link.getAttribute("href") || "";
    if (!href) return false;
    if (href.startsWith("#")) return href === currentHash;

    try {
      const target = new URL(href, current.href);
      const targetPath = normalizePath(target.pathname);
      if (target.hash) {
        return targetPath === currentPath && target.hash === currentHash;
      }
      return targetPath === currentPath;
    } catch {
      return false;
    }
  });

  if (!matched) {
    setActiveLink(links, (link) => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return false;
      return href === "#overview" || href === "#docs-overview";
    });
  }
}

export function initNavigation() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-nav-links]");
  const links = Array.from(document.querySelectorAll(".nav-link"));

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    links.forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  updateActiveByLocation(links);
  window.addEventListener("hashchange", () => updateActiveByLocation(links));

  const hashLinks = links.filter((link) => (link.getAttribute("href") || "").startsWith("#"));
  if (!hashLinks.length) return;

  const sections = Array.from(document.querySelectorAll("main section[id]"));
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        if (!id) return;

        const didSet = setActiveLink(hashLinks, (link) => link.getAttribute("href") === `#${id}`);
        if (!didSet) updateActiveByLocation(links);
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0
    }
  );

  sections.forEach((section) => observer.observe(section));
}
