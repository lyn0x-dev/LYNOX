#!/usr/bin/env python3
"""Generates the static pages (index, projects, about, contact, 404) from shared partials.

Why: header / footer / palette / <head> are identical on every page. Edit them once here,
run `py tools/build.py`, commit the generated .html files. No runtime dependencies.
"""
from pathlib import Path
from datetime import date

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://dev.lynox.org"
FONTS = ("https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800"
         "&family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;500;600&display=swap")
PROJECT_URL = "https://lynox.hidenplay.net/"
PROJECT_HOST = "lynox.hidenplay.net"

NAV = [
    ("index.html", "الرئيسية"),
    ("projects.html", "المشاريع"),
    ("about.html", "من أنا"),
    ("contact.html", "تواصل"),
]

ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 17 7 7M7 17V7h10"/></svg>'
ARROW_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>'
CHECK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>'


def head(title, desc, path, extra=""):
    url = f"{SITE}/{path}" if path else f"{SITE}/"
    return f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#08070a">
<meta name="color-scheme" content="dark">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="ar_EG">
<meta property="og:site_name" content="Lynox">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{SITE}/og.png">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="avatar.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="{FONTS}" rel="stylesheet">
<link rel="stylesheet" href="style.css">
<script>
  document.documentElement.classList.add('js');
  try {{
    const acc = localStorage.getItem('lynox-accent');
    if (acc) document.documentElement.setAttribute('data-accent', acc);
    if (!sessionStorage.getItem('lynox-intro')) document.documentElement.classList.add('intro');
    if (sessionStorage.getItem('lynox-nav')) {{
      document.documentElement.classList.add('arriving');
      sessionStorage.removeItem('lynox-nav');
    }}
  }} catch(e) {{}}
</script>
{extra}</head>
<body>
  <a class="skip" href="#main">تخطي للمحتوى</a>
  <div class="loader" aria-hidden="true"><div class="loader-inner"><div class="loader-word">LYNOX</div><div class="loader-bar"><i></i></div><div class="loader-num">000</div></div></div>
  <div class="curtain" aria-hidden="true"></div>
  <div class="cursor" aria-hidden="true"><i class="c-dot"></i><i class="c-ring"></i></div>
  <div class="progress" aria-hidden="true"></div>
  <div class="cursor-glow" aria-hidden="true"></div>

  <div class="bg" aria-hidden="true">
    <div class="grid-lines"></div>
    <div class="blob b1"></div>
    <div class="blob b2"></div>
    <div class="blob b3"></div>
  </div>
  <div class="grain" aria-hidden="true"></div>
"""


def header(current):
    cur = ' aria-current="page"'
    links = "\n".join(
        f'          <a href="{h}"{cur if h == current else ""}>{t}</a>' for h, t in NAV
    )
    return f"""
  <header class="site-header">
    <div class="wrap">
      <div class="bar">
        <a class="brand" href="index.html" aria-label="Lynox — الرئيسية">
          <img src="avatar.jpg" width="34" height="34" alt="Lynox">
          <span>LYNOX</span>
        </a>
        <a class="status-badge" href="contact.html" title="متاح لقبول مشاريع جديدة واستشارات برمجية">
          <i class="status-dot"></i>
          <span>متاح للعمل الحر</span>
        </a>
        <nav class="site-nav" aria-label="التنقل الرئيسي">
{links}
        </nav>
        <div class="header-controls">
          <button class="ctrl-btn theme-toggle" type="button" data-theme-cycle title="تغيير لون الهوية (ثيم تفاعلي)" aria-label="تغيير لون الهوية">
            <span class="theme-swatch"></span>
          </button>
          <button class="ctrl-btn sound-toggle" type="button" data-sound-toggle title="تفعيل / كتم المؤثرات الصوتية" aria-label="المؤثرات الصوتية">
            <svg class="s-icon s-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            <svg class="s-icon s-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          </button>
          <button class="kbd-btn" type="button" data-open-palette aria-label="بحث وأوامر سريعة">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            <span class="kbd-label">أوامر</span><kbd>Ctrl K</kbd>
          </button>
        </div>
      </div>
    </div>
  </header>
"""


FOOTER = """
  <footer class="site-footer">
    <div class="wrap">
      <div class="foot-main">
        <div class="foot-brand">
          <div class="foot-logo"><img src="avatar.jpg" width="28" height="28" alt=""><span>LYNOX</span></div>
          <p class="foot-tagline">هندسة برمجية نظيفة، واجهات استثنائية، وأداء لا يقبل المساومة.</p>
        </div>
        <div class="foot-nav-groups">
          <div class="foot-col">
            <span class="foot-h">التنقل السريع</span>
            <a href="index.html">الرئيسية</a>
            <a href="projects.html">المشاريع</a>
            <a href="about.html">من أنا والخبرات</a>
            <a href="contact.html">تواصل وطلب مشروع</a>
          </div>
          <div class="foot-col">
            <span class="foot-h">الخدمات</span>
            <span>تطوير Full Stack</span>
            <span>واجهات فائقة السرعة</span>
            <span>بناء APIs وأتمتة</span>
          </div>
        </div>
      </div>
      <div class="foot-sub">
        <span>© <span data-year>2026</span> Lynox — كود نظيف وتصميم بمعايير عالمية</span>
        <span>مبني بأداء فائق وخالي من الاعتماديات الثقيلة</span>
      </div>
    </div>
  </footer>

  <dialog id="palette" class="palette" aria-label="التنقل السريع">
    <div class="pal-box">
      <div class="pal-head">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input id="pal-input" class="pal-input" type="text" placeholder="اكتب أمراً أو ابحث عن صفحة (جرّب theme أو projects أو contact)..." autocomplete="off" role="combobox" aria-expanded="true" aria-controls="pal-list">
      </div>
      <ul id="pal-list" class="pal-list" role="listbox" aria-label="النتائج"></ul>
      <div class="pal-foot">
        <span><kbd>↑</kbd> <kbd>↓</kbd> للتنقل</span>
        <span><kbd>Enter</kbd> للاختيار</span>
        <span><kbd>Esc</kbd> للإغلاق</span>
      </div>
    </div>
  </dialog>

  <script src="config.js"></script>
  <script src="app.js"></script>
