#!/usr/bin/env python3
"""Generates the static pages (index, projects, about, contact, 404) from shared partials.

Why: header / footer / palette / <head> are identical on every page. Edit them once here,
run `python3 tools/build.py`, commit the generated .html files. No runtime dependencies.
"""
from pathlib import Path
from datetime import date

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://lynox.org"
FONTS = ("https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800"
         "&family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;500&display=swap")
PROJECT_URL = "https://lynox.hidenplay.net/"
PROJECT_HOST = "lynox.hidenplay.net"

NAV = [("index.html", "الرئيسية"), ("projects.html", "المشاريع"), ("about.html", "من أنا"), ("contact.html", "تواصل")]

ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 17 7 7M7 17V7h10"/></svg>'
ARROW_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>'


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
<script>document.documentElement.classList.add('js');try{{if(!sessionStorage.getItem('lynox-intro'))document.documentElement.classList.add('intro');if(sessionStorage.getItem('lynox-nav')){{document.documentElement.classList.add('arriving');sessionStorage.removeItem('lynox-nav')}}}}catch(e){{}}</script>
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
        <a class="brand" href="index.html" aria-label="Lynox — الرئيسية"><img src="avatar.jpg" width="32" height="32" alt=""><span>LYNOX</span></a>
        <nav class="site-nav" aria-label="التنقل الرئيسي">
{links}
        </nav>
        <button class="kbd-btn" type="button" data-open-palette aria-label="بحث وأوامر سريعة"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><span class="kbd-label">بحث</span><kbd>Ctrl K</kbd></button>
      </div>
    </div>
  </header>
