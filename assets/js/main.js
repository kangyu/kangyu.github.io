(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const PUBS = window.PUBS || [];
  const root = document.documentElement;
  const ZH = root.lang.startsWith("zh");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const T = ZH ? {
    all: "全部", showing: (n, m) => `显示 ${n} / ${m} 篇`, none: "没有匹配的论文。",
    led: "主导", first: "第一作者", cites: (n) => `引用 ${n}`
  } : {
    all: "All", showing: (n, m) => `Showing ${n} of ${m} papers`, none: "No papers match.",
    led: "Led", first: "First author", cites: (n) => `${n} citations`
  };
  const AREAS = {
    coding: ZH ? "编程智能体与代码大模型" : "Coding Agents & Code LLMs",
    env: ZH ? "环境、数据与评测" : "Environments, Data & Evaluation",
    agent: ZH ? "智能体系统与训练" : "Agent Systems & Training",
    gui: ZH ? "GUI 与 Computer-Use 智能体" : "GUI & Computer-Use Agents",
    aiops: ZH ? "AIOps 与云可靠性" : "AIOps & Cloud Reliability",
    early: ZH ? "早期工作" : "Early work"
  };
  const AREA_ORDER = ["coding", "env", "agent", "gui", "aiops", "early"];
  const color = (a) => `var(--c-${a})`;

  /* ---------- theme ---------- */
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) { /* storage unavailable */ }
  if (saved === "light" || saved === "dark") root.dataset.theme = saved;
  else if (window.matchMedia("(prefers-color-scheme: light)").matches) root.dataset.theme = "light";
  $("#themeBtn").addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) { /* ignore */ }
  });

  /* ---------- nav ---------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const menuBtn = $("#menuBtn"), navLinks = $("#navLinks");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
    $$("a", navLinks).forEach((a) => a.addEventListener("click", () => navLinks.classList.remove("open")));
    const secObs = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          $$("a", navLinks).forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach((s) => secObs.observe(s));
  }

  /* ---------- reveal & counters ---------- */
  const countUp = (el) => {
    const end = +el.dataset.count, suf = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = end.toLocaleString() + suf; return; }
    const t0 = performance.now(), dur = 1600;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - k, 3)));
      el.textContent = v.toLocaleString() + suf;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const revObs = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      $$("[data-count]", e.target).forEach(countUp);
      revObs.unobserve(e.target);
    });
  }, { threshold: 0.12 });

  /* ---------- publications ---------- */
  // #pubList[data-mode="selected"] renders the "sel" subset (home page);
  // otherwise the full list with search and filters (publications page).
  const list = $("#pubList");
  if (list) {
    const selectedMode = list.dataset.mode === "selected";
    const TOP = /NeurIPS|ICLR|ICML|ACL|EMNLP|NAACL|ICSE 20|ESEC\/FSE|FSE 2016|EuroSys|ATC|WWW|ICDE|TMLR/;
    const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const fmtAuthors = (au) => {
      const names = au.split(", ");
      const i = names.indexOf("Yu Kang");
      let shown = names;
      if (names.length > 9) {
        const keep = new Set([0, 1, 2, i, names.length - 1]);
        shown = [];
        names.forEach((n, k) => {
          if (keep.has(k)) shown.push(n);
          else if (shown[shown.length - 1] !== "…") shown.push("…");
        });
      }
      return shown.map((n) => (n === "Yu Kang" ? "<b>Yu Kang</b>" : esc(n))).join(", ");
    };
    const render = (items) => {
      if (!items.length) { list.innerHTML = `<p class="empty">${T.none}</p>`; return; }
      const byYear = {};
      items.forEach((p) => (byYear[p.y] = byYear[p.y] || []).push(p));
      list.innerHTML = Object.keys(byYear).sort((a, b) => b - a).map((y) =>
        `<div class="pub-year"><h3>${y}</h3><div>${byYear[y].sort((a, b) => (b.c || 0) - (a.c || 0)).map((p) => `
          <div class="pub" style="--c:${color(p.a)}">
            <div class="pub-t"><a href="${p.l}" target="_blank" rel="noopener">${esc(p.t)}</a></div>
            <div class="pub-au">${fmtAuthors(p.au)}</div>
            <div class="pub-m">
              <span class="venue${TOP.test(p.v) ? " top" : ""}">${esc(p.v)}</span>
              ${p.tg.includes("lead") ? `<span class="badge lead">${T.led}</span>` : ""}
              ${p.tg.includes("first") ? `<span class="badge first">${T.first}</span>` : ""}
              ${p.c ? `<span class="cites">${T.cites(p.c)}</span>` : ""}
            </div>
          </div>`).join("")}</div></div>`).join("");
    };

    if (selectedMode) {
      render(PUBS.filter((p) => p.tg.includes("sel")));
      $$("[data-pub-total]").forEach((el) => { el.textContent = PUBS.length; });
    } else {
      let areaFilter = "all";
      const filters = $("#pubFilters");
      const counts = {};
      PUBS.forEach((p) => { counts[p.a] = (counts[p.a] || 0) + 1; });
      filters.innerHTML = `<button class="on" data-a="all">${T.all} <span class="cites">${PUBS.length}</span></button>` +
        AREA_ORDER.map((k) => `<button data-a="${k}"><i style="background:${color(k)}"></i>${AREAS[k]} <span class="cites">${counts[k] || 0}</span></button>`).join("");
      const renderFull = () => {
        const q = $("#pubSearch").value.trim().toLowerCase();
        const sel = $("#pubSelected").checked;
        const items = PUBS.filter((p) =>
          (areaFilter === "all" || p.a === areaFilter) &&
          (!sel || p.tg.includes("sel")) &&
          (!q || (p.t + " " + p.v + " " + p.au).toLowerCase().includes(q)));
        $("#pubCount").textContent = T.showing(items.length, PUBS.length);
        render(items);
      };
      filters.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        areaFilter = b.dataset.a;
        $$("button", filters).forEach((x) => x.classList.toggle("on", x === b));
        renderFull();
      });
      $("#pubSearch").addEventListener("input", renderFull);
      $("#pubSelected").addEventListener("change", renderFull);
      renderFull();
    }
  }

  $("#yr").textContent = new Date().getFullYear();
  $$(".reveal:not(.in)").forEach((el) => revObs.observe(el));

  /* ---------- background network ---------- */
  (function net() {
    const cv = $("#net");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    let w, h, pts = [], dpr = Math.min(window.devicePixelRatio || 1, 2), mouse = { x: -1e4, y: -1e4 };
    const resize = () => {
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, (w * h) / 16000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25 }));
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    const draw = () => {
      const rgb = getComputedStyle(root).getPropertyValue("--net").trim();
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        if (!reduceMotion) { p.x += p.vx; p.y += p.vy; }
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (dm < 140) { p.x += (p.x - mouse.x) / dm * .6; p.y += (p.y - mouse.y) / dm * .6; }
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(${rgb},${(1 - d / 130) * .35})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        ctx.fillStyle = `rgba(${rgb},.7)`;
        ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, 1.6, 0, 7); ctx.fill();
      }
      if (!reduceMotion) requestAnimationFrame(draw);
    };
    draw();
  })();
})();