</body>
</html>
"""

PORTRAIT = """<div class="portrait-wrap reveal">
        <figure class="portrait" data-tilt>
          <img src="avatar.jpg" width="736" height="766" alt="صورة Lynox الشخصية" fetchpriority="high">
          <img class="gl g1" src="avatar.jpg" alt="" aria-hidden="true"><img class="gl g2" src="avatar.jpg" alt="" aria-hidden="true">
          <span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>
        </figure>
        <span class="tag t1"><i></i>Clean Architecture</span>
        <span class="tag t2"><i></i>API ⇄ UI</span>
        <span class="tag t3"><i></i>Uptime 99.9%</span>
      </div>"""

PREVIEW_URANUS = f"""<div class="preview" aria-hidden="true">
            <div class="preview-bar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="preview-url">{PROJECT_HOST}</span></div>
            <div class="preview-body"><div class="sb"><i></i><i></i><i></i><i></i></div><div class="mn"><b></b><b></b><b></b></div></div>
          </div>"""

MARQUEE_ITEMS = [
    "Full Stack Architecture",
    "Scalable APIs",
    "High Performance UI",
    "Clean Code & TDD",
    "أمان وحماية الأنظمة",
    "Microservices & Docker",
    "قواعد بيانات محسنة",
    "أتمتة وبوتات ذكية",
    "Modern UX 60FPS",
    "حلول سحابية متكاملة"
]


def marquee():
    row = "".join(f"<span>{t}</span>" for t in MARQUEE_ITEMS)
    rev = "".join(f"<span>{t}</span>" for t in reversed(MARQUEE_ITEMS))
    return (f'<div class="marquee-stack" aria-hidden="true">'
            f'<div class="marquee"><div class="marquee-track">{row}{row}</div></div>'
            f'<div class="marquee alt"><div class="marquee-track rev">{rev}{rev}</div></div></div>')


def page_index():
    schema = ('<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Lynox",'
              f'"jobTitle":"Senior Full Stack Developer","image":"{SITE}/avatar.jpg","url":"{SITE}/",'
              '"description":"مطور Full Stack يصنع حلولاً رقمية استثنائية، واجهات فائقة السرعة، وأنظمة خلفية عالية الموثوقية."}</script>\n')

    steps = [
        ("01", "تحليل المتطلبات والتخطيط المعماري", "أفهم الهدف التجاري بعمق، وأصمم بنية البيانات ومخطط الـ Architecture بدقة متناهية قبل كتابة سطر كود واحد لضمان التوسع السلس."),
        ("02", "التطوير الهندسي والاختبار الشامل", "بناء الواجهات الخلفية والأمامية وفق مبادئ الكود النظيف (Clean Code) مع اختبارات أداء وأمان واختبارات ضغط حقيقية."),
        ("03", "النشر السحابي والدعم المستمر", "إطلاق النظام على بنية سحابية متقدمة مع مراقبة حية للمقاييس (Monitoring) وتقديم توثيق كامل ودعم فني لضمان النجاح."),
    ]
    steps_html = "\n".join(
        f"""          <li class="card step spot reveal">
            <span class="num">{n}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </li>"""
        for n, t, d in steps
    )

    services = [
        ("app", "تطبيقات ويب متكاملة (Full Stack)", "بناء منصات الويب السحابية من الصفر، لوحات التحكم المتقدمة (Dashboards)، أنظمة SaaS، وإدارة الصلاحيات بكفاءة وأمان."),
        ("api", "أنظمة خلفية وواجهات برمجية (APIs)", "تصميم وتطوير RESTful & WebSocket APIs فائقة السرعة، ربط بوابات الدفع الإلكتروني، وتكامل الخدمات الخارجية مع قواعد بيانات مهيأة للأحمال العالية."),
        ("ui", "واجهات مستخدم سريعة وتفاعلية (UI/UX)", "تحويل التصاميم إلى واجهات حية متجاوبة 100% بنعومة 60FPS مع تجربة استخدام مدروسة تعزز معدلات التحويل ورضا الزوار."),
        ("bot", "أتمتة وبوتات ذكية مخصصة (Automation)", "أتمتة العمليات اليومية المعقدة، وبناء بوتات تيليجرام وسيرفرات ذكية تقوم بمهام الإدارة، التنبيهات، والربط اللحظي على مدار 24/7."),
    ]
    services_html = "\n".join(
        f"""          <div class="card service-card spot reveal">
            <div class="service-badge">حل تقني متكامل</div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>"""
        for _, title, desc in services
    )

    testimonials = [
        ("أحمد كمال", "مؤسس منصة تقنية", "العمل مع Lynox كان نقطة تحول لمشروعنا؛ سرعة تسليم مذهلة وكود نظيف جداً وموثق جعل إضافة ميزات جديدة لاحقاً في غاية السهولة."),
        ("م. سارة منصور", "مديرة منتج", "احترافية نادرة في فهم احتياجات العمل وحلها برمجياً. بنى لنا نظام إدارة وأتمتة يعمل على مدار الساعة بثبات 100% وبدون أي أعطال."),
        ("كريم العطار", "استشاري حلول رقمية", "دقة متناهية في المواعيد، واهتمام غير عادي بسرعة التحميل وأمان البيانات. إذا أردت عملاً يفوق التوقعات فـ Lynox هو خيارك الأول."),
    ]
    test_html = "\n".join(
        f"""          <div class="card test-card spot reveal">
            <div class="test-stars">★★★★★</div>
            <p class="test-quote">“{quote}”</p>
            <div class="test-author">
              <strong>{name}</strong>
              <span>{role}</span>
            </div>
          </div>"""
        for name, role, quote in testimonials
    )

    faqs = [
        ("ما هي طبيعة المشاريع التي يمكنك تنفيذها؟", "أنفذ مشاريع الويب المتكاملة بكافة مراحلها: من المنصات الخدمية ولوحات التحكم، إلى واجهات الـ APIs، وبوتات الأتمتة المتقدمة، وتطوير أداء وأمان المواقع القائمة."),
        ("كيف نضمن جودة وسرعة الكود المُسلّم؟", "أتبع معايير هندسية صارمة: كود معياري نظيف، فصل تام لطبقات البيانات (Clean Architecture)، حماية من الثغرات، وتحسين كامل لسرعة الاستجابة لتصل لمعدل أداء قياسي."),
        ("هل تقدم دعماً فنياً بعد انتهاء المشروع؟", "بكل تأكيد. كل مشروع يأتي مع فترة دعم وضمان تقني لمعالجة أي استفسارات أو تعديلات، مع توثيق شامل وسهل الفهم لطريقة إدارة النظام."),
        ("كيف نبدأ الخطوة الأولى للتعاون؟", "يمكنك التواصل معي مباشرة عبر صفحة التواصل أو واتساب مع نبذة عن فكرتك أو متطلباتك؛ وسأقوم بمراجعتها وتقديم استشارة وخطة تنفيذ واضحة بالمواعيد والتكلفة."),
    ]
    faq_html = "\n".join(
        f"""        <details class="card faq-item reveal">
          <summary><span>{q}</span><i class="faq-icon">+</i></summary>
          <div class="faq-body"><p>{a}</p></div>
        </details>"""
        for q, a in faqs
    )

    return (
        head("Lynox — مطور Full Stack وحلول ويب متقدمة",
             "Lynox مطور Full Stack يصنع حلولاً رقمية استثنائية، واجهات فائقة السرعة، وبنية خلفية عالية الموثوقية من الفكرة حتى الإنتاج.", "", schema)
        + header("index.html")
        + f"""
  <main id="main">

    <!-- HERO -->
    <section class="wrap hero">
      <div class="wordmark" aria-hidden="true">LYNOX</div>
      <div class="hero-copy">
        <div class="eyebrow reveal">
          <span class="pulse"></span>
          <span class="avail-text">متاح للمشاريع الجديدة والعمل الحر</span>
          <i class="sep"></i>
          <span class="name-en">Lynox</span>
        </div>
        <h1 class="hero-title" data-split>مطور <span class="latin">Full Stack</span> يصنع حلولاً <span class="grad">رقمية استثنائية.</span> <span class="muted">أحوّل الأفكار المعقدة إلى منتجات سريعة، آمنة، وقابلة للتوسع.</span></h1>
        <p class="hero-lede reveal">متخصص في هندسة النظم الخلفية القوية وبناء واجهات مستخدم سلسة وفائقة التفاعل. أعمل معك كشريك تقني ملتزم لضمان نجاح منتجك من الفكرة وحتى الإنتاج بأعلى معايير الجودة.</p>
        <div class="actions reveal">
          <a class="btn btn-primary" href="projects.html" data-magnetic>استكشف الأعمال {ARROW_L}</a>
          <a class="btn btn-accent" href="contact.html" data-magnetic>طلب مشروع / استشارة</a>
          <a class="btn btn-ghost" href="#term">التيرمنال ❯</a>
        </div>
      </div>
      {PORTRAIT}
    </section>

    <!-- METRICS & IMPACT STATS -->
    <section class="wrap stats-sec">
      <div class="stats-grid reveal">
        <div class="stat-card">
          <div class="stat-num" data-counter="25" data-suffix="+">+25</div>
          <div class="stat-label">مشروع ناجح ومسلّم</div>
          <div class="stat-hint">منصات وبوتات وتطبيقات ويب</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" data-counter="99.9" data-suffix="%" data-decimal="1">99.9%</div>
          <div class="stat-label">استقرار وجاهزية الأنظمة</div>
          <div class="stat-hint">أداء موثوق على مدار الساعة</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">&lt; 200ms</div>
          <div class="stat-label">سرعة استجابة فائقة</div>
          <div class="stat-hint">كود محسّن وخالٍ من التعقيد</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" data-counter="100" data-suffix="%">100%</div>
          <div class="stat-label">التزام بالمواعيد والجودة</div>
          <div class="stat-hint">رضا تام وضمان فني شامل</div>
        </div>
      </div>
    </section>

    {marquee()}

    <!-- SERVICES -->
    <section class="wrap section">
      <div class="section-head reveal">
        <div>
          <span class="kicker" data-scramble>// solutions &amp; services</span>
          <h2 class="section-title">ماذا أقدم لعملائي</h2>
        </div>
        <p class="section-sub">حلول برمجية مصممة خصيصاً لمساعدة رواد الأعمال والشركات على النمو بثبات تقني راسخ.</p>
      </div>
      <div class="services-grid">
{services_html}
      </div>
    </section>

    <!-- MANIFESTO -->
    <section class="wrap section manifesto-sec">
      <span class="kicker reveal" data-scramble>// engineering philosophy</span>
      <p class="manifesto" data-lit>أؤمن بأن الكود النظيف والبسيط يتفوق دائمًا على الكود “الذكي المعقد” الذي يصعب صيانته غدًا.</p>
      <div class="big-eq" aria-hidden="true">clean <b>&gt;</b> clever</div>
    </section>

    <!-- WORKFLOW -->
    <section class="wrap section">
      <div class="section-head reveal">
        <div>
          <span class="kicker" data-scramble>// development pipeline</span>
          <h2 class="section-title">منهجية العمل وضمان النجاح</h2>
        </div>
        <p class="section-sub">ثلاث محطات رئيسية تضمن وضوح الرؤية ودقة التسليم من أول يوم.</p>
      </div>
      <ol class="steps">
{steps_html}
      </ol>
    </section>

    <!-- BENTO PLAYGROUND -->
    <section class="wrap section tight">
      <div class="section-head reveal">
        <div>
          <span class="kicker" data-scramble>// interactive playground</span>
          <h2 class="section-title">مختبر المطور والمشاريع</h2>
        </div>
        <p class="section-sub">تحكّم وتفاعل مع بيئة العمل واستكشف الكود مباشرة.</p>
      </div>

      <div class="bento">
        <div class="card editor-card reveal">
          <div class="editor term" id="term">
            <div class="editor-bar">
              <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
              <span class="editor-tab">lynox@workspace — zsh</span>
              <span class="editor-pill">تفاعلي بالكامل</span>
            </div>
            <div class="term-body" id="term-out" role="log" aria-live="polite" aria-label="مخرجات التيرمنال"></div>
            <form class="term-form" id="term-form" autocomplete="off">
              <label class="term-ps" for="term-in">lynox ❯</label>
              <input id="term-in" type="text" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="اكتب أمراً… جرّب help أو stats أو services" aria-label="اكتب أمر">
            </form>
            <div class="term-chips">
              <button type="button" data-cmd="help">help</button>
              <button type="button" data-cmd="whoami">whoami</button>
              <button type="button" data-cmd="services">services</button>
              <button type="button" data-cmd="stats">stats</button>
              <button type="button" data-cmd="projects">projects</button>
              <button type="button" data-cmd="cat profile.ts">cat profile.ts</button>
              <button type="button" data-cmd="theme cyan">theme cyan</button>
              <button type="button" data-cmd="contact">contact</button>
            </div>
          </div>
        </div>

        <a class="card spot reveal featured-spot-card" href="{PROJECT_URL}" target="_blank" rel="noopener">
          {PREVIEW_URANUS}
          <div class="project-mini-meta">
            <span class="badge live">● أحدث منصة قيد التشغيل</span>
            <span class="badge">Full Stack + Bot Engine</span>
          </div>
          <h3 class="project-title">URANUS BOT &amp; PLATFORM</h3>
          <p class="project-desc">نظام سحابي وبوت متطور لإدارة الخوادم، الأتمتة اللحظية، وتوزيع المهام بكفاءة استثنائية.</p>
          <span class="more">معاينة المنصة الحية {ARROW}</span>
        </a>

        <article class="card spot reveal">
          <h3 class="card-title">معايير الهندسة البرمجية</h3>
          <ul class="principles">
            <li><strong>Clean Architecture</strong><span>معمارية واضحة سهلة التوسع</span></li>
            <li><strong>Type Safety</strong><span>كود قوي مدعوم بـ TypeScript</span></li>
            <li><strong>Security First</strong><span>حماية وتشفير البيانات والـ APIs</span></li>
            <li><strong>Zero Bloat</strong><span>أداء خفيف وخالٍ من الحزم الزائدة</span></li>
          </ul>
        </article>

        <section class="card reveal" data-gh hidden>
          <h3 class="card-title">مستودعات GitHub الحية</h3>
          <ul class="repo-list" style="grid-template-columns:1fr" data-gh-list data-limit="2"></ul>
        </section>

        <section class="card reveal" data-stack>
          <h3 class="card-title">ترسانة التقنيات الأساسية</h3>
          <div data-stack-list></div>
        </section>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="wrap section">
      <div class="section-head reveal">
        <div>
          <span class="kicker" data-scramble>// endorsements &amp; trust</span>
          <h2 class="section-title">آراء العملاء والشركاء</h2>
        </div>
        <p class="section-sub">شهادات حقيقية من أشخاص عملوا معي على مشاريع متنوعة.</p>
      </div>
      <div class="testimonials-grid">
{test_html}
      </div>
    </section>

    <!-- FAQ -->
    <section class="wrap section tight">
      <div class="section-head reveal">
        <div>
          <span class="kicker" data-scramble>// faq</span>
          <h2 class="section-title">الأسئلة الشائعة</h2>
        </div>
        <p class="section-sub">إجابات سريعة وشفافة لأهم تساؤلات العملاء قبل بدء العمل.</p>
      </div>
      <div class="faq-list">
{faq_html}
      </div>
    </section>

    <!-- CTA -->
    <section class="wrap">
      <div class="cta reveal">
        <span class="badge live" style="margin-bottom:16px;">متاح للتعاقد والمشاريع</span>
        <h2 class="cta-text">عندك فكرة مشروع أو تحدي برمجي؟ دعنا نحققه سوياً بأفضل صورة.</h2>
        <p class="cta-sub">استشارة مجانية لمناقشة المتطلبات، والبدء مباشرة بخطة تنفيذية واضحة ومحددة.</p>
        <div class="actions">
          <a class="btn btn-primary" href="contact.html" data-magnetic>تواصل وابدأ الآن {ARROW_L}</a>
          <button class="btn btn-ghost" type="button" data-copy-email>نسخ الإيميل</button>
        </div>
      </div>
    </section>

  </main>