"""


FOOTER = """
  <footer class="site-footer">
    <div class="wrap">
      <span>© <span data-year>2026</span> Lynox — كل الحقوق محفوظة</span>
      <nav class="foot-nav" aria-label="روابط التذييل">
        <a href="projects.html">المشاريع</a><a href="about.html">من أنا</a><a href="contact.html">تواصل</a>
      </nav>
      <span>مبني بـ HTML وCSS وJS من غير frameworks</span>
    </div>
  </footer>

  <dialog id="palette" class="palette" aria-label="التنقل السريع">
    <div class="pal-box">
      <input id="pal-input" class="pal-input" type="text" placeholder="ابحث عن صفحة أو أمر..." autocomplete="off" role="combobox" aria-expanded="true" aria-controls="pal-list">
      <ul id="pal-list" class="pal-list" role="listbox" aria-label="النتايج"></ul>
      <div class="pal-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> للتنقل</span><span><kbd>Enter</kbd> للفتح</span><span><kbd>Esc</kbd> للإغلاق</span></div>
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
        <span class="tag t1"><i></i>clean &gt; clever</span>
        <span class="tag t2"><i></i>API ⇄ UI</span>
        <span class="tag t3"><i></i>ship it.</span>
      </div>"""

PREVIEW = f"""<div class="preview" aria-hidden="true">
            <div class="preview-bar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="preview-url">{PROJECT_HOST}</span></div>
            <div class="preview-body"><div class="sb"><i></i><i></i><i></i><i></i></div><div class="mn"><b></b><b></b><b></b></div></div>
          </div>"""

MARQUEE_ITEMS = ["Full Stack", "API Design", "Frontend", "حل المشاكل", "Clean Code", "كود نظيف", "تعلّم مستمر", "Teamwork", "عمل جماعي"]


def marquee():
    row = "".join(f"<span>{t}</span>" for t in MARQUEE_ITEMS)
    rev = "".join(f"<span>{t}</span>" for t in reversed(MARQUEE_ITEMS))
    return (f'<div class="marquee-stack" aria-hidden="true">'
            f'<div class="marquee"><div class="marquee-track">{row}{row}</div></div>'
            f'<div class="marquee alt"><div class="marquee-track rev">{rev}{rev}</div></div></div>')


def step_icon(kind):
    paths = {
        "search": '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
        "api": '<path d="M8 6 3 12l5 6M16 6l5 6-5 6M14 4l-4 16"/>',
        "ui": '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 14h3"/>',
    }
    return f'<span class="glyph"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{paths[kind]}</svg></span>'


def page_index():
    schema = ('<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Lynox",'
              f'"jobTitle":"Full Stack Developer","image":"{SITE}/avatar.jpg","url":"{SITE}/"}}</script>\n')
    steps = [
        ("01", "search", "أفهم المشكلة الأول", "قبل أي سطر كود بحدد المشكلة بوضوح وإيه اللي المستخدم محتاجه فعلًا، مش اللي شكله حلو بس."),
        ("02", "api", "أصمّم الـ API", "عقد واضح وبسيط بين الواجهة والخلفية، سهل يتفهم وسهل يتغيّر من غير ما يتكسّر."),
        ("03", "ui", "أبني الواجهة", "واجهة نضيفة وسريعة ومظبوطة على كل الشاشات، لأن التجربة هي اللي بيحسّها الناس."),
    ]
    steps_html = "\n".join(
        f"""          <li class="card step spot reveal">{step_icon(i)}<span class="num">{n}</span><h3>{t}</h3><p>{d}</p></li>"""
        for n, i, t, d in steps
    )
    return (
        head("Lynox — مطور Full Stack", "Lynox مطور Full Stack بيبني أشياء نضيفة وشغّالة، من تصميم الـ API لحد الواجهة.", "", schema)
        + header("index.html")
        + f"""
  <main id="main">

    <section class="wrap hero">
      <div class="wordmark" aria-hidden="true">LYNOX</div>
      <div class="hero-copy">
        <a class="eyebrow reveal" href="about.html"><span class="pulse"></span><span class="name-en">Lynox</span><i class="sep"></i><span dir="ltr">Full Stack Developer</span></a>
        <h1 class="hero-title" data-split>مطور <span class="latin">Full Stack</span> بيبني أشياء <span class="grad">نضيفة وشغّالة.</span> <span class="muted">من الفكرة للكود، ومن الكود للناس.</span></h1>
        <p class="hero-lede reveal">بشتغل من تصميم الـ API لحد بناء الواجهة اللي المستخدم بيتعامل معاها، وبفضّل الكود النضيف والبسيط على الكود "الذكي".</p>
        <div class="actions reveal">
          <a class="btn btn-primary" href="projects.html" data-magnetic>شوف المشاريع {ARROW_L}</a>
          <a class="btn btn-ghost" href="contact.html" data-magnetic>تواصل معايا</a>
          <a class="btn btn-ghost" data-cv hidden href="#">السيرة الذاتية</a>
        </div>
      </div>
      {PORTRAIT}
    </section>

    {marquee()}

    <section class="wrap section manifesto-sec">
      <span class="kicker reveal" data-scramble>// manifesto</span>
      <p class="manifesto" data-lit>بحب الكود النضيف والبسيط أكتر من الكود “الذكي” اللي محدش هيفهمه بعد سنة.</p>
      <div class="big-eq" aria-hidden="true">clean <b>&gt;</b> clever</div>
    </section>

    <section class="wrap section">
      <div class="section-head reveal">
        <div><span class="kicker" data-scramble>// workflow</span><h2 class="section-title">طريقتي في الشغل</h2></div>
        <p class="section-sub">ثلاث خطوات بسيطة، من الفكرة لحد حاجة الناس بتستخدمها.</p>
      </div>
      <ol class="steps">
{steps_html}
      </ol>
    </section>

    <section class="wrap section tight">
      <div class="bento">
        <div class="card editor-card reveal">
          <div class="editor term" id="term">
            <div class="editor-bar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="editor-tab">lynox@web — zsh</span></div>
            <div class="term-body" id="term-out" role="log" aria-live="polite" aria-label="مخرجات التيرمنال"></div>
            <form class="term-form" id="term-form" autocomplete="off"><label class="term-ps" for="term-in">lynox ❯</label><input id="term-in" type="text" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="اكتب أمر… جرّب help" aria-label="اكتب أمر"></form>
            <div class="term-chips"><button type="button" data-cmd="help">help</button><button type="button" data-cmd="whoami">whoami</button><button type="button" data-cmd="skills">skills</button><button type="button" data-cmd="projects">projects</button><button type="button" data-cmd="cat profile.ts">cat profile.ts</button><button type="button" data-cmd="contact">contact</button></div>
          </div>
        </div>

        <a class="card spot reveal" href="{PROJECT_URL}" target="_blank" rel="noopener">
          {PREVIEW}
          <h2 class="project-title">URANUS BOT</h2>
          <p class="project-desc">موقع تنصيب أورانوس، وأحيانًا لينوكس.</p>
          <span class="more">عرض المشروع {ARROW}</span>
        </a>

        <article class="card reveal">
          <h2 class="card-title">بهتم بإيه</h2>
          <ul class="principles">
            <li>حل المشاكل</li>
            <li>تعلّم مستمر</li>
            <li>كود نظيف</li>
            <li>عمل جماعي</li>
          </ul>
        </article>

        <section class="card reveal" data-gh hidden>
          <h2 class="card-title">من GitHub</h2>
          <ul class="repo-list" style="grid-template-columns:1fr" data-gh-list data-limit="2"></ul>
        </section>

        <section class="card reveal" data-stack hidden>
          <h2 class="card-title">التقنيات</h2>
          <div data-stack-list></div>
        </section>
      </div>

      <div class="cta reveal">
        <p class="cta-text">عندك مشروع أو فكرة؟ كلمني.</p>
        <div class="actions">
          <a class="btn btn-primary" href="contact.html" data-magnetic>تواصل معايا {ARROW_L}</a>
          <button class="btn btn-ghost" type="button" data-copy-email hidden>نسخ الإيميل</button>
        </div>
      </div>
    </section>
  </main>
