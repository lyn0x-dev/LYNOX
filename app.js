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
    // Lone optional card in the bento grid takes the full row
    $$(".bento").forEach((bento) => {
      const shown = $$("[data-shown]", bento).filter((el) => el.parentElement === bento);
      if (shown.length === 1) shown[0].classList.add("wide");
    });
    initReveal();
    initSpotlight();
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
})();