"""
        + FOOTER
    )


def page_projects():
    projects_data = [
        {
            "tag": "● منصة حية قيد التشغيل",
            "tag_class": "live",
            "cat": "fullstack",
            "title": "URANUS BOT & PLATFORM",
            "desc": "منصة سحابية متكاملة وبوت تشغيلي لإدارة الخوادم، أتمتة الإعدادات، والتحكم اللحظي بالأجهزة والعمليات مع لوحة تحكم سريعة.",
            "stack": ["Node.js", "TypeScript", "WebSocket", "Linux / Bash", "TailwindCSS"],
            "url": PROJECT_URL,
            "url_label": "معاينة المنصة الحية",
            "featured": True,
        },
        {
            "tag": "SaaS Platform",
            "tag_class": "featured",
            "cat": "fullstack",
            "title": "NEXUS CLOUD DASHBOARD",
            "desc": "لوحة تحكم إدارية سحابية متطورة تتيح للشركات تحليل البيانات بزمن حقيقي، إدارة الصلاحيات المتعددة، ورسم خرائط الأداء التفاعلية.",
            "stack": ["React / Next.js", "FastAPI", "PostgreSQL", "Redis", "Chart.js"],
            "url": "contact.html?project=nexus",
            "url_label": "طلب حل مماثل",
            "featured": False,
        },
        {
            "tag": "High Performance",
            "tag_class": "",
            "cat": "backend",
            "title": "PULSE API GATEWAY & AUTH",
            "desc": "خادم وسيط فائق الأداء للواجهات البرمجية مزود بنظام مصادقة JWT مزدوج، حماية ضد هجمات DDoS، وتوثيق تفاعلي فوري.",
            "stack": ["Go / Node.js", "Docker", "Rate-Limiting", "RESTful", "Swagger"],
            "url": "contact.html?project=pulse",
            "url_label": "طلب معمارية مماثلة",
            "featured": False,
        },
        {
            "tag": "FinTech Solution",
            "tag_class": "",
            "cat": "fullstack",
            "title": "CYBERPAY CHECKOUT ENGINE",
            "desc": "محرك دفع وتكامل مالي سلس يربط المتاجر الإلكترونية بعدة بوابات دفع دولية ومحلية، مع دعم Webhooks وتأكيد العمليات المشفرة.",
            "stack": ["TypeScript", "Stripe API", "PostgreSQL", "Webhook Engine", "Security"],
            "url": "contact.html?project=cyberpay",
            "url_label": "استفسر عن الحل",
            "featured": False,
        },
        {
            "tag": "Automation & Bot",
            "tag_class": "live",
            "cat": "bots",
            "title": "SENTINEL SERVER BOT",
            "desc": "روبوت ذكي لمراقبة صحة الخوادم وإرسال تنبيهات فورية عبر تيليجرام مع تقارير حية عن استهلاك الذاكرة والمعالج والأعطال.",
            "stack": ["Python", "Telegram Bot API", "Linux Daemon", "SQLite", "AsyncIO"],
            "url": "contact.html?project=sentinel",
            "url_label": "طلب بوت مخصص",
            "featured": False,
        },
        {
            "tag": "UI / Design System",
            "tag_class": "",
            "cat": "ui",
            "title": "AURORA DARK UI KIT",
            "desc": "نظام تصميم ومكتبة مكونات ويب تفاعلية مبنية بأداء فائق وتأثيرات زجاجية (Glassmorphism) سينمائية بدون أي إبطاء للمتصفح.",
            "stack": ["Vanilla CSS", "Modern JS", "A11y", "SVG Animation", "Responsive"],
            "url": "contact.html?project=aurora",
            "url_label": "تصميم واجهة مخصصة",
            "featured": False,
        },
    ]

    cards_html = []
    for p in projects_data:
        stack_spans = "".join(f'<span class="chip-tag">{s}</span>' for s in p["stack"])
        is_feat = " featured" if p.get("featured") else ""
        badge_cls = f"badge {p['tag_class']}".strip()
        link_target = ' target="_blank" rel="noopener"' if p["url"].startswith("http") else ""
        
        preview_markup = PREVIEW_URANUS if p.get("featured") else f"""
          <div class="project-mockup" aria-hidden="true">
            <div class="mockup-header"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="mockup-title">{p['title']}</span></div>
            <div class="mockup-content"><div class="mock-grid"><div class="mock-sidebar"></div><div class="mock-main"><i></i><i></i></div></div></div>
          </div>"""

        cards_html.append(f"""
          <div class="card project-item spot reveal{is_feat}" data-cat="{p['cat']}">
            <div class="project-copy">
              <span class="{badge_cls}">{p['tag']}</span>
              <h2 class="project-title">{p['title']}</h2>
              <p class="project-desc">{p['desc']}</p>
              <div class="project-stack">{stack_spans}</div>
              <a class="more" href="{p['url']}"{link_target}>{p['url_label']} {ARROW}</a>
            </div>
            {preview_markup}
          </div>""")

    all_cards = "\n".join(cards_html)

    return (
        head("المشاريع والأعمال — Lynox", "استكشف أبرز مشاريع Lynox: منصات Full Stack، أنظمة سحابية، واجهات فائقة الأداء، وبوتات أتمتة مخصصة.", "projects.html")
        + header("projects.html")
        + f"""
  <main id="main">

    <div class="wrap">
      <div class="page-head">
        <span class="kicker reveal" data-scramble>// portfolio &amp; case studies</span>
        <h1 class="page-title reveal">أعمال مختارة ومشاريع منجزة</h1>
        <p class="page-lede reveal">نماذج واقعية من الحلول البرمجية التي بنيتها: من المنصات التشغيلية الحية حتى الأنظمة الخلفية المعقدة ولوحات التحكم الذكية.</p>

        <!-- PROJECT FILTERS -->
        <div class="project-filters reveal" role="tablist" aria-label="تصفية المشاريع">
          <button class="filter-btn is-active" type="button" data-filter="all">كافة المشاريع</button>
          <button class="filter-btn" type="button" data-filter="fullstack">تطبيقات Full Stack</button>
          <button class="filter-btn" type="button" data-filter="backend">أنظمة خلفية وAPIs</button>
          <button class="filter-btn" type="button" data-filter="bots">بوتات وأتمتة</button>
          <button class="filter-btn" type="button" data-filter="ui">واجهات وتصميم</button>
        </div>
      </div>

      <div class="section tight">
        <div class="project-grid" id="project-list">
{all_cards}
        </div>
      </div>

      <!-- GITHUB LIVE REPOS -->
      <section class="section tight" data-gh hidden>
        <div class="section-head reveal">
          <div>
            <span class="kicker" data-scramble>// open source</span>
            <h2 class="section-title small">مستودعات برمجية مفتوحة المصدر</h2>
          </div>
        </div>
        <ul class="repo-list" data-gh-list></ul>
      </section>

      <!-- BOTTOM CTA -->
      <section class="cta reveal">
        <h2 class="cta-text">هل لديك مشروع ترغب في تنفيذه بنفس هذه المعايير؟</h2>
        <p class="cta-sub">دعنا نتحدث عن فكرتك ونحولها إلى واقع ملموس في وقت قياسي.</p>
        <div class="actions">
          <a class="btn btn-primary" href="contact.html" data-magnetic>اطلب مشروعك الآن {ARROW_L}</a>
        </div>
      </section>

    </div>
  </main>