"""
        + FOOTER
    )


def page_projects():
    return (
        head("المشاريع — Lynox", "شوية من الحاجات اللي اشتغل عليها Lynox.", "projects.html")
        + header("projects.html")
        + f"""
  <main id="main">

    <div class="wrap">
      <div class="page-head">
        <h1 class="page-title reveal">المشاريع</h1>
        <p class="page-lede reveal">شوية من الحاجات اللي اشتغلت عليها.</p>
      </div>

      <div class="section tight">
        <div class="project-grid">
          <a class="card featured spot reveal" href="{PROJECT_URL}" target="_blank" rel="noopener">
            <div class="project-copy">
              <span class="badge live">● أحدث مشروع</span>
              <h2 class="project-title">URANUS BOT</h2>
              <p class="project-desc">موقع تنصيب أورانوس، وأحيانًا لينوكس.</p>
              <span class="more">عرض المشروع {ARROW}</span>
            </div>
            {PREVIEW}
          </a>

          <div class="card is-soon reveal">
            <span class="badge">قريبًا</span>
            <h2 class="project-title">قريب</h2>
            <p class="project-desc">لسه قريب.</p>
          </div>

          <div class="card is-soon reveal">
            <span class="badge">قريبًا</span>
            <h2 class="project-title">ممكن قريب برضو</h2>
            <p class="project-desc">قريب برضو.</p>
          </div>
        </div>
      </div>

      <section class="section tight" data-gh hidden>
        <h2 class="section-title small">من GitHub</h2>
        <ul class="repo-list" data-gh-list></ul>
      </section>
    </div>
  </main>
