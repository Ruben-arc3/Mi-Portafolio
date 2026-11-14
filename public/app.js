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

// ===== Fondo: lluvia de código + foco que sigue al cursor (versión ligera) =====
(() => {
  const aurora = document.querySelector(".aurora");
  let pending = 0;
  addEventListener("pointermove", (e) => {
    if (pending) return;
    pending = requestAnimationFrame(() => {
      pending = 0;
      aurora?.style.setProperty("--cx", `${e.clientX}px`);
      aurora?.style.setProperty("--cy", `${e.clientY}px`);
    });
  }, { passive: true });
  const cv = document.querySelector(".net");
  const ctx = cv?.getContext("2d");
  const weak = innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4 || navigator.connection?.saveData;
  if (!ctx || reduceMotion || weak) { cv?.remove(); return; }
  const chars = "01{}<>/=;$#*+()[]&|".split("");
  const size = 20;
  let w, h, cols, last = 0, accent = "", n = 0;
  const init = () => {
    w = cv.width = innerWidth; h = cv.height = innerHeight;
    cols = Array.from({ length: Math.ceil(w / size) }, () => ({ y: Math.random() * h, v: .8 + Math.random() * 2, row: -1 }));
    ctx.font = `${size}px ui-monospace, Menlo, Consolas, monospace`;
  };
  const frame = (t) => {
    requestAnimationFrame(frame);
    if (document.hidden || t - last < 45) return;
    last = t;
    if (!accent || ++n % 120 === 0) accent = getComputedStyle(root).getPropertyValue("--accent").trim() || "#5ab0ff";
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,.14)";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";
    cols.forEach((c, i) => {
      c.y += c.v * 1.6;
      const row = Math.floor(c.y / size);
      if (row !== c.row) {
        c.row = row;
        ctx.fillStyle = "#dcebff"; ctx.globalAlpha = .95;
        ctx.fillText(chars[(Math.random() * chars.length) | 0], i * size, c.y);
        ctx.fillStyle = accent; ctx.globalAlpha = .7;
        ctx.fillText(chars[(Math.random() * chars.length) | 0], i * size, c.y - size);
      }
      if (c.y > h + size * 8 && Math.random() > .97) { c.y = -size * Math.random() * 10; c.v = .8 + Math.random() * 2; }
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

// ===== Galerías de capturas por proyecto =====
(() => {
  const galleries = [...document.querySelectorAll("[data-gallery]")];
  if (!galleries.length) return;
  const pad = (n) => String(n).padStart(2, "0");
  const dialog = document.querySelector("#lightbox");
  const lbImg = dialog?.querySelector("img");
  const lbCaption = dialog?.querySelector(".lb-caption");
  const lbCount = dialog?.querySelector(".lb-count");
  const lbPrev = dialog?.querySelector(".lb-prev");
  const lbNext = dialog?.querySelector(".lb-next");
  let current = null;

  const EASE = "cubic-bezier(.2,.7,.2,1)";
  const pop = (el, text) => {
    el.textContent = text;
    if (!reduceMotion && el.animate) el.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 420, easing: EASE });
  };
  const paintLightbox = (dir = 0) => {
    const s = current.slides[current.index];
    lbImg.src = s.src; lbImg.alt = s.alt;
    lbCaption.textContent = `${current.root.dataset.title} · ${s.text}`;
    lbCount.textContent = `${pad(current.index + 1)} / ${pad(current.slides.length)}`;
    lbPrev.hidden = lbNext.hidden = current.slides.length < 2;
    if (!reduceMotion && lbImg.animate) {
      lbImg.animate(
        dir ? [{ opacity: 0, transform: `translateX(${dir * 60}px) scale(.97)` }, { opacity: 1, transform: "none" }]
            : [{ opacity: 0, transform: "scale(.94)" }, { opacity: 1, transform: "none" }],
        { duration: 460, easing: EASE });
    }
  };

  const setup = (root) => {
    const stage = root.querySelector(".g-stage");
    const stageImg = stage.querySelector("img");
    const caption = root.querySelector(".g-caption");
    const count = root.querySelector(".g-count");
    const strip = root.querySelector(".g-thumbs");
    const buttons = [...strip.querySelectorAll("button")];
    const slides = buttons.map((b) => {
      const img = b.querySelector("img");
      return { src: img.getAttribute("src"), alt: img.alt, text: b.dataset.caption || img.alt };
    });
    const g = { root, slides, index: 0 };

    let cur = stageImg;
    const slide = (s, dir) => {
      stage.querySelectorAll("img.g-out").forEach((n) => n.remove());
      const old = cur;
      const next = document.createElement("img");
      next.src = s.src; next.alt = s.alt;
      cur = next;
      stage.insertBefore(next, stage.querySelector(".g-expand"));
      if (reduceMotion || !next.animate) { old.remove(); return; }
      old.classList.add("g-out");
      old.setAttribute("aria-hidden", "true");
      const opts = { duration: 640, easing: EASE };
      next.animate([
        { transform: `translateX(${dir * 16}%) scale(1.1)`, opacity: 0, filter: "blur(8px)" },
        { transform: "none", opacity: 1, filter: "blur(0)" },
      ], { ...opts, fill: "backwards" });
      old.animate([
        { transform: "none", opacity: 1, filter: "blur(0)" },
        { transform: `translateX(${-dir * 16}%) scale(.94)`, opacity: 0, filter: "blur(8px)" },
      ], { ...opts, fill: "both" }).onfinish = () => old.remove();
    };

    g.show = (i, first = false, dir = 0) => {
      const prev = g.index;
      g.index = (i + slides.length) % slides.length;
      const s = slides[g.index];
      if (!dir) dir = g.index >= prev ? 1 : -1;
      if (first) { stageImg.src = s.src; stageImg.alt = s.alt; caption.textContent = s.text; count.textContent = `${pad(1)} / ${pad(slides.length)}`; }
      else if (g.index !== prev) {
        slide(s, dir);
        pop(caption, s.text);
        pop(count, `${pad(g.index + 1)} / ${pad(slides.length)}`);
      }
      buttons.forEach((b, k) => {
        if (k === g.index) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
      });
      const b = buttons[g.index];
      strip.scrollTo({ left: b.offsetLeft - (strip.clientWidth - b.offsetWidth) / 2, behavior: reduceMotion ? "auto" : "smooth" });
      if (current === g && dialog?.open) paintLightbox(dir);
    };

    buttons.forEach((b, k) => b.addEventListener("click", () => g.show(k)));
    strip.addEventListener("keydown", (e) => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      g.show(g.index + d, false, d);
      buttons[g.index].focus();
    });

    // Deslizar en pantallas táctiles
    let x0 = null, swiped = false;
    stage.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; swiped = false; }, { passive: true });
    stage.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 45) { swiped = true; g.show(g.index + (dx < 0 ? 1 : -1), false, dx < 0 ? 1 : -1); }
    });
    stage.addEventListener("click", () => {
      if (swiped) { swiped = false; return; }
      if (typeof dialog?.showModal !== "function") return;
      current = g;
      paintLightbox(0);
      dialog.showModal();
    });

    g.show(0, true);
  };

  galleries.forEach(setup);
  if (!dialog) return;
  const go = (d) => current?.show(current.index + d, false, d);
  lbPrev.addEventListener("click", () => go(-1));
  lbNext.addEventListener("click", () => go(1));
  dialog.querySelector(".lb-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => { if (!e.target.closest("img, .lb-btn, figcaption")) dialog.close(); });
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
  });
})();