"""
        + FOOTER
    )


def page_about():
    milestones = [
        ("البداية والشغف بالهندسة", "انطلاق الرحلة من حب استكشاف خوارزميات النظم، وفهم كواليس المعالجة والشبكات وعلوم الحاسب من العمق."),
        ("احتراف Full Stack والأداء العالي", "بناء وتطوير عشرات الحلول البرمجية، التخصص في ربط الـ APIs المعقدة بواجهات مستخدم سلسة وخفيفة الوزن."),
        ("التركيز على حل مشاكل البيزنس الحقيقية", "العمل مع عملاء ومشاريع تقنية كشريك استراتيجي يضمن أعلى عائد استثماري وسرعة وصول للسوق (Time to Market)."),
    ]
    mile_html = "\n".join(
        f"""          <div class="mile-card card spot reveal">
            <span class="mile-step">0{i+1}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </div>"""
        for i, (t, d) in enumerate(milestones)
    )

    return (
        head("من أنا والخبرات — Lynox", "تعرف على Lynox: فلسفة العمل، التقنيات التي يتقنها، وخبرته في بناء أنظمة الويب عالية الأداء.", "about.html")
        + header("about.html")
        + f"""
  <main id="main">

    <div class="wrap">
      <div class="page-head">
        <span class="kicker reveal" data-scramble>// about developer</span>
        <h1 class="page-title reveal">الشغف، الخبرة، وفلسفة البناء</h1>
        <p class="page-lede reveal">مهندس برمجيات ومطور Full Stack أركز على الحلول الجذرية، الكود المستدام، وتجربة المستخدم الخالية من العقبات.</p>
      </div>

      <div class="about-grid">
        <aside class="card profile reveal">
          <figure class="portrait" data-tilt>
            <img src="avatar.jpg" width="736" height="766" alt="صورة Lynox الشخصية">
            <img class="gl g1" src="avatar.jpg" alt="" aria-hidden="true"><img class="gl g2" src="avatar.jpg" alt="" aria-hidden="true">
            <span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>
          </figure>
          <h2>Lynox</h2>
          <p class="role" dir="ltr">Lead Full Stack Developer</p>
          <div class="profile-stats">
            <div><strong>+25</strong><span>مشروع</span></div>
            <div><strong>99.9%</strong><span>استقرار</span></div>
            <div><strong>3+</strong><span>سنوات</span></div>
          </div>
          <div class="actions">
            <a class="btn btn-primary" href="contact.html">تواصل معايا</a>
            <a class="btn btn-ghost" data-cv hidden href="#">السيرة الذاتية (CV)</a>
          </div>
        </aside>

        <div style="display:grid;gap:18px">
          <section class="card prose reveal">
            <h2 class="card-title">عنّي ورؤيتي في العمل</h2>
            <p>أنا Lynox، مهندس برمجيات ومطور Full Stack أرى البرمجة كفن هندسي لحل المشكلات المعقدة بأبسط الطرق وأكثرها أناقة. لا أكتفي بمجرد كتابة كود يؤدي الغرض، بل أهتم بمتانة المعمارية، سرعة المعالجة، وسهولة القراءة والصيانة لسنوات قادمة.</p>
            <p>على مدار مسيرتي طوّرت منصات ويب، خوادم وسيطة، وبوتات وأنظمة أتمتة خفيفة وسريعة. أؤمن بأن نجاح أي منتج تقني يبدأ من فهم عميق لاحتياجات المستخدم وأهداف العمل الحقيقية.</p>
          </section>

          <section class="card spot reveal">
            <h2 class="card-title">المحطات والمسيرة</h2>
            <div class="milestones-grid">
{mile_html}
            </div>
          </section>

          <section class="card reveal" data-stack>
            <h2 class="card-title">المهارات والتقنيات التي أتقنها</h2>
            <div data-stack-list></div>
          </section>

          <section class="card reveal" data-exp>
            <h2 class="card-title">المسار المهني وسجل الخبرات</h2>
            <ul class="timeline" data-exp-list></ul>
          </section>
        </div>
      </div>
    </div>
  </main>
