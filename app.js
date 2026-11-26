(() => {
  const cfg = window.LYNOX || {};
  const links = cfg.links || {};
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const LINK_LABELS = {
    github: "GitHub",
    linkedin: "LinkedIn",
    x: "X / تويتر",
    telegram: "تيليجرام",
    whatsapp: "واتساب",
    email: "البريد الإلكتروني",
  };

  const LANG_COLORS = {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", HTML: "#e34c26", CSS: "#563d7c",
    Shell: "#89e051", Go: "#00ADD8", Rust: "#dea584", Java: "#b07219", C: "#555555", "C++": "#f34b7d",
    PHP: "#4F5D95", Lua: "#000080", Kotlin: "#A97BFF", Dart: "#00B4AB",
  };

  /* ---------- Toast System ---------- */
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
    toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
  };

  const copyEmail = async () => {
    const targetEmail = cfg.email || "contact@lynox.dev";
    try {
      await navigator.clipboard.writeText(targetEmail);
      toast("✓ تم نسخ البريد الإلكتروني بنجاح");
      sound.play("success");
    } catch {
      toast(targetEmail);
    }
  };

  /* ---------- Web Audio Synthesizer (Micro Sci-Fi SFX) ---------- */
  let audioCtx = null;
  let soundEnabled = false;

  const initAudio = () => {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtx();
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  };

  const sound = {
    play(type = "click") {
      if (!soundEnabled) return;
      try {
        initAudio();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === "click") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(650, now);
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.start(now);
          osc.stop(now + 0.045);
        } else if (type === "blip") {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.setValueAtTime(1050, now + 0.03);
          gain.gain.setValueAtTime(0.035, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.start(now);
          osc.stop(now + 0.065);
        } else if (type === "success") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.setValueAtTime(659.25, now + 0.07);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
          osc.start(now);
          osc.stop(now + 0.17);
        } else if (type === "error") {
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.setValueAtTime(180, now + 0.08);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.11);
        }
      } catch (e) {}
    },
  };

  // Sound toggle button
  try {
    const savedSound = localStorage.getItem("lynox-sound");
    if (savedSound === "1") {
      soundEnabled = true;
      document.body.classList.add("sound-active");
    }
  } catch (e) {}

  $$("[data-sound-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      document.body.classList.toggle("sound-active", soundEnabled);
      try {
        localStorage.setItem("lynox-sound", soundEnabled ? "1" : "0");
      } catch (e) {}
      if (soundEnabled) {
        sound.play("success");
        toast("🔊 تم تفعيل المؤثرات الصوتية");
      } else {
        toast("🔇 تم كتم المؤثرات الصوتية");
      }
    });
  });

  // Attach gentle audio clicks to buttons and links
  document.addEventListener("click", (e) => {
    const clickable = e.target.closest("button, a, .form-chip, .filter-btn, summary");
    if (clickable && !clickable.hasAttribute("data-sound-toggle")) {
      sound.play("click");
    }
  });

  /* ---------- Theme Accent Switcher ---------- */
  const THEMES = [
    { key: "crimson", name: "قرمزي سينمائي (Crimson)", dot: "#ff3d57" },
    { key: "cyan", name: "سايبر سيان (Cyber Cyan)", dot: "#00f0ff" },
    { key: "matrix", name: "زمردي تقني (Emerald Matrix)", dot: "#10b981" },
    { key: "purple", name: "نيون بنفسجي (Neon Violet)", dot: "#b845ed" },
    { key: "amber", name: "ذهبي كهرماني (Solar Amber)", dot: "#ffb703" },
  ];

  const setTheme = (key, notify = true) => {
    const target = THEMES.find((t) => t.key === key) || THEMES[0];
    if (target.key === "crimson") {
      document.documentElement.removeAttribute("data-accent");
    } else {
      document.documentElement.setAttribute("data-accent", target.key);
    }
    try {
      localStorage.setItem("lynox-accent", target.key);
    } catch (e) {}
    if (notify) {
      toast(`تم تفعيل ثيم: ${target.name}`);
      sound.play("blip");
    }
  };

  $$("[data-theme-cycle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-accent") || "crimson";
      const idx = THEMES.findIndex((t) => t.key === current);
      const next = THEMES[(idx + 1) % THEMES.length];
      setTheme(next.key);
    });
  });

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Dynamic Links from Config ---------- */
  $$("[data-link]").forEach((el) => {
    const key = el.dataset.link;
    const value = key === "email" ? (cfg.email ? `mailto:${cfg.email}` : "mailto:contact@lynox.dev") : links[key];
    if (value) {
      el.setAttribute("href", value);
      if (key !== "email") {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      }
      const note = $(".link-note", el);
      if (note) note.textContent = "مباشر ↗";
    } else {
      el.setAttribute("href", "#");
      el.classList.add("is-pending");
      el.setAttribute("aria-disabled", "true");
      const note = $(".link-note", el);
      if (note) note.textContent = "قريبًا";
      el.addEventListener("click", (e) => e.preventDefault());
    }
  });

  /* ---------- Copy Email Actions ---------- */
  $$("[data-copy-email]").forEach((btn) => {
    btn.hidden = false;
    btn.addEventListener("click", copyEmail);
  });

  if (cfg.cvUrl) {
    $$("[data-cv]").forEach((a) => {
      a.hidden = false;
      a.setAttribute("href", cfg.cvUrl);
    });
  }

  /* ---------- Render Tech Stack from Config ---------- */
  if (Array.isArray(cfg.stack) && cfg.stack.length) {
    $$("[data-stack]").forEach((section) => {
      const list = $("[data-stack-list]", section);
      if (!list) return;
      list.textContent = "";
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
      section.hidden = false;
    });
  }

  /* ---------- Render Experience from Config ---------- */
  if (Array.isArray(cfg.experience) && cfg.experience.length) {
    $$("[data-exp]").forEach((section) => {
      const list = $("[data-exp-list]", section);
      if (!list) return;
      list.textContent = "";
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
      section.hidden = false;
    });
  }

  /* ---------- Animated Stats Counters ---------- */
  const initCounters = () => {
    const counterEls = $$("[data-counter]");
    if (!counterEls.length) return;

    const runCounter = (el) => {
      if (el._done) return;
      el._done = true;
      const target = parseFloat(el.dataset.counter);
      const suffix = el.dataset.suffix || "";
      const isDecimal = el.dataset.decimal === "1";
      const dur = 1400;
      const start = performance.now();

      const update = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const cur = ease * target;
        el.textContent = (isDecimal ? cur.toFixed(1) : Math.round(cur)) + suffix;
        if (p < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    };

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              runCounter(e.target);
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      counterEls.forEach((el) => io.observe(el));
    } else {
      counterEls.forEach(runCounter);
    }
  };
  initCounters();

  /* ---------- Projects Category Filter ---------- */
  const initProjectFilters = () => {
    const filterBtns = $$(".filter-btn");
    const projectCards = $$(".project-item");
    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const cat = btn.dataset.filter;

        projectCards.forEach((card) => {
          const match = cat === "all" || card.dataset.cat === cat;
          if (match) {
            card.style.display = "";
            requestAnimationFrame(() => {
              card.style.opacity = "1";
              card.style.transform = "none";
            });
          } else {
            card.style.opacity = "0";
            card.style.transform = "scale(0.96)";
            setTimeout(() => {
              if (btn.classList.contains("is-active")) card.style.display = "none";
            }, 200);
          }
        });
      });
    });
  };
  initProjectFilters();

  /* ---------- Interactive Contact & Inquiry Form ---------- */
  const initInquiryForm = () => {
    const form = $("#project-form");
    if (!form) return;

    const chips = $$(".form-chip", form);
    let selectedType = "Full Stack App";

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("is-selected"));
        chip.classList.add("is-selected");
        selectedType = chip.dataset.type || chip.textContent.trim();
      });
    });

    const getFormData = () => {
      const name = $("#f-name", form)?.value.trim() || "عميل مهتم";
      const contact = $("#f-contact", form)?.value.trim() || "";
      const details = $("#f-details", form)?.value.trim() || "";
      return { name, contact, type: selectedType, details };
    };

    const buildMessageText = (data) => {
      return (
        `طلب مشروع جديد من موقع Lynox:\n` +
        `--------------------------------\n` +
        `👤 الاسم: ${data.name}\n` +
        `📞 وسيلة التواصل: ${data.contact}\n` +
        `🎯 نوع المشروع: ${data.type}\n` +
        `📝 التفاصيل والرؤية:\n${data.details}\n` +
        `--------------------------------`
      );
    };

    // 1. Submit via email
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = getFormData();
      if (!data.details) {
        toast("يرجى كتابة نبذة عن المشروع");
        return;
      }
      const targetEmail = cfg.email || "contact@lynox.dev";
      const subject = encodeURIComponent(`طلب مشروع: ${data.type} — ${data.name}`);
      const body = encodeURIComponent(buildMessageText(data));
      window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
      toast("جارٍ فتح تطبيق البريد...");
      sound.play("success");
    });

    // 2. Direct send via WhatsApp
    const btnWa = $("#btn-send-whatsapp", form);
    if (btnWa) {
      btnWa.addEventListener("click", () => {
        const data = getFormData();
        if (!data.details) {
          toast("يرجى كتابة نبذة عن المشروع أولاً");
          return;
        }
        const waLink = links.whatsapp || "https://wa.me/@WND0";
        const cleanBase = waLink.split("?")[0];
        const text = encodeURIComponent(buildMessageText(data));
        window.open(`${cleanBase}?text=${text}`, "_blank", "noopener");
        toast("جارٍ فتح واتساب مع نص الطلب...");
        sound.play("success");
      });
    }

    // 3. Copy Summary
    const btnCopy = $("#btn-copy-summary", form);
    if (btnCopy) {
      btnCopy.addEventListener("click", async () => {
        const data = getFormData();
        if (!data.details) {
          toast("املأ تفاصيل المشروع أولاً للنسخ");
          return;
        }
        const text = buildMessageText(data);
        try {
          await navigator.clipboard.writeText(text);
          toast("✓ تم نسخ ملخص الطلب إلى الحافظة");
          sound.play("success");
        } catch {
          toast("تعذر النسخ التلقائي");
        }
      });
    }
  };
  initInquiryForm();

  /* ---------- GitHub Repositories (optional cache fetch) ---------- */
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
      if (!list) return;
      const limit = Number(list.dataset.limit) || repos.length;
      list.textContent = "";
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
      section.hidden = false;
    });
  };

  const finish = () => {
    $$(".bento").forEach((bento) => {
      const cards = [...bento.children].filter((el) => !el.hidden && !el.classList.contains("editor-card"));
      if (cards.length % 2 === 1) cards[cards.length - 1].classList.add("wide");
    });
    initReveal();
    initSpotlight();
    initTilt();
    initMagnetic();
  };

  /* ---------- Reveal + Spotlight ---------- */
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
        if (!el.style.getPropertyValue("--d")) el.style.setProperty("--d", `${Math.min(i, 8) * 0.05}s`);
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

  /* ---------- Pointer-driven 3D Tilt & Magnetic ---------- */
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

  /* ---------- Scroll Progress + Header State ---------- */
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

  /* ---------- Cursor Glow ---------- */
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

  /* ---------- Command Palette (Ctrl/⌘ + K) ---------- */
  const dialog = $("#palette");
  if (dialog && typeof dialog.showModal === "function") {
    const input = $("#pal-input", dialog);
    const list = $("#pal-list", dialog);
    let items = [];
    let shown = [];
    let active = 0;

    const buildItems = () => {
      items = [
        { label: "الرئيسية (Home)", kind: "صفحة", run: () => (location.href = "index.html") },
        { label: "المشاريع والأعمال (Projects)", kind: "صفحة", run: () => (location.href = "projects.html") },
        { label: "من أنا والخبرات (About)", kind: "صفحة", run: () => (location.href = "about.html") },
        { label: "تواصل وطلب مشروع (Contact)", kind: "صفحة", run: () => (location.href = "contact.html") },
        { label: "ثيم: قرمزي سينمائي (Crimson Red)", kind: "ثيم", run: () => setTheme("crimson") },
        { label: "ثيم: سايبر سيان (Cyber Cyan)", kind: "ثيم", run: () => setTheme("cyan") },
        { label: "ثيم: زمردي تقني (Emerald Matrix)", kind: "ثيم", run: () => setTheme("matrix") },
        { label: "ثيم: نيون بنفسجي (Neon Violet)", kind: "ثيم", run: () => setTheme("purple") },
        { label: "ثيم: ذهبي كهرماني (Solar Amber)", kind: "ثيم", run: () => setTheme("amber") },
        { label: "نسخ البريد الإلكتروني", kind: "أمر", run: copyEmail },
        { label: "تبديل المؤثرات الصوتية (SFX)", kind: "أمر", run: () => $("[data-sound-toggle]")?.click() },
      ];
      if (cfg.cvUrl) items.push({ label: "تحميل السيرة الذاتية (CV)", kind: "ملف", run: () => window.open(cfg.cvUrl, "_blank", "noopener") });
      Object.entries(links).forEach(([k, v]) => {
        if (v) items.push({ label: `فتح ${LINK_LABELS[k] || k}`, kind: "رابط", run: () => window.open(v, "_blank", "noopener") });
      });
    };

    const render = () => {
      const q = input.value.trim().toLowerCase();
      shown = items.filter((i) => i.label.toLowerCase().includes(q) || i.kind.toLowerCase().includes(q));
      active = Math.min(active, Math.max(shown.length - 1, 0));
      list.textContent = "";
      if (!shown.length) {
        const li = document.createElement("li");
        li.className = "pal-empty";
        li.textContent = "لا توجد نتائج مطابقة. جرب البحث عن ثيم أو صفحة.";
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
      sound.play("blip");
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
        sound.play("click");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        active = (active - 1 + shown.length) % Math.max(shown.length, 1);
        render();
        sound.play("click");
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

  /* ---------- Background Parallax ---------- */
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

  /* ---------- Intro, Text Split & Scramble ---------- */
  let ccEnabled = false;
  function setCC(on) {
    if (ccEnabled) document.documentElement.classList.toggle("cc", on);
  }
  const markIntroSeen = () => { try { sessionStorage.setItem("lynox-intro", "1"); } catch {} };

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
    const dur = 1400;
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

  const GLYPHS = "!<>-_\\/[]{}—=+*^?#01";
  const scramble = (el, final) => {
    if (reduceMotion) return;
    const total = 20;
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

  /* ---------- Manifesto Scroll Lighting ---------- */
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

  /* ---------- Custom Cursor + Wordmark Parallax ---------- */
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
          cur.classList.toggle("hover", !!(e.target.closest && e.target.closest("a, button, [data-tilt], .chip-tag, input, textarea, label, summary")));
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

  /* ---------- Page Curtain Transition ---------- */
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

  /* ---------- Supercharged Interactive Terminal ---------- */
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
        else if (Array.isArray(p)) {
          const s = document.createElement("span");
          s.className = p[1];
          s.textContent = p[0];
          d.appendChild(s);
        } else {
          d.appendChild(document.createTextNode(p));
        }
      });
      out.appendChild(d);
      out.scrollTop = out.scrollHeight;
      return d;
    };

    const linkEl = (text, href, ext) => {
      const a = document.createElement("a");
      a.textContent = text;
      a.href = href;
      if (ext) {
        a.target = "_blank";
        a.rel = "noopener";
      }
      return a;
    };

    const CODE = [
      [["// profile.ts — Lynox Engineering Blueprint", "dim"]],
      [["const ", "p"], ["lynox", "e"], " = {"],
      ["  role: ", ['"Lead Full Stack Developer"', "ok"], ","],
      ["  status: ", ['"Available for hire & projects"', "ok"], ","],
      ["  architecture: ", ['"Clean, Event-driven & Scalable"', "ok"], ","],
      ["  stack: [", ['"Node.js"', "ok"], ", ", ['"TypeScript"', "ok"], ", ", ['"Python"', "ok"], ", ", ['"React"', "ok"], "],"],
      ["  motto: ", ['"clean > clever"', "ok"], ","],
      ["};"],
    ];

    const COMMANDS = {
      help() {
        [
          ["help", "عرض قائمة الأوامر المتاحة"],
          ["whoami", "نبذة سريعة عن Lynox والخبرة"],
          ["services", "الخدمات والحلول المتاحة للعملاء"],
          ["stats", "مؤشرات الأداء والإحصائيات الحية"],
          ["projects", "أبرز المشاريع والمنصات المنجزة"],
          ["theme <name>", "تغيير الثيم (cyan, matrix, purple, amber, crimson)"],
          ["cat profile.ts", "عرض كود الملف الشخصي"],
          ["contact", "طرق التواصل المباشر وطلب مشروع"],
          ["ping", "فحص سرعة استجابة الخادم"],
          ["matrix", "تأثير الماتريكس السيبراني"],
          ["clear", "مسح شاشة التيرمنال"],
        ].forEach(([c, d]) => add([c.padEnd(18), "k"], [d, "dim"]));
      },
      whoami() {
        add(["Lynox", "ok"], " — Lead Full Stack Developer & System Architect");
        add("أصنع حلولاً رقمية استثنائية، واجهات فائقة السرعة، وأنظمة خلفية عالية الموثوقية.");
        add(["Uptime: ", "dim"], ["99.9%", "ok"], ["  |  Status: ", "dim"], ["Ready for new challenges", "p"]);
      },
      services() {
        add(["01. ", "p"], "Full Stack Web Apps", [" — منصات ويب ولوحات تحكم متكاملة", "dim"]);
        add(["02. ", "p"], "Scalable APIs & Microservices", [" — خوادم سريعة ومعمارية قوية", "dim"]);
        add(["03. ", "p"], "Automation & Custom Bots", [" — بوتات تيليجرام وأتمتة المهام 24/7", "dim"]);
        add(["04. ", "p"], "Performance & Security Audit", [" — تحسين السرعة وتأمين الثغرات", "dim"]);
      },
      stats() {
        add(["✦ Projects Delivered: ", "dim"], ["+25", "ok"]);
        add(["✦ System Uptime: ", "dim"], ["99.9%", "ok"]);
        add(["✦ Average Latency: ", "dim"], ["< 200ms", "ok"]);
        add(["✦ Client Satisfaction: ", "dim"], ["100%", "ok"]);
      },
      projects() {
        add(["01. ", "p"], "URANUS BOT & PLATFORM", [" (Live Production)", "ok"]);
        add("    ", linkEl("↗ lynox.hidenplay.net", "https://lynox.hidenplay.net/", true));
        add(["02. ", "p"], "NEXUS CLOUD DASHBOARD", [" (SaaS Analytics)", "dim"]);
        add(["03. ", "p"], "PULSE API GATEWAY", [" (High Throughput)", "dim"]);
        add(["→ المزيد في صفحة: ", "dim"], linkEl("projects.html", "projects.html"));
      },
      theme(arg) {
        if (!arg) {
          add(["الثيمات المتاحة: ", "dim"], "cyan, matrix, purple, amber, crimson");
          return add(["مثال: ", "dim"], ["theme cyan", "k"]);
        }
        const found = THEMES.find((t) => t.key === arg.toLowerCase());
        if (found) {
          setTheme(found.key);
          add(["✓ تم تطبيق الثيم بنجاح: ", "ok"], found.name);
        } else {
          add(["ثيم غير معروف. اختر من: ", "e"], "cyan, matrix, purple, amber, crimson");
        }
      },
      ping() {
        add(["PING dev.lynox.org (127.0.0.1): 56 data bytes", "dim"]);
        setTimeout(() => {
          add(["64 bytes: icmp_seq=0 ttl=64 time=14.2 ms — server healthy", "ok"]);
          sound.play("blip");
        }, 120);
      },
      matrix() {
        const chars = "01011010 LYNOX CYBER SYSTEM INITIALIZED // ACCELERATED KERNEL READY 010101";
        add([chars, "ok"]);
        sound.play("blip");
      },
      contact() {
        if (cfg.email) add(["email".padEnd(10), "k"], linkEl(cfg.email, `mailto:${cfg.email}`));
        Object.entries(links).forEach(([k, v]) => {
          if (v) add([(LINK_LABELS[k] || k).padEnd(10), "k"], linkEl(v.replace(/^https?:\/\//, ""), v, true));
        });
        add(["→ نموذج حجز مشروع سريع: ", "p"], linkEl("contact.html", "contact.html"));
      },
      quote() {
        const quotes = [
          "“Simplicity is prerequisite for reliability.” — Edsger W. Dijkstra",
          "“Clean code always looks like it was written by someone who cares.” — Robert C. Martin",
          "“Make it work, make it right, make it fast.” — Kent Beck",
        ];
        add([quotes[(Math.random() * quotes.length) | 0], "k"]);
      },
      ls() { add(["index.html  projects.html  about.html  contact.html  profile.ts  config.js", "k"]); },
      date() { add(new Date().toString()); },
      clear() { out.textContent = ""; },
      exit() { add("أهلاً بك دائماً في مساحة Lynox 😄"); },
    };

    const run = (raw) => {
      const cmd = raw.trim().replace(/\s+/g, " ");
      add(["lynox ❯ ", "p"], [cmd, "cmd"]);
      if (!cmd) return;
      hist.push(cmd);
      hi = hist.length;
      const lower = cmd.toLowerCase();

      if (lower.startsWith("theme ")) {
        const arg = lower.replace("theme ", "").trim();
        return COMMANDS.theme(arg);
      }
      if (Object.hasOwn(COMMANDS, lower)) return COMMANDS[lower]();
      if (lower === "cat profile.ts") return CODE.forEach((l) => add(...l));
      if (lower === "hire" || lower === "sudo hire-me" || lower === "hire-me") {
        add(["✓ request approved! Welcome aboard.", "ok"]);
        return add("ابدأ مشروعك الآن: ", linkEl("contact.html", "contact.html"));
      }
      if (lower.startsWith("sudo")) return add(["lynox is in the sudoers file, but be gentle 😄", "e"]);
      if (/^rm\s+-rf/.test(lower)) return add(["Permission denied. Production systems are safe 😉", "e"]);
      if (lower.startsWith("echo ")) return add(cmd.slice(5));

      sound.play("error");
      add(["command not found: ", "e"], cmd);
      add(["جرّب كتابة ", "dim"], ["help", "k"], [" لعرض الأوامر.", "dim"]);
    };

    const typeRun = async (cmd) => {
      if (busy) return;
      busy = true;
      input.value = "";
      if (!reduceMotion) {
        for (const ch of cmd) {
          input.value += ch;
          await new Promise((r) => setTimeout(r, 34));
        }
      }
      await new Promise((r) => setTimeout(r, reduceMotion ? 0 : 160));
      input.value = "";
      run(cmd);
      busy = false;
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (busy) return;
      const v = input.value;
      input.value = "";
      run(v);
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        hi = Math.max(0, hi - 1);
        input.value = hist[hi] || "";
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        hi = Math.min(hist.length, hi + 1);
        input.value = hist[hi] || "";
      } else if (e.key === "Tab") {
        e.preventDefault();
        const names = [...Object.keys(COMMANDS), "cat profile.ts", "sudo hire-me"];
        const match = names.find((n) => n.startsWith(input.value.toLowerCase()));
        if (match) input.value = match;
      }
    });

    $$("[data-cmd]", term).forEach((b) => b.addEventListener("click", () => typeRun(b.dataset.cmd)));
    term.addEventListener("click", (e) => {
      if (!e.target.closest("a, button") && !getSelection().toString()) input.focus({ preventScroll: true });
    });

    const boot = async () => {
      add(["Lynox Kernel v2.5 [Production Ready] — اكتب ", "dim"], ["help", "k"], [" لعرض الأوامر", "dim"]);
      add("");
      await typeRun("whoami");
    };

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => es[0].isIntersecting && (io.disconnect(), boot()), { threshold: 0.35 });
      io.observe(term);
    } else {
      boot();
    }
  }
})();