// ===== Selector de proyectos (pestañas) =====
(() => {
  const root = document.querySelector("[data-projects]");
  if (!root) return;
  const bar = root.querySelector(".pv-bar");
  const strip = root.querySelector(".pv-tabs");
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
  const count = root.querySelector(".pv-count");
  const pad = (n) => String(n).padStart(2, "0");
  let cur = 0;
  const select = (i, focus = false) => {
    cur = (i + tabs.length) % tabs.length;
    tabs.forEach((t, k) => {
      t.setAttribute("aria-selected", String(k === cur));
      t.tabIndex = k === cur ? 0 : -1;
      panels[k].hidden = k !== cur;
    });
    panels[cur].classList.add("in");
    count.innerHTML = `<b>${pad(cur + 1)}</b> / ${pad(tabs.length)}`;
    const t = tabs[cur];
    strip.scrollTo({ left: t.offsetLeft - (strip.clientWidth - t.offsetWidth) / 2, behavior: reduceMotion ? "auto" : "smooth" });
    if (focus) t.focus();
  };
  tabs.forEach((t, k) => t.addEventListener("click", () => select(k)));
  strip.addEventListener("keydown", (e) => {
    const map = { ArrowRight: cur + 1, ArrowLeft: cur - 1, Home: 0, End: tabs.length - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    select(map[e.key], true);
  });
  root.querySelector(".pv-prev").addEventListener("click", () => select(cur - 1));
  root.querySelector(".pv-next").addEventListener("click", () => select(cur + 1));
  bar.hidden = false;
  select(0);
})();
