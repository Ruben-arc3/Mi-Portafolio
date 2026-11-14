"use strict";

const root = document.documentElement;

// Año del pie de página
const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

// Tema claro / oscuro (respeta el sistema y recuerda la elección)
const themeToggle = document.querySelector(".theme-toggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : prefersDark.matches);
const syncThemeLabel = () => {
  themeToggle?.setAttribute("aria-label", isDark() ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
};
themeToggle?.addEventListener("click", () => {
  const next = isDark() ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (error) { /* almacenamiento no disponible */ }
  syncThemeLabel();
});
prefersDark.addEventListener("change", syncThemeLabel);
syncThemeLabel();

// Menú móvil
const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu");
const setMenu = (open) => {
  menuToggle?.setAttribute("aria-expanded", String(open));
  menuToggle?.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  menu?.classList.toggle("is-open", open);
};
menuToggle?.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menuToggle.focus();
  }
});

// Marca en el menú la sección que se está leyendo
const links = [...document.querySelectorAll(".nav-links a")];
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        if (link.getAttribute("href") === `#${entry.target.id}`) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((link) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) observer.observe(target);
  });
}

// ===== Dinamismo =====
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Barra de progreso de lectura
const bar = document.querySelector(".progress");
const onScroll = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar?.style.setProperty("--p", max > 0 ? (scrollY / max).toFixed(3) : 0);
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Titular que cambia de palabra (efecto máquina de escribir)
const typed = document.querySelector("#typed");
const phrases = ["APIs con Node.js", "aplicaciones web", "proyectos de datos", "agentes de IA con RAG"];
if (typed && !reduceMotion) {
  let i = 0, n = 0, deleting = false;
  const tick = () => {
    const word = phrases[i];
    n += deleting ? -1 : 1;
    typed.textContent = word.slice(0, n);
    let delay = deleting ? 35 : 75;
    if (!deleting && n === word.length) { deleting = true; delay = 1600; }
    else if (deleting && n === 0) { deleting = false; i = (i + 1) % phrases.length; delay = 350; }
    setTimeout(tick, delay);
  };
  setTimeout(tick, 1800);
}

// Cinta de tecnologías: se duplica para el bucle continuo
const track = document.querySelector(".marquee-track");
if (track && !reduceMotion) {
  [...track.children].forEach((li) => {
    const copy = li.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    track.appendChild(copy);
  });
}

// Luz que sigue al cursor dentro de cada proyecto
document.querySelectorAll(".project").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

// Aparición suave de las secciones al hacer scroll
if (!reduceMotion && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".section h2, .section-intro, .project, .about > *, .more, .timeline > li").forEach((el) => {
    el.classList.add("js-reveal");
    io.observe(el);
  });
}

// ===== Fondo: lluvia de código + foco que sigue al cursor =====
(() => {
  addEventListener("pointermove", (e) => {
    root.style.setProperty("--cx", `${e.clientX}px`);
    root.style.setProperty("--cy", `${e.clientY}px`);
  }, { passive: true });
  const cv = document.querySelector(".net");
  const ctx = cv?.getContext("2d");
  if (!ctx || reduceMotion) { cv?.remove(); return; }
  const chars = "01{}<>/=;$#*+()[]&|".split("");
  let w, h, size, cols, last = 0;
  const init = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr;
    size = 18 * dpr;
    cols = Array.from({ length: Math.ceil(w / size) }, () => ({ y: Math.random() * h, v: (.8 + Math.random() * 2.2) * dpr, row: -1 }));
    ctx.font = `${size}px ui-monospace, Menlo, Consolas, monospace`;
  };
  const frame = (t) => {
    requestAnimationFrame(frame);
    if (document.hidden || t - last < 33) return;
    last = t;
    const accent = getComputedStyle(root).getPropertyValue("--accent").trim() || "#5ab0ff";
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,.09)";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";
    cols.forEach((c, i) => {
      c.y += c.v;
      const row = Math.floor(c.y / size);
      if (row !== c.row) {
        c.row = row;
        ctx.fillStyle = "#dcebff"; ctx.globalAlpha = .95;
        ctx.fillText(chars[(Math.random() * chars.length) | 0], i * size, c.y);
        ctx.fillStyle = accent; ctx.globalAlpha = .7;
        ctx.fillText(chars[(Math.random() * chars.length) | 0], i * size, c.y - size);
      }
      if (c.y > h + size * 8 && Math.random() > .97) { c.y = -size * Math.random() * 10; c.v = (.8 + Math.random() * 2.2) * (h / innerHeight > 1 ? 1.5 : 1); }
    });
    ctx.globalAlpha = 1;
  };
  init();
  addEventListener("resize", init);
  requestAnimationFrame(frame);
})();

// ===== GitHub en vivo =====
(async () => {
  const list = document.querySelector("#repos");
  if (!list) return;
  const user = "Ruben-arc3";
  const colors = { JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", PHP: "#8892bf", HTML: "#e34c26", CSS: "#a177d1", "Jupyter Notebook": "#DA5B0B", Java: "#b07219" };
  const ago = (iso) => {
    const days = Math.round((new Date(iso) - Date.now()) / 864e5);
    const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
    return Math.abs(days) < 30 ? rtf.format(days, "day") : Math.abs(days) < 365 ? rtf.format(Math.round(days / 30), "month") : rtf.format(Math.round(days / 365), "year");
  };
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
  try {
    const [u, r] = await Promise.all([
      fetch(`https://api.github.com/users/${user}`).then((x) => x.ok ? x.json() : Promise.reject()),
      fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=30`).then((x) => x.ok ? x.json() : Promise.reject()),
    ]);
    document.querySelector("#gh-stats").textContent = `${u.public_repos} repositorios · ${u.followers} seguidores`;
    r.filter((x) => !x.fork).slice(0, 6).forEach((x) => {
      const li = el("li", "repo"), a = el("a");
      a.href = x.html_url; a.target = "_blank"; a.rel = "noreferrer";
      const meta = el("div", "meta");
      if (x.language) { const l = el("span", "lang", x.language); l.style.setProperty("--c", colors[x.language] || ""); meta.append(l); }
      meta.append(el("span", "", `★ ${x.stargazers_count}`), el("span", "", `Actualizado ${ago(x.pushed_at)}`));
      a.append(el("h3", "", x.name), el("p", "", x.description || "Repositorio sin descripción todavía."), meta);
      li.append(a); list.append(li);
    });
  } catch {
    document.querySelector("#gh-stats").textContent = "No se pudieron cargar los datos ahora mismo.";
    const li = el("li", "note"), a = el("a", "", "Ver todos los repositorios en GitHub");
    a.href = `https://github.com/${user}?tab=repositories`; a.target = "_blank"; a.rel = "noreferrer";
    li.append(a); list.append(li);
  }
})();

// ===== Copiar correo =====
const copyBtn = document.querySelector("#copy-mail");
copyBtn?.addEventListener("click", async () => {
  const done = (ok) => {
    copyBtn.textContent = ok ? "¡Copiado!" : "Selecciona y copia";
    document.querySelector("#copy-status").textContent = ok ? "Correo copiado" : "";
    setTimeout(() => { copyBtn.textContent = "Copiar correo"; }, 2200);
  };
  try { await navigator.clipboard.writeText(copyBtn.dataset.email); done(true); } catch { done(false); }
});
