(() => {
  const cfg = window.LYNOX || {};
  const links = cfg.links || {};
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const LINK_LABELS = { github: "GitHub", linkedin: "LinkedIn", x: "X / تويتر", telegram: "تيليجرام", whatsapp: "واتساب" };
  const LANG_COLORS = {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", HTML: "#e34c26", CSS: "#563d7c",
    Shell: "#89e051", Go: "#00ADD8", Rust: "#dea584", Java: "#b07219", C: "#555555", "C++": "#f34b7d",
    PHP: "#4F5D95", Lua: "#000080", Kotlin: "#A97BFF", Dart: "#00B4AB",
  };

  /* ---------- Toast ---------- */
  let toastTimer;
  const toast = (msg) => {
    let el = $(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(cfg.email);
      toast("اتنسخ الإيميل");
    } catch {
      toast(cfg.email);
    }
  };

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Links from config ---------- */
  $$("[data-link]").forEach((el) => {
    const key = el.dataset.link;
    const value = key === "email" ? (cfg.email ? `mailto:${cfg.email}` : "") : links[key];
    if (value) {
      el.setAttribute("href", value);
      if (key !== "email") {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      }
    } else {
      el.setAttribute("href", "#");
      el.classList.add("is-pending");
      el.setAttribute("aria-disabled", "true");
      const note = $(".link-note", el);
      if (note) note.textContent = "قريبًا";
      el.addEventListener("click", (e) => e.preventDefault());
    }
  });

  /* ---------- Optional blocks (show only when filled in config.js) ---------- */
  if (cfg.email) {
    $$("[data-copy-email]").forEach((btn) => {
      btn.hidden = false;
      btn.addEventListener("click", copyEmail);
    });
  }
  if (cfg.cvUrl) {
    $$("[data-cv]").forEach((a) => {
      a.hidden = false;
      a.setAttribute("href", cfg.cvUrl);
    });
  }

  const showOptional = (el) => {
    el.hidden = false;
    el.setAttribute("data-shown", "");
  };

  if (Array.isArray(cfg.stack) && cfg.stack.length) {
    $$("[data-stack]").forEach((section) => {
      const list = $("[data-stack-list]", section);
      cfg.stack.forEach((g) => {
        const wrap = document.createElement("div");
        wrap.className = "stack-group";
        const h = document.createElement("h3");
        h.textContent = g.group;
        const chips = document.createElement("div");
        chips.className = "chips";
        (g.items || []).forEach((t) => {
          const c = document.createElement("span");
          c.className = "chip-tag";
          c.textContent = t;
          c.setAttribute("dir", "auto");
          chips.appendChild(c);
        });
        wrap.append(h, chips);
        list.appendChild(wrap);
      });
      showOptional(section);
    });
  }

  if (Array.isArray(cfg.experience) && cfg.experience.length) {
    $$("[data-exp]").forEach((section) => {
      const list = $("[data-exp-list]", section);
      cfg.experience.forEach((x) => {
        const li = document.createElement("li");
        const role = document.createElement("strong");
        role.textContent = x.org ? `${x.role} — ${x.org}` : x.role;
        const when = document.createElement("div");
        when.className = "when";
        when.textContent = x.period || "";
        li.append(role, when);
        if (x.desc) {
          const p = document.createElement("p");
          p.textContent = x.desc;
          li.appendChild(p);
        }
        list.appendChild(li);
      });
      showOptional(section);
    });
  }

  /* ---------- GitHub repositories ---------- */
  const loadRepos = async (user) => {
    const key = `lynox-gh-${user}`;
    try {
      const cached = sessionStorage.getItem(key);
      if (cached) return JSON.parse(cached);
    } catch {}
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=pushed`);
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const all = await res.json();
    const repos = all
      .filter((r) => !r.fork && !r.archived)
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at))
      .slice(0, 6)
      .map((r) => ({ name: r.name, url: r.html_url, desc: r.description || "", lang: r.language || "", stars: r.stargazers_count }));
    try {
      sessionStorage.setItem(key, JSON.stringify(repos));
    } catch {}
    return repos;
  };

  const renderRepos = (repos) => {
    $$("[data-gh]").forEach((section) => {
      const list = $("[data-gh-list]", section);
      const limit = Number(list.dataset.limit) || repos.length;
      repos.slice(0, limit).forEach((r) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.className = "card spot repo";
        a.href = r.url;
        a.target = "_blank";
        a.rel = "noopener";
        const name = document.createElement("span");
        name.className = "repo-name";
        name.textContent = r.name;
        const desc = document.createElement("p");
        desc.className = "repo-desc";
        desc.textContent = r.desc || "—";
        const meta = document.createElement("div");
        meta.className = "repo-meta";
        if (r.lang) {
          const l = document.createElement("span");
          const dot = document.createElement("i");
          dot.className = "lang-dot";
          dot.style.background = LANG_COLORS[r.lang] || "";
          l.append(dot, r.lang);
          meta.appendChild(l);
        }
        const s = document.createElement("span");
        s.textContent = `★ ${r.stars}`;
        meta.appendChild(s);
        a.append(name, desc, meta);
        li.appendChild(a);
        list.appendChild(li);
      });
      showOptional(section);
    });
  };

  const finish = () => {
    // Odd number of cards in the bento grid: the last one takes the full row
    $$(".bento").forEach((bento) => {
      const cards = [...bento.children].filter((el) => !el.hidden && !el.classList.contains("editor-card"));
      if (cards.length % 2 === 1) cards[cards.length - 1].classList.add("wide");
    });
    initReveal();
    initSpotlight();
    initTilt();
    initMagnetic();
  };

  /* ---------- Reveal + spotlight ---------- */
  function initReveal() {
    const els = $$(".reveal");
    if ("IntersectionObserver" in window && !reduceMotion) {
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          }),
        { threshold: 0.1 }
      );
      els.forEach((el, i) => {
        if (!el.style.getPropertyValue("--d")) el.style.setProperty("--d", `${Math.min(i, 8) * 0.06}s`);
        io.observe(el);
      });
    } else {
      els.forEach((el) => el.classList.add("in"));
    }
  }

  function initSpotlight() {
    $$(".spot").forEach((el) => {
      if (el._spot) return;
      el._spot = true;
      el.addEventListener(
        "pointermove",
        (e) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--mx", `${e.clientX - r.left}px`);
          el.style.setProperty("--my", `${e.clientY - r.top}px`);
        },
        { passive: true }
      );
    });
  }

  /* ---------- Pointer-driven effects (fine pointers, motion allowed) ---------- */
  const fine = window.matchMedia("(pointer: fine)").matches;

  function initTilt() {
    if (reduceMotion || !fine) return;
    $$("[data-tilt]").forEach((el) => {
      el.addEventListener(
        "pointermove",
        (e) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          el.style.setProperty("--ry", `${(x * 9).toFixed(2)}deg`);
          el.style.setProperty("--rx", `${(-y * 9).toFixed(2)}deg`);
        },
        { passive: true }
      );
      el.addEventListener("pointerleave", () => {
        el.style.setProperty("--ry", "0deg");
        el.style.setProperty("--rx", "0deg");
      });
    });
  }

  function initMagnetic() {
    if (reduceMotion || !fine) return;
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener(
        "pointermove",
        (e) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - (r.left + r.width / 2)) * 0.22;
          const y = (e.clientY - (r.top + r.height / 2)) * 0.32;
          el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        },
        { passive: true }
      );
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- Scroll progress + header state ---------- */
  const progress = $(".progress");
  const header = $(".site-header");
  let ticking = false;
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.setProperty("--p", max > 0 ? Math.min(scrollY / max, 1).toFixed(4) : 0);
    if (header) header.classList.toggle("scrolled", scrollY > 12);
    ticking = false;
  };
  window.addEventListener("scroll", () => !ticking && ((ticking = true), requestAnimationFrame(onScroll)), { passive: true });
  onScroll();

  /* ---------- Cursor glow ---------- */
  const glow = $(".cursor-glow");
  if (glow && fine && !reduceMotion) {
    let gx = 0, gy = 0, cx2 = 0, cy2 = 0, graf = null;
    const loop = () => {
      cx2 += (gx - cx2) * 0.12;
      cy2 += (gy - cy2) * 0.12;
      glow.style.transform = `translate3d(${cx2.toFixed(1)}px, ${cy2.toFixed(1)}px, 0)`;
      graf = Math.abs(gx - cx2) > 0.5 || Math.abs(gy - cy2) > 0.5 ? requestAnimationFrame(loop) : null;
    };
    window.addEventListener(
      "pointermove",
      (e) => {
        gx = e.clientX;
        gy = e.clientY;
        glow.classList.add("on");
        if (!graf) graf = requestAnimationFrame(loop);
      },
      { passive: true }
    );
    document.documentElement.addEventListener("pointerleave", () => glow.classList.remove("on"));
  }

  if (cfg.github && $$("[data-gh]").length) {
    loadRepos(cfg.github).then((r) => r.length && renderRepos(r)).catch(() => {}).finally(finish);
  } else {
    finish();
  }

  /* ---------- Command palette (Ctrl/⌘ + K) ---------- */
  const dialog = $("#palette");
  if (dialog && typeof dialog.showModal === "function") {
    const input = $("#pal-input", dialog);
    const list = $("#pal-list", dialog);
    let items = [];
    let shown = [];
    let active = 0;

    const buildItems = () => {
      items = $$(".site-nav a").map((a) => ({ label: a.textContent.trim(), kind: "صفحة", run: () => (location.href = a.getAttribute("href")) }));
      if (cfg.email) items.push({ label: "نسخ الإيميل", kind: "أمر", run: copyEmail });
      if (cfg.cvUrl) items.push({ label: "تحميل السيرة الذاتية", kind: "أمر", run: () => window.open(cfg.cvUrl, "_blank", "noopener") });
      Object.entries(links).forEach(([k, v]) => {
        if (v) items.push({ label: `فتح ${LINK_LABELS[k] || k}`, kind: "رابط", run: () => window.open(v, "_blank", "noopener") });
      });
    };

    const render = () => {
      const q = input.value.trim().toLowerCase();
      shown = items.filter((i) => i.label.toLowerCase().includes(q));
      active = Math.min(active, Math.max(shown.length - 1, 0));
      list.textContent = "";
      if (!shown.length) {
        const li = document.createElement("li");
        li.className = "pal-empty";
        li.textContent = "مفيش نتايج. جرّب كلمة تانية.";
        list.appendChild(li);
        input.removeAttribute("aria-activedescendant");
        return;
      }
      shown.forEach((item, i) => {
        const li = document.createElement("li");
        li.id = `pal-opt-${i}`;
        li.className = "pal-item";
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", String(i === active));
        const label = document.createElement("span");
        label.textContent = item.label;
        const kind = document.createElement("span");
        kind.className = "pal-kind";
        kind.textContent = item.kind;
        li.append(label, kind);
        li.addEventListener("mousemove", () => {
          if (active !== i) {
            active = i;
            render();
          }
        });
        li.addEventListener("click", () => run(i));
        list.appendChild(li);
      });
      input.setAttribute("aria-activedescendant", `pal-opt-${active}`);
      $(`#pal-opt-${active}`, list)?.scrollIntoView({ block: "nearest" });
    };

    const run = (i) => {
      const item = shown[i];
      if (!item) return;
      dialog.close();
      item.run();
    };

    const open = () => {
      buildItems();
      input.value = "";
      active = 0;
      render();
      dialog.showModal();
      setCC(false);
      input.focus();
    };

    input.addEventListener("input", () => {
      active = 0;
      render();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        active = (active + 1) % Math.max(shown.length, 1);
        render();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        active = (active - 1 + shown.length) % Math.max(shown.length, 1);
        render();
      } else if (e.key === "Enter") {
        e.preventDefault();
        run(active);
      }
    });
    dialog.addEventListener("close", () => setCC(true));
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });

    $$("[data-open-palette]").forEach((b) => b.addEventListener("click", open));
    $$(".kbd-btn kbd").forEach((k) => (k.textContent = isMac ? "⌘ K" : "Ctrl K"));

    document.addEventListener("keydown", (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        dialog.open ? dialog.close() : open();
      } else if (e.key === "/" && !typing && !dialog.open) {
        e.preventDefault();
        open();
      }
    });
  } else {
    $$("[data-open-palette]").forEach((b) => (b.hidden = true));
  }

  /* ---------- Gentle parallax on the background ---------- */
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    const bg = $(".bg");
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    const step = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      bg.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      raf = Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1 ? requestAnimationFrame(step) : null;
    };
    window.addEventListener(
      "pointermove",
      (e) => {
        tx = (e.clientX / innerWidth - 0.5) * 24;
        ty = (e.clientY / innerHeight - 0.5) * 24;
        if (!raf) raf = requestAnimationFrame(step);
      },
      { passive: true }
    );
  }

  /* ==========================================================
     Creative layer: intro, split text, scramble, cursor,
     manifesto, page curtain, interactive terminal
     ========================================================== */
  let ccEnabled = false;
  function setCC(on) {
    if (ccEnabled) document.documentElement.classList.toggle("cc", on);
  }
  const markIntroSeen = () => { try { sessionStorage.setItem("lynox-intro", "1"); } catch {} };

  /* Intro (once per session) */
  let introDone;
  const introPromise = new Promise((r) => (introDone = r));
  (() => {
    const el = $(".loader");
    if (!el || reduceMotion || !document.documentElement.classList.contains("intro")) {
      el && el.remove();
      markIntroSeen();
      return introDone();
    }
    const num = $(".loader-num", el);
    const t0 = performance.now();
    const dur = 1500;
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.style.setProperty("--lp", e.toFixed(3));
      num.textContent = String(Math.round(e * 100)).padStart(3, "0");
      if (p < 1) return requestAnimationFrame(tick);
      el.classList.add("done");
      markIntroSeen();
      setTimeout(introDone, 350);
      setTimeout(() => el.remove(), 1000);
    };
    requestAnimationFrame(tick);
  })();

  /* Split headline into masked words */
  const splitWords = (root) => {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(" "));
            const w = document.createElement("span");
            w.className = "w";
            const inner = document.createElement("span");
            inner.textContent = part;
            inner.style.setProperty("--i", i++);
            w.appendChild(inner);
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(root);
  };
  $$("[data-split]").forEach((el) => {
    splitWords(el);
    introPromise.then(() => requestAnimationFrame(() => el.classList.add("split-in")));
  });

  /* Text scramble */
  const GLYPHS = "!<>-_\\/[]{}—=+*^?#01";
  const scramble = (el, final) => {
    if (reduceMotion) return;
    const total = 22;
    let f = 0;
    const id = setInterval(() => {
      f++;
      el.textContent = [...final].map((c, i) => (c === " " || i < (final.length * f) / total ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
      if (f >= total) { clearInterval(id); el.textContent = final; }
    }, 32);
  };
  $$("[data-scramble]").forEach((el) => {
    const final = el.textContent;
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((es) => es[0].isIntersecting && (io.disconnect(), scramble(el, final)), { threshold: 0.6 });
    io.observe(el);
  });
  const brandText = $(".brand span");
  if (brandText) brandText.parentElement.addEventListener("mouseenter", () => scramble(brandText, "LYNOX"));

  /* Manifesto: words light up with scroll */
  const man = $("[data-lit]");
  if (man) {
    const words = man.textContent.trim().split(/\s+/);
    man.textContent = "";
    const spans = words.map((w) => {
      const s = document.createElement("span");
      s.className = "lw" + (reduceMotion ? " on" : "");
      s.textContent = w;
      man.append(s, " ");
      return s;
    });
    if (!reduceMotion) {
      const upd = () => {
        const r = man.getBoundingClientRect();
        const p = (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.3);
        const n = Math.round(Math.max(0, Math.min(1, p)) * spans.length);
        spans.forEach((s, i) => s.classList.toggle("on", i < n));
      };
      let t2 = false;
      window.addEventListener("scroll", () => !t2 && ((t2 = true), requestAnimationFrame(() => ((t2 = false), upd()))), { passive: true });
      upd();
    }
  }

  /* Custom cursor + wordmark parallax */
  if (fine && !reduceMotion) {
    const cur = $(".cursor");
    if (cur) {
      ccEnabled = true;
      document.documentElement.classList.add("cc");
      const dot = $(".c-dot", cur), ring = $(".c-ring", cur), wm = $(".wordmark");
      let mx = -100, my = -100, rx = -100, ry = -100;
      window.addEventListener(
        "pointermove",
        (e) => {
          mx = e.clientX; my = e.clientY;
          dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
          cur.classList.remove("hide");
          cur.classList.toggle("hover", !!(e.target.closest && e.target.closest("a, button, [data-tilt], .chip-tag, input, label")));
          if (wm) {
            wm.style.setProperty("--wx", `${((e.clientX / innerWidth - 0.5) * -36).toFixed(1)}px`);
            wm.style.setProperty("--wy", `${((e.clientY / innerHeight - 0.5) * -24).toFixed(1)}px`);
          }
        },
        { passive: true }
      );
      window.addEventListener("pointerdown", () => cur.classList.add("down"));
      window.addEventListener("pointerup", () => cur.classList.remove("down"));
      document.documentElement.addEventListener("pointerleave", () => cur.classList.add("hide"));
      const loop = () => {
        rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
        ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
        requestAnimationFrame(loop);
      };
      loop();
    }
  }

  /* Page curtain on internal navigation */
  const curtain = $(".curtain");
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a || !curtain || reduceMotion || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const raw = a.getAttribute("href");
    if (a.target === "_blank" || a.hasAttribute("download") || !raw || raw.startsWith("#") || /^(mailto|tel):/.test(raw)) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || u.pathname === location.pathname) return;
    e.preventDefault();
    try { sessionStorage.setItem("lynox-nav", "1"); } catch {}
    curtain.classList.add("go");
    setTimeout(() => (location.href = u.href), 430);
  });
  window.addEventListener("pageshow", (e) => e.persisted && curtain && curtain.classList.remove("go"));

  /* Interactive terminal */
  const term = $("#term");
  if (term) {
    const out = $("#term-out"), form = $("#term-form"), input = $("#term-in");
    const hist = [];
    let hi = 0, busy = false;
    const add = (...parts) => {
      const d = document.createElement("div");
      d.className = "term-line";
      parts.forEach((p) => {
        if (p instanceof Node) d.appendChild(p);
        else if (Array.isArray(p)) { const s = document.createElement("span"); s.className = p[1]; s.textContent = p[0]; d.appendChild(s); }
        else d.appendChild(document.createTextNode(p));
      });
      out.appendChild(d);
      out.scrollTop = out.scrollHeight;
      return d;
    };
    const linkEl = (text, href, ext) => {
      const a = document.createElement("a");
      a.textContent = text; a.href = href;
      if (ext) { a.target = "_blank"; a.rel = "noopener"; }
      return a;
    };
    const stackItems = () => (Array.isArray(cfg.stack) && cfg.stack.length ? cfg.stack.flatMap((g) => g.items || []) : ["API design", "Frontend", "Clean code", "Problem solving"]);
    const CODE = [
      [["// profile.ts", "dim"]],
      [["const ", "p"], ["lynox", "e"], " = {"],
      ["  role: ", ['"Full Stack Developer"', "ok"], ","],
      ["  focus: [", ['"API design"', "ok"], ", ", ['"Frontend"', "ok"], "],"],
      ["  values: [", ['"clean code"', "ok"], ", ", ['"problem solving"', "ok"], ", ", ['"teamwork"', "ok"], "],"],
      ["  motto: ", ['"clean > clever"', "ok"], ","],
      ["};"],
    ];
    const COMMANDS = {
      help() {
        [["help", "اعرض الأوامر"], ["whoami", "أنا مين"], ["skills", "اللي بشتغل بيه"], ["projects", "المشاريع"], ["cat profile.ts", "الملف الشخصي"], ["contact", "طرق التواصل"], ["clear", "امسح الشاشة"]].forEach(([c, d]) => add([c.padEnd(16), "k"], [d, "dim"]));
      },
      whoami() {
        add(["Lynox", "ok"], " — Full Stack Developer");
        add("بيبني أشياء نضيفة وشغّالة. من الفكرة للكود، ومن الكود للناس.");
      },
      skills() { stackItems().forEach((s) => add(["▸ ", "p"], s)); },
      projects() {
        add(["01 ", "p"], "URANUS BOT");
        add(["   موقع تنصيب أورانوس، وأحيانًا لينوكس.", "dim"]);
        add("   ", linkEl("↗ lynox.hidenplay.net", "https://lynox.hidenplay.net/", true));
        add(["02 ", "p"], ["قريبًا…", "dim"]);
      },
      contact() {
        let any = false;
        if (cfg.email) { any = true; add(["email".padEnd(10), "k"], linkEl(cfg.email, `mailto:${cfg.email}`)); }
        Object.entries(links).forEach(([k, v]) => {
          if (v) { any = true; add([(LINK_LABELS[k] || k).padEnd(10), "k"], linkEl(v.replace(/^https?:\/\//, ""), v, true)); }
        });
        if (!any) add(["الروابط لسه قريبًا…", "dim"]);
        add(["→ ", "p"], linkEl("contact.html", "contact.html"));
      },
      ls() { add(["index.html  projects.html  about.html  contact.html", "k"]); },
      date() { add(new Date().toString()); },
      clear() { out.textContent = ""; },
      exit() { add("مفيش مفر 😄 — اقفل التاب لو عايز."); },
    };
    const run = (raw) => {
      const cmd = raw.trim().replace(/\s+/g, " ");
      add(["lynox ❯ ", "p"], [cmd, "cmd"]);
      if (!cmd) return;
      hist.push(cmd); hi = hist.length;
      const lower = cmd.toLowerCase();
      if (Object.hasOwn(COMMANDS, lower)) return COMMANDS[lower]();
      if (lower === "cat profile.ts") return CODE.forEach((l) => add(...l));
      if (lower === "sudo hire-me") { add(["✓ request approved", "ok"]); return add("كلمني: ", linkEl("contact.html", "contact.html")); }
      if (lower.startsWith("sudo")) return add(["lynox is not in the sudoers file. This incident will be reported. 😄", "e"]);
      if (/^rm\s+-rf/.test(lower)) return add(["nice try 😄", "e"]);
      if (lower.startsWith("echo ")) return add(cmd.slice(5));
      add(["command not found: ", "e"], cmd);
      add(["جرّب ", "dim"], ["help", "k"]);
    };
    const typeRun = async (cmd) => {
      if (busy) return;
      busy = true;
      input.value = "";
      if (!reduceMotion) for (const ch of cmd) { input.value += ch; await new Promise((r) => setTimeout(r, 38)); }
      await new Promise((r) => setTimeout(r, reduceMotion ? 0 : 180));
      input.value = "";
      run(cmd);
      busy = false;
    };
    form.addEventListener("submit", (e) => { e.preventDefault(); if (busy) return; const v = input.value; input.value = ""; run(v); });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") { e.preventDefault(); hi = Math.max(0, hi - 1); input.value = hist[hi] || ""; }
      else if (e.key === "ArrowDown") { e.preventDefault(); hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ""; }
      else if (e.key === "Tab") {
        e.preventDefault();
        const names = [...Object.keys(COMMANDS), "cat profile.ts", "sudo hire-me"].filter((n) => n.startsWith(input.value.toLowerCase()));
        if (names.length === 1) input.value = names[0];
      }
    });
    $$("[data-cmd]", term).forEach((b) => b.addEventListener("click", () => typeRun(b.dataset.cmd)));
    term.addEventListener("click", (e) => { if (!e.target.closest("a, button") && !getSelection().toString()) input.focus({ preventScroll: true }); });
    const boot = async () => {
      add(["Lynox OS 1.0 — اكتب ", "dim"], ["help", "k"], [" للأوامر", "dim"]);
      add("");
      await typeRun("whoami");
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => es[0].isIntersecting && (io.disconnect(), boot()), { threshold: 0.35 });
      io.observe(term);
    } else boot();
  }
})();
