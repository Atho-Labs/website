function normalizePath(pathname = "") {
  if (!pathname || pathname === "/") return "/home.html";
  if (pathname.endsWith("/")) return `${pathname}home.html`;
  if (pathname.endsWith("/index.html")) return pathname.replace(/\/index\.html$/, "/home.html");
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
    const defaultHashes = new Set(["#overview", "#docs-overview", "#contact-overview", "#wallet-overview"]);
    setActiveLink(links, (link) => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return false;
      return defaultHashes.has(href);
    });
  }
}

export function initNavigation() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const drawer = document.querySelector("[data-global-drawer]");
  const pageNav = document.querySelector("[data-nav-links]");
  const links = Array.from(document.querySelectorAll(".nav-link"));
  const globalLinks = Array.from(document.querySelectorAll(".global-nav-link"));

  if (toggle && drawer) {
    const closeDrawer = () => {
      drawer.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const open = !drawer.classList.contains("is-open");
      drawer.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });

    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      if (!drawer.classList.contains("is-open")) return;
      if (drawer.contains(event.target) || toggle.contains(event.target)) return;
      closeDrawer();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      closeDrawer();
    });

    globalLinks.forEach((link) => {
      link.addEventListener("click", () => closeDrawer());
    });
  }

  if (pageNav instanceof HTMLElement && pageNav.scrollWidth > pageNav.clientWidth) {
    pageNav.classList.add("is-scrollable");
  }

  updateActiveByLocation(links);
  window.addEventListener("hashchange", () => updateActiveByLocation(links));

  const currentPath = normalizePath(window.location.pathname);
  setActiveLink(globalLinks, (link) => {
    const href = link.getAttribute("href") || "";
    if (!href) return false;
    try {
      const target = new URL(href, window.location.href);
      return normalizePath(target.pathname) === currentPath;
    } catch {
      return false;
    }
  });

  const hashLinks = links.filter((link) => (link.getAttribute("href") || "").startsWith("#"));
  if (!hashLinks.length) return;

  const scrollToTarget = (id) => {
    const target = document.getElementById(id);
    if (!(target instanceof HTMLElement)) return;
    const header = document.querySelector(".site-header");
    const headerHeight = header instanceof HTMLElement ? header.offsetHeight : 0;
    const visualLead = Math.max(26, Math.round(window.innerHeight * 0.18));
    const top = window.scrollY + target.getBoundingClientRect().top - headerHeight - visualLead;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  hashLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#") || href.length < 2) return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!(target instanceof HTMLElement)) return;
      event.preventDefault();
      history.replaceState(null, "", href);
      updateActiveByLocation(links);
      scrollToTarget(id);
    });
  });

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

  if (window.location.hash && window.location.hash.length > 1) {
    window.setTimeout(() => {
      scrollToTarget(window.location.hash.slice(1));
    }, 80);
  }
}