"""
        + FOOTER
    )


def page_about():
    return (
        head("من أنا — Lynox", "Lynox مطور بيحب المشاكل اللي محتاجة تفكير مش بس تنفيذ.", "about.html")
        + header("about.html")
        + f"""
  <main id="main">

    <div class="wrap">
      <div class="page-head">
        <h1 class="page-title reveal">من أنا</h1>
      </div>

      <div class="about-grid">
        <aside class="card profile reveal">
          <figure class="portrait" data-tilt>
            <img src="avatar.jpg" width="736" height="766" alt="صورة Lynox الشخصية">
            <img class="gl g1" src="avatar.jpg" alt="" aria-hidden="true"><img class="gl g2" src="avatar.jpg" alt="" aria-hidden="true">
            <span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>
          </figure>
          <h2>Lynox</h2>
          <p class="role" dir="ltr">Full Stack Developer</p>
          <div class="actions">
            <a class="btn btn-primary" href="contact.html">تواصل معايا</a>
            <a class="btn btn-ghost" data-cv hidden href="#">السيرة الذاتية</a>
          </div>
        </aside>

        <div style="display:grid;gap:16px">
          <section class="card prose reveal">
            <p>أنا Lynox، مطور بحب أشتغل على المشاكل اللي محتاجة تفكير مش بس تنفيذ. بدأت رحلتي في البرمجة بحب استكشاف إزاي الأنظمة شغالة من جوه، ولسه بحمل نفس الفضول لحد دلوقتي.</p>
            <p>بشتغل غالبًا على مشاريع Full Stack، من تصميم الـ API لحد بناء الواجهة اللي المستخدم بيتعامل معاها. بحب الكود النضيف والبسيط أكتر من الكود "الذكي" اللي محدش هيفهمه بعد سنة.</p>
          </section>

          <section class="card reveal">
            <h2 class="card-title">بهتم بإيه</h2>
            <div class="chips">
              <span class="chip-tag">حل المشاكل</span>
              <span class="chip-tag">تعلّم مستمر</span>
              <span class="chip-tag">كود نظيف</span>
              <span class="chip-tag">عمل جماعي</span>
            </div>
          </section>

          <section class="card reveal" data-stack hidden>
            <h2 class="card-title">التقنيات</h2>
            <div data-stack-list></div>
          </section>

          <section class="card reveal" data-exp hidden>
            <h2 class="card-title">الخبرات</h2>
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
LABELS = [("github", "GitHub"), ("linkedin", "LinkedIn"), ("x", "X / تويتر"), ("telegram", "تيليجرام"), ("whatsapp", "واتساب"), ("email", "البريد الإلكتروني")]


def page_contact():
    rows = "\n".join(
        f'        <a class="link-row reveal" href="#" data-link="{k}"><span class="link-icon">{ICONS[k]}</span><span>{t}</span><span class="link-note"></span></a>'
        for k, t in LABELS
    )
    return (
        head("تواصل — Lynox", "أسهل طريقة توصل بيها لـ Lynox.", "contact.html")
        + header("contact.html")
        + f"""
  <main id="main">

    <div class="wrap">
      <div class="page-head">
        <h1 class="page-title reveal">تواصل معايا</h1>
        <p class="page-lede reveal">أسهل طريقة توصلني بيها من الروابط دي. برد عليك أول ما أشوف الرسالة.</p>
      </div>

      <div class="links">
{rows}
      </div>
    </div>
  </main>
"""
        + FOOTER
    )


def page_404():
    return (
        head("الصفحة مش موجودة — Lynox", "الصفحة اللي بتدوّر عليها مش موجودة.", "404.html", '<meta name="robots" content="noindex">\n')
        + header("")
        + f"""
  <main id="main">
    <div class="wrap notfound">
      <div>
        <div class="code">404</div>
        <p>الصفحة اللي بتدوّر عليها مش موجودة، أو اتنقلت.</p>
        <div class="actions" style="justify-content:center">
          <a class="btn btn-primary" href="index.html">رجوع للرئيسية {ARROW_L}</a>
          <a class="btn btn-ghost" href="projects.html">المشاريع</a>
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