"""
        + FOOTER
    )


ICONS = {
    "github": '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.98 5.24.98 11.52c0 4.94 3.2 9.13 7.65 10.61.56.1.76-.24.76-.54 0-.27-.01-1.16-.02-2.11-3.11.68-3.77-1.32-3.77-1.32-.51-1.3-1.24-1.64-1.24-1.64-1.02-.7.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.71 2.62 1.22 3.26.93.1-.72.39-1.22.71-1.5-2.48-.28-5.1-1.24-5.1-5.53 0-1.22.44-2.22 1.15-3-.11-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.22 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.3-2.63 5.24-5.13 5.52.4.35.76 1.04.76 2.1 0 1.51-.01 2.73-.01 3.1 0 .3.2.65.77.54 4.45-1.48 7.65-5.67 7.65-10.61C23.02 5.24 18.27.5 12 .5Z"/></svg>',
    "linkedin": '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.59 0 4.25 2.36 4.25 5.44v6.3ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z"/></svg>',
    "x": '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117Z"/></svg>',
    "telegram": '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.94 4.5 18.6 20.06c-.25 1.1-.9 1.37-1.83.85l-5.06-3.73-2.44 2.35c-.27.27-.5.5-1.02.5l.36-5.16 9.4-8.5c.41-.36-.09-.56-.63-.2L6.03 12.6 1 11.03c-1.1-.34-1.11-1.1.23-1.63L20.5 3.15c.92-.34 1.72.22 1.44 1.35Z"/></svg>',
    "whatsapp": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.6-5.4A8.5 8.5 0 1 1 21 11.5Z"/></svg>',
    "email": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
}
LABELS = [
    ("whatsapp", "واتساب", "محادثة فورية مباشرة"),
    ("telegram", "تيليجرام", "رسائل سريعة واستفسارات"),
    ("email", "البريد الإلكتروني", "للمراسلات الرسمية والملفات"),
    ("linkedin", "LinkedIn", "الملف المهني وشبكة الأعمال"),
    ("github", "GitHub", "الأكواد والمستودعات البرمجية"),
    ("x", "X / تويتر", "أحدث الأفكار والمنشورات"),
]


def page_contact():
    rows = "\n".join(
        f'''        <a class="link-row reveal" href="#" data-link="{k}">
          <span class="link-icon">{ICONS[k]}</span>
          <div class="link-text-wrap">
            <span class="link-title">{t}</span>
            <span class="link-desc">{sub}</span>
          </div>
          <span class="link-note"></span>
        </a>'''
        for k, t, sub in LABELS
    )
    return (
        head("تواصل واطلب مشروعك — Lynox", "تواصل مباشرة مع Lynox لمناقشة مشروعك، طلب استشارة برمجية، أو استفسار عن خدمات التطوير.", "contact.html")
        + header("contact.html")
        + f"""
  <main id="main">

    <div class="wrap">
      <div class="page-head">
        <span class="kicker reveal" data-scramble>// start a project</span>
        <h1 class="page-title reveal">دعنا نبني شيئاً استثنائياً معاً</h1>
        <p class="page-lede reveal">سواء كانت لديك فكرة تطبيق جديد، ترغب في تطوير نظام قائم، أو تحتاج استشارة برمجية دقيقة — أنا هنا لمساعدتك على إطلاق منتجك بأعلى كفاءة.</p>
      </div>

      <div class="contact-layout">

        <!-- INTERACTIVE INQUIRY FORM -->
        <section class="card form-card spot reveal">
          <div class="form-header">
            <h2 class="card-title">نموذج حجز مشروع سريع</h2>
            <p class="form-sub">املأ التفاصيل البسيطة وسأعود إليك بدراسة وخطة مقترحة في غضون ساعتين.</p>
          </div>

          <form id="project-form" class="inquiry-form" autocomplete="off">
            <div class="form-group">
              <label for="f-name">الاسم / اسم الشركة</label>
              <input id="f-name" type="text" placeholder="مثال: أحمد محمد / شركة التقنية" required>
            </div>

            <div class="form-group">
              <label for="f-contact">البريد الإلكتروني أو رقم الواتساب</label>
              <input id="f-contact" type="text" placeholder="contact@example.com أو +201..." required>
            </div>

            <div class="form-group">
              <label>نوع المشروع المطلوب</label>
              <div class="form-chips" role="radiogroup" aria-label="نوع المشروع">
                <button type="button" class="form-chip is-selected" data-type="Full Stack App">تطبيق ويب كامل</button>
                <button type="button" class="form-chip" data-type="API / Backend">واجهات برمجية وAPIs</button>
                <button type="button" class="form-chip" data-type="Bot / Automation">بوت أو نظام أتمتة</button>
                <button type="button" class="form-chip" data-type="UI / UX Revamp">تحسين واجهات وأداء</button>
              </div>
            </div>

            <div class="form-group">
              <label for="f-details">نبذة عن فكرة المشروع أو متطلباتك</label>
              <textarea id="f-details" rows="4" placeholder="اكتب وصفاً موجزاً لما ترغب في بنائه أو المشكلة التي تسعى لحلها..." required></textarea>
            </div>

            <div class="form-actions">
              <button class="btn btn-primary" type="submit" id="btn-send-email">
                إرسال الطلب عبر البريد {ARROW_L}
              </button>
              <button class="btn btn-accent" type="button" id="btn-send-whatsapp">
                إرسال مباشر عبر واتساب
              </button>
              <button class="btn btn-ghost" type="button" id="btn-copy-summary">
                نسخ ملخص الرسالة
              </button>
            </div>

            <div class="form-footnote">
              <span>🔒 التزام تام بالسرية المهنية واتفاقيات عدم الإفصاح (NDA).</span>
            </div>
          </form>
        </section>

        <!-- DIRECT CHANNELS -->
        <div class="contact-side">
          <div class="card info-box reveal">
            <div class="info-badge">
              <i class="status-dot"></i>
              <span>متوسط وقت الرد: أقل من ساعتين</span>
            </div>
            <h3>قنوات التواصل المباشرة</h3>
            <p>اختر القناة الأنسب لك لبدء المحادثة فوراً.</p>
          </div>

          <div class="links">
{rows}
          </div>
        </div>

      </div>
    </div>
  </main>
