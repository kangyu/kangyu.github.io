(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const PUBS = window.PUBS || [];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const AREAS = {
    coding: {
      name: "AI for Code & SE Agents",
      desc: "Agents that resolve issues, translate code across languages, understand whole repositories, and repair dependency breakage.",
      keys: ["ExeCoder", "Skeleton-Guided", "RPG-Encoder", "SWE-Edit", "DepRepair", "IaC-Eval"],
      icon: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>'
    },
    env: {
      name: "Benchmarks & Environments",
      desc: "Live, contamination-resistant evaluation, plus automatic build-and-test environments for agentic RL at scale.",
      keys: ["SWE-bench-Live", "RepoLaunch", "DI-Bench", "TestExplora", "Change2Task", "ORACLE-SWE"],
      icon: '<path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 12l9 4 9-4M3 17l9 4 9-4"/>'
    },
    gui: {
      name: "Computer-Use & GUI Agents",
      desc: "Desktop AgentOS, multi-device agent systems, datasets, and a widely cited survey of LLM-brained GUI agents.",
      keys: ["UFO", "UFO²", "UFO³", "GUI Survey", "API vs GUI", "GUI-360°"],
      icon: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M13 9l3 3-3 1-1 3-2-6 6 2"/>'
    },
    agent: {
      name: "Agent Systems & LLMs",
      desc: "Code-first agent frameworks, automatic debugging of multi-agent systems, and targeted capability training.",
      keys: ["TaskWeaver", "DoVer", "WarriorMath", "AllHands"],
      icon: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M11 7.2 6.2 15.8M13 7.2l4.8 8.6M7.5 18h9"/>'
    },
    aiops: {
      name: "AIOps & Cloud Reliability",
      desc: "Incident detection, triage, RCA, logging, and monitoring. Built and deployed for Azure and Microsoft 365.",
      keys: ["RCACopilot", "Xpert", "UniLog", "UniParser", "Oasis", "MonitorAssistant"],
      icon: '<path d="M7 18a4.5 4.5 0 0 1-.5-9A6 6 0 0 1 18 9.5a4 4 0 0 1-.5 8.5z"/><path d="m10 13 2 2 3-4"/>'
    },
    early: {
      name: "Foundations (PhD @ CUHK)",
      desc: "Mobile app performance diagnosis, cloud service deployment and QoS prediction, and program obfuscation.",
      keys: ["DiagDroid", "Poor-responsive UI", "Cloud redeployment", "QoS prediction", "Obfuscation"],
      icon: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>'
    }
  };
  const AREA_ORDER = ["coding", "env", "gui", "agent", "aiops", "early"];
  const color = (a) => `var(--c-${a})`;

  /* ---------- theme ---------- */
  const root = document.documentElement;
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
  $("#menuBtn").addEventListener("click", () => $("#navLinks").classList.toggle("open"));
  $$("#navLinks a").forEach((a) => a.addEventListener("click", () => $("#navLinks").classList.remove("open")));
  const secObs = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (e.isIntersecting) {
        $$("#navLinks a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach((s) => secObs.observe(s));

  /* ---------- rotator ---------- */
  const phrases = [
    "LLM agents for software engineering",
    "live benchmarks for coding agents",
    "executable environments for agentic RL",
    "desktop & GUI agents",
    "AIOps for hyperscale cloud"
  ];
  const rot = $("#rotator");
  if (!reduceMotion) {
    let pi = 0, ci = phrases[0].length, dir = -1;
    const tick = () => {
      const p = phrases[pi];
      ci += dir;
      rot.textContent = p.slice(0, ci);
      let delay = dir > 0 ? 55 : 28;
      if (dir < 0 && ci === 0) { pi = (pi + 1) % phrases.length; dir = 1; delay = 300; }
      else if (dir > 0 && ci === phrases[pi].length) { dir = -1; delay = 2200; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 2600);
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
  const observeReveal = () => $$(".reveal:not(.in)").forEach((el) => revObs.observe(el));

  /* ---------- research areas ---------- */
  const counts = {};
  PUBS.forEach((p) => { counts[p.a] = (counts[p.a] || 0) + 1; });
  $("#areas").innerHTML = AREA_ORDER.map((k) => {
    const a = AREAS[k];
    return `<article class="area reveal" style="--c:${color(k)}">
      <div class="area-top"><div class="area-ico"><svg viewBox="0 0 24 24">${a.icon}</svg></div>
      <div class="area-n">${counts[k] || 0}<small>PAPERS</small></div></div>
      <h3>${a.name}</h3><p>${a.desc}</p>
      <div class="keys">${a.keys.map((x) => `<span>${x}</span>`).join("")}</div></article>`;
  }).join("");

  /* ---------- research river (bubble timeline) ---------- */
  (function river() {
    const svg = $("#riverSvg"), tip = $("#riverTip"), box = $(".river");
    const years = [];
    for (let y = 2011; y <= 2026; y++) years.push(y);
    const W = 1100, L = 190, R = 20, T = 14, rowH = 46, H = T + AREA_ORDER.length * rowH + 30;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const x = (y) => L + (y - years[0]) * ((W - L - R) / (years.length - 1));
    const cell = {};
    PUBS.forEach((p) => { const k = p.a + p.y; (cell[k] = cell[k] || []).push(p); });
    const max = Math.max(...Object.values(cell).map((v) => v.length));
    let s = "";
    years.forEach((y) => {
      s += `<line class="grid" x1="${x(y)}" x2="${x(y)}" y1="${T}" y2="${H - 26}" stroke-dasharray="2 4"/>`;
      s += `<text x="${x(y)}" y="${H - 8}" text-anchor="middle">${String(y).slice(2).padStart(2, "0")}</text>`;
    });
    AREA_ORDER.forEach((a, i) => {
      const cy = T + i * rowH + rowH / 2;
      s += `<text class="lbl" x="0" y="${cy + 4}">${AREAS[a].name.replace(" (PhD @ CUHK)", "")}</text>`;
      s += `<line x1="${L - 10}" x2="${W - R + 10}" y1="${cy}" y2="${cy}" stroke="${color(a)}" stroke-opacity=".25" stroke-width="2"/>`;
      years.forEach((y) => {
        const v = cell[a + y];
        if (!v) return;
        const r = 5 + 13 * Math.sqrt(v.length / max);
        s += `<circle data-k="${a + y}" cx="${x(y)}" cy="${cy}" r="${r}" fill="${color(a)}" opacity=".78"/>`;
      });
    });
    svg.innerHTML = s;
    const esc = (t) => t.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
    svg.addEventListener("mousemove", (e) => {
      const c = e.target.closest("circle");
      if (!c) { tip.hidden = true; return; }
      const v = cell[c.dataset.k], a = v[0].a;
      tip.innerHTML = `<b>${AREAS[a].name} · ${v[0].y} · ${v.length} paper${v.length > 1 ? "s" : ""}</b><ul>${v.slice(0, 6).map((p) => `<li>${esc(p.t.split(":")[0])}</li>`).join("")}${v.length > 6 ? `<li>+${v.length - 6} more</li>` : ""}</ul>`;
      tip.hidden = false;
      const br = box.getBoundingClientRect();
      let lx = e.clientX - br.left + 14, ly = e.clientY - br.top + 14;
      if (lx + 340 > br.width) lx = e.clientX - br.left - 350;
      tip.style.left = Math.max(8, lx) + "px";
      tip.style.top = ly + "px";
    });
    svg.addEventListener("mouseleave", () => { tip.hidden = true; });
  })();

  /* ---------- project tabs ---------- */
  $("#projTabs").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    $$("#projTabs button").forEach((x) => x.classList.toggle("on", x === b));
    const f = b.dataset.f;
    $$("#projects-grid .proj").forEach((p) => {
      const show = f === "all" || p.dataset.g === f;
      p.classList.toggle("hide", !show);
      if (show) p.classList.add("in");
    });
  });

  /* ---------- publications ---------- */
  const TOP = /NeurIPS|ICLR|ICML|ACL|EMNLP|NAACL|ICSE 20|ESEC\/FSE|FSE 2016|EuroSys|ATC|WWW|ICDE|TMLR/;
  let areaFilter = "all";
  const filters = $("#pubFilters");
  filters.innerHTML = `<button class="on" data-a="all">All <span class="cites">${PUBS.length}</span></button>` +
    AREA_ORDER.map((k) => `<button data-a="${k}"><i style="background:${color(k)}"></i>${AREAS[k].name.split(" (")[0]}</button>`).join("");
  filters.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    areaFilter = b.dataset.a;
    $$("button", filters).forEach((x) => x.classList.toggle("on", x === b));
    renderPubs();
  });
  const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmtAuthors = (au) => {
    const list = au.split(", ");
    const i = list.indexOf("Yu Kang");
    let shown = list;
    if (list.length > 9) {
      const keep = new Set([0, 1, 2, i, list.length - 1]);
      shown = [];
      list.forEach((n, k) => {
        if (keep.has(k)) shown.push(n);
        else if (shown[shown.length - 1] !== "…") shown.push("…");
      });
    }
    return shown.map((n) => (n === "Yu Kang" ? "<b>Yu Kang</b>" : esc(n))).join(", ");
  };
  const renderPubs = () => {
    const q = $("#pubSearch").value.trim().toLowerCase();
    const sel = $("#pubSelected").checked;
    const list = PUBS.filter((p) =>
      (areaFilter === "all" || p.a === areaFilter) &&
      (!sel || p.tg.some((t) => t === "featured" || t === "lead" || t === "first")) &&
      (!q || (p.t + " " + p.v + " " + p.au).toLowerCase().includes(q)));
    $("#pubCount").textContent = `Showing ${list.length} of ${PUBS.length} papers`;
    if (!list.length) { $("#pubList").innerHTML = '<p class="empty">No papers match.</p>'; return; }
    const byYear = {};
    list.forEach((p) => (byYear[p.y] = byYear[p.y] || []).push(p));
    $("#pubList").innerHTML = Object.keys(byYear).sort((a, b) => b - a).map((y) =>
      `<div class="pub-year"><h3>${y}</h3><div>${byYear[y].map((p) => `
        <div class="pub" style="--c:${color(p.a)}">
          <div class="pub-t"><a href="${p.l}" target="_blank" rel="noopener">${esc(p.t)}</a></div>
          <div class="pub-au">${fmtAuthors(p.au)}</div>
          <div class="pub-m">
            <span class="venue${TOP.test(p.v) ? " top" : ""}">${esc(p.v)}</span>
            ${p.tg.includes("lead") ? '<span class="badge lead">Led</span>' : ""}
            ${p.tg.includes("first") ? '<span class="badge first">First author</span>' : ""}
            ${p.c ? `<span class="cites">${p.c} citations</span>` : ""}
          </div>
        </div>`).join("")}</div></div>`).join("");
  };
  $$("a[data-area]").forEach((a) => a.addEventListener("click", () => {
    const b = $(`#pubFilters button[data-a="${a.dataset.area}"]`);
    if (b) b.click();
  }));
  $("#pubSearch").addEventListener("input", renderPubs);
  $("#pubSelected").addEventListener("change", renderPubs);
  renderPubs();

  $("#yr").textContent = new Date().getFullYear();
  observeReveal();

  /* ---------- background network ---------- */
  (function net() {
    const cv = $("#net"), ctx = cv.getContext("2d");
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