"""
        + FOOTER
    )


def page_404():
    return (
        head("الصفحة غير موجودة — Lynox", "عذراً، الصفحة التي تحاول الوصول إليها غير موجودة أو تم نقلها.", "404.html", '<meta name="robots" content="noindex">\n')
        + header("")
        + f"""
  <main id="main">
    <div class="wrap notfound">
      <div class="reveal">
        <div class="code">404</div>
        <h1 class="page-title">الصفحة غير موجودة</h1>
        <p>ربما كتبت الرابط بشكل غير صحيح أو تم نقل الصفحة إلى مسار آخر.</p>
        <div class="actions" style="justify-content:center">
          <a class="btn btn-primary" href="index.html">العودة للرئيسية {ARROW_L}</a>
          <a class="btn btn-ghost" href="projects.html">استعراض المشاريع</a>
        </div>
      </div>
    </div>
  </main>
"""
        + FOOTER
    )


PAGES = {
    "index.html": page_index,
    "projects.html": page_projects,
    "about.html": page_about,
    "contact.html": page_contact,
    "404.html": page_404,
}

if __name__ == "__main__":
    for name, fn in PAGES.items():
        (ROOT / name).write_text(fn(), encoding="utf-8")
        print("wrote", name)
    today = date.today().isoformat()
    urls = "\n".join(
        f"  <url><loc>{SITE}/{'' if n == 'index.html' else n}</loc><lastmod>{today}</lastmod></url>"
        for n in PAGES if n != "404.html"
    )
    (ROOT / "sitemap.xml").write_text(
        f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}\n</urlset>\n',
        encoding="utf-8",
    )
    print("wrote sitemap.xml")
