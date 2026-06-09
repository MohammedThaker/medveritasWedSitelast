import { useState, useEffect, useRef } from "react";
import type { MouseEvent, RefObject } from "react";
import type React from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Lang = "en" | "ar";
type Page = "home" | "about" | "services" | "research" | "updates";

interface ServiceItem { num: string; title: string; desc: string; }
interface StatItem { num: string; label: string; }
interface ResultItem { num: string; unit: string; label: string; }
interface NewsItem { type: string; date: string; title: string; body: string; }
interface NavGroup { title: string; links: { label: string; page?: Page }[]; }
interface NavDropdown { desc: string; groups: NavGroup[]; }
interface NavItem { label: string; labelAr: string; page: Page; dropdown: NavDropdown; }

interface ArContent {
  nav: string[]; services_title: string; services_sub: string;
  who_tag: string; who_title: string; who_p1: string; who_p2: string;
  results_title: string; results_sub: string; cta_title: string; cta_sub: string;
  news_title: string; news_sub: string; subscribe: string; meet_team: string;
  learn_more: string; read_study: string; view_all: string; request: string;
  contact: string; services: ServiceItem[]; impact_tag: string;
  impact_title: string; impact_p: string;
}

// ─────────────────────────────────────────────
// Logo (public asset)
// ─────────────────────────────────────────────
const LOGO_SRC = "/logo.png";

// ─────────────────────────────────────────────
// Arabic Content
// ─────────────────────────────────────────────
const AR: ArContent = {
  nav: ["من نحن", "خدماتنا", "الأبحاث", "التحديثات"],
  services_title: "خدماتنا",
  services_sub: "حلول بحثية ورقابية ومتكاملة في البيئات المعقدة",
  who_tag: "ميزتنا",
  who_title: "وصول محلي، معايير عالمية",
  who_p1: "تجمع ميدفيريتاس بين إمكانية الوصول المحلي غير المسبوق والصرامة المنهجية الدولية. مع أكثر من 300 موظف ميداني منتشرين في جميع محافظات اليمن، نجمع بيانات عالية الجودة في أصعب المناطق.",
  who_p2: "فرقنا مدربة وفق المعايير العالمية وعملياتنا مبنية على منهجيات معترف بها دولياً، مما يضمن أن كل دراسة نقدمها موثوقة وقابلة للتنفيذ.",
  results_title: "لماذا ميدفيريتاس",
  results_sub: "موثوق بها من قِبل كبرى المنظمات الدولية للبحث والرصد في اليمن",
  cta_title: "هل أنتم مستعدون للعمل معاً؟",
  cta_sub: "دعونا نناقش كيف يمكن لميدفيريتاس تقديم الأدلة الدقيقة التي تحتاجونها.",
  news_title: "رؤى وقيادة فكرية",
  news_sub: "ملخصات بحثية، أضواء على المنهجية، وتحليلات قطاعية من فريقنا",
  subscribe: "تواصل معانا",
  meet_team: "تعرف على فريقنا",
  learn_more: "اقرأ المزيد",
  read_study: "اقرأ دراسة الحالة كاملة",
  view_all: "عرض جميع المقالات",
  request: "طلب مقترح",
  contact: "تواصل معنا",
  services: [
    { num: "١", title: "البحث والتقييم", desc: "تقييمات الأثر، والمسوحات الأسرية، وتقييمات البرامج باستخدام منهجيات LQAS والعينات العنقودية" },
    { num: "٢", title: "الرصد من طرف ثالث", desc: "التحقق المستقل من تنفيذ البرامج الإنسانية والتنموية عبر المحافظات الـ34" },
    { num: "٣", title: "الاستراتيجية والحوكمة", desc: "تعزيز المؤسسات، وتحليل السياسات، وتقييمات الحوكمة للمنظمات العامة والمجتمع المدني" },
    { num: "٤", title: "بناء القدرات", desc: "التدريب والإرشاد والتطوير المؤسسي للمنظمات غير الحكومية المحلية والهيئات الحكومية" },
  ],
  impact_tag: "دراسة حالة مميزة",
  impact_title: "الوصول إلى غير الموصولين",
  impact_p: "أجرت ميدفيريتاس مسحاً شاملاً لتغطية التطعيم ضد شلل الأطفال في 119 مديرية في اليمن، بما في ذلك المناطق النائية الأكثر خطورة.",
};

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  {
    label: "About Us", labelAr: "من نحن", page: "about",
    dropdown: {
      desc: "Yemen's leading independent research and monitoring institution.",
      groups: [
        { title: "Our Story", links: [{ label: "Mission and Vision", page: "about" }, { label: "Our History", page: "about" }, { label: "Our Team", page: "about" }] },
        { title: "Work With Us", links: [{ label: "Careers", page: "about" }, { label: "Partnerships", page: "about" }] },
      ],
    },
  },
  {
    label: "Services", labelAr: "خدماتنا", page: "services",
    dropdown: {
      desc: "Comprehensive research and monitoring solutions for complex environments.",
      groups: [
        { title: "", links: [{ label: "Research & Evaluation", page: "services" }, { label: "Third-Party Monitoring", page: "services" }, { label: "Strategy & Governance", page: "services" }, { label: "Capacity Building", page: "services" }] },
      ],
    },
  },
  {
    label: "Research", labelAr: "الأبحاث", page: "research",
    dropdown: {
      desc: "",
      groups: [{ title: "", links: [{ label: "Reports Library", page: "research" }, { label: "Case Studies", page: "research" }, { label: "Methodologies", page: "research" }] }],
    },
  },
  {
    label: "Updates", labelAr: "التحديثات", page: "updates",
    dropdown: {
      desc: "",
      groups: [{ title: "", links: [{ label: "News & Announcements", page: "updates" }, { label: "Insights Blog", page: "updates" }, { label: "Newsletters", page: "updates" }] }],
    },
  },
];

const SERVICES: ServiceItem[] = [
  { num: "1", title: "Research & Evaluation", desc: "Impact evaluations, household surveys, and program assessments using LQAS and cluster sampling methodologies" },
  { num: "2", title: "Third-Party Monitoring", desc: "Independent verification of humanitarian and development program implementation across all 34 governorates" },
  { num: "3", title: "Strategy & Governance", desc: "Institutional strengthening, policy analysis, and governance assessments for public and civil society organizations" },
  { num: "4", title: "Capacity Building", desc: "Training, mentoring, and organizational development for local NGOs, government bodies, and community groups" },
];

const STATS: StatItem[] = [
  { num: "300+", label: "Field Staff" },
  { num: "34", label: "Governorates" },
  { num: "20+", label: "Projects" },
  { num: "10", label: "Years" },
];

const RESULTS: ResultItem[] = [
  { num: "300+", unit: "Field Staff", label: "deployed across all governorates of Yemen" },
  { num: "34", unit: "Governorates", label: "comprehensive coverage nationwide" },
  { num: "20+", unit: "Projects", label: "completed in 2023–2025" },
  { num: "10", unit: "Years", label: "of operational excellence" },
];

const NEWS: NewsItem[] = [
  { type: "Case Study", date: "JUN 2026", title: "Reaching the Unreachable: 119-District Vaccination Survey", body: "How we delivered high-quality data across 119 hard-to-reach districts using adaptive field strategies and real-time monitoring." },
  { type: "Methodology", date: "MAY 2026", title: "LQAS in Practice: Rapid Quality Assessment in Conflict Zones", body: "Inside our LQAS approach to generate actionable evidence quickly — when decisions can't wait." },
  { type: "Sector Update", date: "APR 2026", title: "Beyond Health: Medveritas Expands into Education and Governance", body: "Strengthening systems and outcomes through evidence, analytics, and local partnerships." },
];

const PARTNERS: string[] = ["WHO", "UNICEF", "CARE", "FAO", "EMPHNET"];

const WHO_FEATURES: [string, string][] = [
  ["Nationwide Field Network", "300+ field staff across all governorates of Yemen"],
  ["Rigorous Methodology", "International standards in design, data, and analysis"],
  ["Ethical & Secure Operations", "Protecting participants, data, and communities"],
];

// ─────────────────────────────────────────────
// Global CSS  (unchanged from original + about page additions)
// ─────────────────────────────────────────────
const GLOBAL_CSS = `
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }

  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&display=swap');

  @keyframes scrollBounce {
    0%,100% { opacity:1; transform:translateY(0); }
    50% { opacity:.4; transform:translateY(6px); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(32px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity:0; }
    to   { opacity:1; }
  }
  @keyframes slideInLeft {
    from { opacity:0; transform:translateX(-40px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes slideInRight {
    from { opacity:0; transform:translateX(40px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes scaleIn {
    from { opacity:0; transform:scale(0.92); }
    to   { opacity:1; transform:scale(1); }
  }
  @keyframes dropdownFade {
    from { opacity:0; transform:translateY(-8px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(22,163,74,.4); }
    50%      { box-shadow: 0 0 0 8px rgba(22,163,74,0); }
  }
  @keyframes countUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .reveal       { opacity:0; }
  .reveal-left  { opacity:0; }
  .reveal-right { opacity:0; }
  .reveal-scale { opacity:0; }

  .reveal.visible       { animation: fadeUp .7s ease forwards; }
  .reveal-left.visible  { animation: slideInLeft .7s ease forwards; }
  .reveal-right.visible { animation: slideInRight .7s ease forwards; }
  .reveal-scale.visible { animation: scaleIn .6s ease forwards; }

  .stagger-1 { animation-delay: .05s !important; }
  .stagger-2 { animation-delay: .15s !important; }
  .stagger-3 { animation-delay: .25s !important; }
  .stagger-4 { animation-delay: .35s !important; }

  /* ── Buttons ── */
  .btn-primary {
    padding: 11px 26px; background: #16a34a; color: white;
    font-weight: 700; font-size: 1.125rem; border-radius: 4px; border: none;
    cursor: pointer; transition: background .2s, transform .15s, box-shadow .2s;
    display: inline-flex; align-items: center; gap: 7px;
  }
  .btn-primary:hover  { background:#15803d; transform:translateY(-2px); box-shadow:0 4px 16px rgba(22,163,74,.35); }
  .btn-primary:active { transform:translateY(0); }

  .btn-outline {
    padding: 11px 26px; background: transparent; color: white;
    font-weight: 700; font-size: 1.125rem; border-radius: 4px; border: 2px solid white;
    cursor: pointer; transition: background .2s, color .2s, transform .15s;
    display: inline-flex; align-items: center; gap: 7px;
  }
  .btn-outline:hover { background:white; color:#0f172a; transform:translateY(-2px); }

  .btn-outline-green {
    padding: 11px 26px; background: transparent; color: #22c55e;
    font-weight: 700; font-size: 1.125rem; border-radius: 4px; border: 2px solid #22c55e;
    cursor: pointer; transition: background .2s, color .2s, transform .15s;
    display: inline-flex; align-items: center; gap: 7px;
  }
  .btn-outline-green:hover { background:#22c55e; color:#0f172a; transform:translateY(-2px); }

  .btn-outline-dark {
    padding: 11px 26px; background: transparent; color: #0f172a;
    font-weight: 700; font-size: 1.125rem; border-radius: 4px; border: 2px solid #0f172a;
    cursor: pointer; transition: background .2s, color .2s, transform .15s;
    display: inline-flex; align-items: center; gap: 7px;
  }
  .btn-outline-dark:hover { background:#0f172a; color:white; transform:translateY(-2px); }

  /* ── Cards ── */
  .news-card {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 14px; padding: 22px; background: white; border-radius: 8px;
    border: 1px solid #e5e7eb; cursor: pointer;
    transition: box-shadow .25s, transform .25s, border-color .25s;
  }
  .news-card:hover { box-shadow:0 8px 28px rgba(0,0,0,.1); transform:translateY(-3px); border-color:#16a34a; }
  .news-card:hover .news-arrow { transform:translateX(5px); stroke:#16a34a; }
  .news-arrow { transition: transform .25s, stroke .25s; }

  .service-card {
    padding: 28px; border-left: 4px solid #16a34a;
    transition: background .2s, transform .2s; cursor: default;
  }
  .service-card:hover { background:#f0fdf4; transform:translateX(5px); }

  .stat-card {
    text-align: center; padding: 28px 16px; border-radius: 8px;
    background: #f8fafc; border: 1px solid #e5e7eb;
    transition: box-shadow .25s, transform .25s;
  }
  .stat-card:hover { box-shadow:0 6px 20px rgba(0,0,0,.08); transform:translateY(-4px); }

  .impact-card { transition: box-shadow .3s, transform .3s; }
  .impact-card:hover { box-shadow:0 12px 36px rgba(22,163,74,.15); transform:translateY(-4px); }

  /* ── Nav ── */
  .nav-link-btn {
    display: flex; align-items: center; gap: 4px; height: 100%; padding: 0 16px;
    font-size: 1.125rem; font-weight: 500; background: none; border: none;
    border-bottom: 3px solid transparent; cursor: pointer; white-space: nowrap;
    transition: color .2s, border-color .2s; color: #1a1a1a;
  }
  .nav-link-btn:hover, .nav-link-btn.active { color:#16a34a; border-bottom-color:#16a34a; }

  .dropdown-panel {
    position: absolute; top: 100%; left: 0; background: white;
    border: 1px solid #e5e7eb; border-top: 3px solid #16a34a;
    box-shadow: 0 8px 30px rgba(0,0,0,.12); min-width: 220px; z-index: 999;
    animation: dropdownFade .2s ease;
  }

  .dropdown-link {
    display: block; padding: 8px 18px; font-size: 1.125rem; color: #374151;
    text-decoration: none; transition: background .15s, color .15s, padding-left .15s;
    cursor: pointer; border: none; background: none; width: 100%; text-align: left;
  }
  .dropdown-link:hover { background:#f0fdf4; color:#16a34a; padding-left:22px; }
  [dir="rtl"] .dropdown-link:hover { padding-left:18px; padding-right:22px; }

  /* ── Lang Toggle ── */
  .lang-toggle {
    display: flex; align-items: center; gap: 5px; padding: 6px 1.125rem;
    border-radius: 20px; border: 1.5px solid #e5e7eb; background: white;
    cursor: pointer; font-size: 1.125rem; font-weight: 600; color: #374151;
    transition: border-color .2s, background .2s, color .2s, transform .15s; white-space: nowrap;
  }
  .lang-toggle:hover { border-color:#16a34a; background:#f0fdf4; color:#16a34a; transform:scale(1.04); }

  /* ── Hero ── */
  .hero-content { animation: fadeUp .9s ease .1s both; }
  .hero-sub     { animation: fadeUp .9s ease .35s both; }
  .hero-actions { animation: fadeUp .9s ease .55s both; }

  .play-btn {
    width: 80px; height: 80px; background: rgba(255,255,255,.2); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0; border: none;
    transition: background .2s, transform .2s; animation: pulse 2.5s infinite;
  }
  .play-btn:hover { background:rgba(255,255,255,.35); transform:scale(1.1); animation:none; box-shadow:0 0 0 10px rgba(255,255,255,.1); }

  /* ── Footer ── */
  .footer-link { font-size:1.125rem; color:#9ca3af; text-decoration:none; transition:color .2s, padding-left .2s; display:inline-block; }
  .footer-link:hover { color:#4ade80; padding-left:4px; }
  [dir="rtl"] .footer-link:hover { padding-left:0; padding-right:4px; }
  [dir="rtl"] .service-card:hover { transform:translateX(-5px); }
  [dir="rtl"] .service-card { border-left:none; border-right:4px solid #16a34a; }

  /* ── Misc ── */
  .subscribe-input {
    flex:1; padding:10px 14px; border:1px solid #374151; background:#1e293b;
    color:white; border-radius:4px 0 0 4px; font-size:1.125rem; outline:none; transition:border-color .2s;
  }
  .subscribe-input:focus { border-color:#4ade80; }
  .subscribe-input::placeholder { color:#6b7280; }

  .progress-bar {
    position:fixed; top:0; left:0; height:3px;
    background:linear-gradient(90deg,#16a34a,#4ade80); z-index:9999; transition:width .1s linear;
  }

  /* ── About Page ── */
  .about-hero-bg {
    background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%);
    position: relative; overflow: hidden;
  }
  .about-hero-bg::before {
    content:''; position:absolute; inset:0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316a34a' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  .team-card {
    background: white; border-radius: 8px; overflow: hidden;
    border: 1px solid #e5e7eb;
    transition: box-shadow .3s, transform .3s;
  }
  .team-card:hover { box-shadow: 0 12px 36px rgba(0,0,0,.12); transform: translateY(-6px); }
  .team-card:hover .team-img { transform: scale(1.05); }
  .team-img { transition: transform .4s ease; width:100%; height:220px; object-fit:cover; display:block; }

  .value-card {
    padding: 32px 28px; border-radius: 8px; border: 1px solid #e5e7eb;
    background: white; transition: box-shadow .25s, transform .25s, border-color .25s;
  }
  .value-card:hover { box-shadow:0 8px 28px rgba(22,163,74,.12); transform:translateY(-4px); border-color:#16a34a; }

  .timeline-item {
    display: flex; gap: 24px; padding-bottom: 40px; position: relative;
  }
  .timeline-item:not(:last-child)::before {
    content:''; position:absolute; left:19px; top:40px; bottom:0; width:2px; background:#e5e7eb;
  }
  [dir="rtl"] .timeline-item:not(:last-child)::before { left:auto; right:19px; }

  .about-stat {
    text-align:center; padding:32px 20px;
    border-right: 1px solid rgba(255,255,255,.15);
  }
  .about-stat:last-child { border-right:none; }
  [dir="rtl"] .about-stat { border-right:none; border-left: 1px solid rgba(255,255,255,.15); }
  [dir="rtl"] .about-stat:last-child { border-left:none; }

  .page-enter { animation: fadeUp .5s ease forwards; }

  /* ── Breadcrumb ── */
  .breadcrumb-link { color:#16a34a; text-decoration:none; font-size:13px; font-weight:500; transition:opacity .2s; cursor:pointer; background:none; border:none; padding:0; }
  .breadcrumb-link:hover { opacity:.7; }
`;

// ─────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────
function useScrollReveal(threshold = 0.15): [RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─────────────────────────────────────────────
// Arrow Icon
// ─────────────────────────────────────────────
function ArrowIcon({ size = 14 }: { size?: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// ScrollProgress
// ─────────────────────────────────────────────
function ScrollProgress(): React.ReactElement {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = (): void => {
      const el = document.documentElement;
      setProgress(Math.round(el.scrollTop / (el.scrollHeight - el.clientHeight) * 100));
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="progress-bar" style={{ width: `${progress}%` }} />;
}

// ─────────────────────────────────────────────
// AnnouncementBar
// ─────────────────────────────────────────────
function AnnouncementBar({ lang }: { lang: Lang }): React.ReactElement | null {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div style={{ background: "#1a1a1a", color: "white", textAlign: "center", padding: "9px 40px", fontSize: 12, lineHeight: 1.5, position: "relative" }}>
      {lang === "ar"
        ? "لمعرفة المزيد عن أعمالنا في اليمن تفضل بزيارة تقرير التأثير لعام 2025."
        : "New: Our 2025 Impact Report is now available. Read our latest findings from across Yemen."}
      <a href="#" style={{ color: "#4ade80", textDecoration: "underline", marginLeft: 6, marginRight: 6, transition: "opacity .2s" }}
        onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.opacity = ".7"; }}
        onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.opacity = "1"; }}>
        {lang === "ar" ? "اقرأ الآن" : "Read Now"}
      </a>
      <button onClick={() => setVisible(false)}
        style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 18, lineHeight: 1, transition: "opacity .2s" }}
        onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.opacity = ".6"; }}
        onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.opacity = "1"; }}>×</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// DropdownMenu  (now navigates)
// ─────────────────────────────────────────────
interface DropdownMenuProps { item: NavItem; lang: Lang; onNavigate: (page: Page) => void; active: boolean; }

function DropdownMenu({ item, lang, onNavigate, active }: DropdownMenuProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", height: "100%" }}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className={`nav-link-btn${open ? " active" : ""}`} onClick={() => onNavigate(item.page)}
        style={{ color: active ? "#16a34a" : undefined, fontWeight: active ? 700 : 500 }}>
        {lang === "ar" ? item.labelAr : item.label}
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
          style={{ transition: "transform .25s", transform: open ? "rotate(180deg)" : "none" }}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="dropdown-panel">
          {item.dropdown.desc && (
            <div style={{ padding: "14px 18px", fontSize: 12, color: "#6b7280", borderBottom: "1px solid #f3f4f6", lineHeight: 1.5 }}>
              {item.dropdown.desc}
            </div>
          )}
          {item.dropdown.groups.map((g, gi) => (
            <div key={gi} style={{ padding: "10px 0" }}>
              {g.title && (
                <div style={{ padding: "6px 18px", fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: 2, textTransform: "uppercase" }}>
                  {g.title}
                </div>
              )}
              {g.links.map((link, li) => (
                <button key={li} className="dropdown-link" onClick={() => {
                  if (link.page) onNavigate(link.page);
                  setOpen(false);
                }}>
                  {link.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MobileMenu
// ─────────────────────────────────────────────
interface MobileMenuProps { open: boolean; onClose: () => void; lang: Lang; onNavigate: (page: Page) => void; }

function MobileMenu({ open, onClose, lang, onNavigate }: MobileMenuProps): React.ReactElement {
  const [openSub, setOpenSub] = useState<number | null>(null);
  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 9998, animation: "fadeIn .2s ease" }} />}
      <div style={{ position: "fixed", top: 0, right: 0, width: "min(320px, 90vw)", height: "100%", background: "white", zIndex: 9999, overflowY: "auto", boxShadow: "-4px 0 20px rgba(0,0,0,.15)", transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform .3s cubic-bezier(.4,0,.2,1)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={LOGO_SRC} alt="Medveritas" style={{ height: 34, width: "auto", objectFit: "contain" }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.1 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Medveritas</span>
              <span style={{ color: "#16a34a", fontSize: 12, fontWeight: 600 }}>{lang === "ar" ? "ميدفرتاس للدراسات والبحوث" : "For Studies & Research"}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, color: "#6b7280", cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>
        <div>
          {NAV_ITEMS.map((item, i) => (
            <div key={i}>
              <button onClick={() => setOpenSub(openSub === i ? null : i)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", fontSize: 18, fontWeight: 500, color: openSub === i ? "#060706" : "#1a1a1a", background: openSub === i ? "#f0fdf4" : "none", border: "none", borderBottom: "1px solid #f3f4f6", cursor: "pointer" }}>
                {lang === "ar" ? item.labelAr : item.label}
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ transition: "transform .25s", transform: openSub === i ? "rotate(180deg)" : "none" }}>
                  <path d="M2 4l4 4 4-4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div style={{ background: "#f9fafb", borderBottom: openSub === i ? "1px solid #e5e7eb" : "none", maxHeight: openSub === i ? "400px" : "0", overflow: "hidden", transition: "max-height .3s cubic-bezier(.4,0,.2,1)" }}>
                {item.dropdown.groups.flatMap((g) => g.links).map((link, li) => (
                  <button key={li} onClick={() => {
                    if (link.page) onNavigate(link.page);
                    onClose();
                  }}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 28px", fontSize: 13, color: "#374151", background: "none", border: "none", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}>
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ margin: "16px 20px" }}>
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            {lang === "ar" ? AR.subscribe : "Get in Touch"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// Navbar  (updated: logo image + navigation)
// ─────────────────────────────────────────────
interface NavbarProps { lang: Lang; onLangToggle: () => void; onNavigate: (page: Page) => void; currentPage: Page; }

function Navbar({ lang, onLangToggle, onNavigate, currentPage }: NavbarProps): React.ReactElement {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const checkSize = (): void => setIsMobile(window.innerWidth < 900);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 1000, boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,.10)" : "0 1px 4px rgba(0,0,0,.06)", transition: "box-shadow .3s" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

          {/* ── LOGO ── */}
          <button onClick={() => onNavigate("home")}
            style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", flexShrink: 0, padding: 0, transition: "opacity .2s" }}
            onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.opacity = ".8"; }}
            onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.opacity = "1"; }}>
            <img src={LOGO_SRC} alt="Medveritas logo" style={{ height: 40, width: "auto", objectFit: "contain" }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.1 }}>
              <span style={{ fontWeight: 700, fontSize: 17, color: "#0f172a", letterSpacing: "-0.3px" }}>Medveritas</span>
              <span style={{ color: "#16a34a", fontSize: 12, fontWeight: 600 }}>{lang === "ar" ? "ميدفرتاس للدراسات والبحوث" : "For Studies & Research"}</span>
            </div>
          </button>

          {/* Desktop nav */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", height: 68 }}>
              {NAV_ITEMS.map((item, i) => (
                <DropdownMenu key={i} item={item} lang={lang} onNavigate={onNavigate} active={item.page === currentPage} />
              ))}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="lang-toggle" onClick={onLangToggle}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              {lang === "en" ? "العربية" : "English"}
            </button>
            {!isMobile && (
              <button className="btn-primary" style={{ padding: "9px 20px", fontSize: 13 }}>
                {lang === "ar" ? AR.subscribe : "Get in Touch"}
              </button>
            )}
            {isMobile && (
              <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "#1a1a1a", display: "flex", alignItems: "center" }} aria-label="Open menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </nav>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} lang={lang} onNavigate={onNavigate} />
    </>
  );
}

// ─────────────────────────────────────────────
// Breadcrumb
// ─────────────────────────────────────────────
function Breadcrumb({ label, labelAr, lang, onHome }: { label: string; labelAr: string; lang: Lang; onHome: () => void }): React.ReactElement {
  const ar = lang === "ar";
  return (
    <div style={{ background: "#f8fafc", borderBottom: "1px solid #e5e7eb", padding: "10px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", display: "flex", alignItems: "center", gap: 8 }}>
        <button className="breadcrumb-link" onClick={onHome}>{ar ? "الرئيسية" : "Home"}</button>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
        <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{ar ? labelAr : label}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ── ABOUT US PAGE ──
// ─────────────────────────────────────────────

const TEAM_MEMBERS = [
  { name: "Dr. Mohammed", nameAr: "د.محمد ", role: "Executive Director", roleAr: "المدير التنفيذي", bio: "15+ years leading research operations across fragile and conflict-affected states.", bioAr: "أكثر من 15 عاماً في قيادة عمليات البحث في الدول الهشة." },
  { name: "Mohammed", nameAr: " محمد", role: "Head of Research", roleAr: "رئيسة قسم الأبحاث", bio: "Expert in LQAS methodologies and household survey design for complex environments.", bioAr: "خبيرة في منهجيات LQAS وتصميم المسوحات الأسرية."},
  { name: "Samir", nameAr: "سامح ", role: "Director of Field Operations", roleAr: "مدير العمليات الميدانية", bio: "Oversees 300+ field staff across Yemen's 34 governorates with precision and integrity.", bioAr: "يشرف على أكثر من 300 موظف ميداني في محافظات اليمن الـ34." },
  { name: " Hassan", nameAr: " حسن", role: "Data & Analytics Lead", roleAr: "رئيسة البيانات والتحليلات", bio: "Specialist in geospatial analysis and real-time data monitoring dashboards.", bioAr: "متخصصة في التحليل الجغرافي المكاني ولوحات رصد البيانات." },
];

const VALUES = [
  { icon: "🔬", title: "Rigor", titleAr: "الصرامة المنهجية", desc: "We apply international standards of research design, data collection, and analysis in every project.", descAr: "نطبق المعايير الدولية لتصميم البحث وجمع البيانات وتحليلها في كل مشروع." },
  { icon: "🤝", title: "Independence", titleAr: "الاستقلالية", desc: "Our findings are free from political bias. We report evidence as it is, not as others wish it to be.", descAr: "نتائجنا خالية من التحيز السياسي. نبلغ عن الأدلة كما هي." },
  { icon: "🛡️", title: "Ethics", titleAr: "الأخلاق", desc: "Participant protection, data security, and community respect are non-negotiable in all our work.", descAr: "حماية المشاركين وأمن البيانات واحترام المجتمع غير قابلة للتفاوض." },
  { icon: "🌍", title: "Local Expertise", titleAr: "الخبرة المحلية", desc: "Deep knowledge of Yemen's cultural, geographic, and political landscape gives us unmatched access.", descAr: "المعرفة العميقة بالمشهد اليمني تمنحنا وصولاً لا مثيل له." },
  { icon: "📊", title: "Impact", titleAr: "الأثر", desc: "Every dataset, report, and recommendation is designed to translate directly into better decisions.", descAr: "كل مجموعة بيانات وتقرير وتوصية مصممة لتترجم إلى قرارات أفضل." },
  { icon: "🔄", title: "Adaptability", titleAr: "المرونة", desc: "We design flexible methodologies that respond to the realities of a fast-changing conflict environment.", descAr: "نصمم منهجيات مرنة تستجيب لواقع بيئة الصراع المتغيرة." },
];

const TIMELINE = [
  { year: "2015", title: "Founded", titleAr: "التأسيس", desc: "Medveritas established in Sana'a to address the critical gap in independent data in Yemen.", descAr: "تأسست ميدفيريتاس في صنعاء لسد الفجوة الحرجة في البيانات المستقلة في اليمن." },
  { year: "2017", title: "First Major Survey", titleAr: "أول مسح رئيسي", desc: "Completed a nationwide nutrition survey across 18 governorates for UNICEF.", descAr: "أجرت مسحاً غذائياً على مستوى وطني في 18 محافظة لصالح اليونيسف." },
  { year: "2019", title: "TPM Certification", titleAr: "شهادة الرصد من طرف ثالث", desc: "Received international certification for Third-Party Monitoring standards.", descAr: "حصلت على شهادة دولية لمعايير الرصد من طرف ثالث." },
  { year: "2021", title: "300+ Field Staff", titleAr: "أكثر من 300 موظف ميداني", desc: "Expanded field network to cover all 34 governorates of Yemen.", descAr: "توسعت الشبكة الميدانية لتغطية جميع محافظات اليمن الـ34." },
  { year: "2023", title: "WHO Partnership", titleAr: "شراكة منظمة الصحة العالمية", desc: "Signed a strategic partnership with WHO for health sector monitoring and evaluation.", descAr: "وقّعت شراكة استراتيجية مع منظمة الصحة العالمية." },
  { year: "2025", title: "Impact Report", titleAr: "تقرير الأثر", desc: "Published our first comprehensive Impact Report covering 20+ projects.", descAr: "نشرت أول تقرير أثر شامل يغطي أكثر من 20 مشروعاً." },
];

interface SectionProps { lang: Lang; }

function AboutPage({ lang }: SectionProps): React.ReactElement {
  const ar = lang === "ar";
  const [refMission, visibleMission] = useScrollReveal();
  const [refValues, visibleValues] = useScrollReveal();
  const [refTeam, visibleTeam] = useScrollReveal();
  const [refTimeline, visibleTimeline] = useScrollReveal();

  return (
    <div className="page-enter">

      {/* ── Hero Banner ── */}
      <section className="about-hero-bg" style={{ padding: "100px 0 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#4ade80", letterSpacing: 4, marginBottom: 16, textTransform: "uppercase" }}>
              {ar ? "من نحن" : "ABOUT MEDVERITAS"}
            </div>
            <h1 style={{ fontSize: "clamp(36px,6vw,72px)", fontWeight: 700, color: "white", lineHeight: 1.1, marginBottom: 24, fontFamily: "'Playfair Display', Georgia, serif" }}>
              {ar ? "رؤى موثوقة." : "Trusted Insights."}
              <br />
              <span style={{ color: "#4ade80" }}>{ar ? "أنظمة أقوى." : "Stronger Systems."}</span>
            </h1>
            <p style={{ fontSize: "clamp(15px,1.5vw,18px)", color: "rgba(255,255,255,.80)", lineHeight: 1.8, maxWidth: 580, marginBottom: 32 }}>
              {ar
                ? "ميدفيريتاس هي المؤسسة المستقلة الرائدة للبحث والرصد في اليمن. منذ عام 2015، نقدم أدلة عالية الجودة للمنظمات الإنسانية والتنموية الدولية."
                : "Medveritas is Yemen's leading independent research and monitoring institution. Since 2015, we have delivered high-quality evidence to international humanitarian and development organizations working in one of the world's most complex environments."}
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button className="btn-primary">{ar ? "تعرف على فريقنا" : "Meet Our Team"} <ArrowIcon /></button>
              <button className="btn-outline">{ar ? "خدماتنا" : "Our Services"}</button>
            </div>
          </div>
        </div>

        {/* Decorative accent */}
        <div style={{ position: "absolute", right: 0, top: 0, width: "40%", height: "100%", background: "linear-gradient(135deg, transparent 40%, rgba(22,163,74,.06))", pointerEvents: "none" }} />
      </section>

      {/* ── Stats Bar ── */}
      <section style={{ background: "#0f172a", padding: "40px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
            {[
              { num: "300+", label: ar ? "موظف ميداني" : "Field Staff" },
              { num: "34", label: ar ? "محافظة" : "Governorates" },
              { num: "20+", label: ar ? "مشروع مكتمل" : "Projects Completed" },
              { num: "10", label: ar ? "سنوات خبرة" : "Years of Excellence" },
            ].map((s, i) => (
              <div key={i} className="about-stat">
                <div style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 700, color: "#4ade80", marginBottom: 4 }}>{s.num}</div>
                <div style={{ fontSize: 13, color: "#9ca3af", fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section style={{ background: "white", padding: "96px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
          <div ref={refMission} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 64, alignItems: "center" }}>
            <div className={`reveal-left${visibleMission ? " visible" : ""}`}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", letterSpacing: 3, marginBottom: 14, textTransform: "uppercase" }}>
                {ar ? "مهمتنا ورؤيتنا" : "MISSION & VISION"}
              </div>
              <h2 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 700, color: "#0f172a", marginBottom: 20, lineHeight: 1.2, fontFamily: "'Playfair Display', Georgia, serif" }}>
                {ar ? "وصول محلي، معايير عالمية" : "Local Access, Global Standards"}
              </h2>
              <p style={{ fontSize: 17, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
                {ar
                  ? "مهمتنا هي تزويد المنظمات الإنسانية والتنموية والحكومية بالأدلة الدقيقة والموثوقة اللازمة لاتخاذ قرارات فعّالة تؤثر إيجابياً في حياة الناس في اليمن."
                  : "Our mission is to provide humanitarian, development, and government organizations with the rigorous, reliable evidence they need to make effective decisions that positively impact the lives of people in Yemen."}
              </p>
              <p style={{ fontSize: 17, color: "#374151", lineHeight: 1.8, marginBottom: 28 }}>
                {ar
                  ? "رؤيتنا هي يمن يُبنى فيه السياسات والبرامج على أدلة قوية ومنهجية شفافة، مما يؤدي إلى نتائج أفضل ومستدامة للمجتمعات الأكثر احتياجاً."
                  : "Our vision is a Yemen where policies and programs are built on robust evidence and transparent methodology, leading to better and more sustainable outcomes for the communities that need them most."}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {WHO_FEATURES.map(([title, desc], i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 36, height: 36, background: "#f0fdf4", border: "2px solid #16a34a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 700, color: "#0f172a", fontSize: 15, marginBottom: 3 }}>{title}</h4>
                      <p style={{ fontSize: 14, color: "#6b7280", margin: 0, lineHeight: 1.5 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`reveal-right${visibleMission ? " visible" : ""}`} style={{ position: "relative" }}>
              <div style={{ borderRadius: 8, overflow: "hidden", position: "relative" }}>
                <img src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=720&h=560&fit=crop" alt="Mission" style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,.5), transparent)" }} />
              </div>
              {/* floating card */}
              <div style={{ position: "absolute", bottom: -20, right: -20, background: "white", borderRadius: 8, padding: "20px 24px", boxShadow: "0 12px 40px rgba(0,0,0,.15)", border: "1px solid #e5e7eb", minWidth: 180 }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: "#16a34a", marginBottom: 4 }}>10+</div>
                <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{ar ? "سنوات من التميز" : "Years of Excellence"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section style={{ background: "#f8fafc", padding: "96px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
          <div ref={refValues} className={`reveal${visibleValues ? " visible" : ""}`} style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", letterSpacing: 3, marginBottom: 12, textTransform: "uppercase" }}>
              {ar ? "قيمنا" : "OUR VALUES"}
            </div>
            <h2 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 700, color: "#0f172a", marginBottom: 14, fontFamily: "'Playfair Display', Georgia, serif" }}>
              {ar ? "ما يميزنا" : "What Defines Us"}
            </h2>
            <div style={{ width: visibleValues ? 52 : 0, height: 4, background: "#16a34a", margin: "0 auto", transition: "width .7s ease .3s" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {VALUES.map((v, i) => (
              <div key={i} className={`value-card reveal stagger-${(i % 4) + 1}${visibleValues ? " visible" : ""}`}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{v.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>{ar ? v.titleAr : v.title}</h3>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7, margin: 0 }}>{ar ? v.descAr : v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Team ── */}
      <section style={{ background: "white", padding: "96px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
          <div ref={refTeam} className={`reveal${visibleTeam ? " visible" : ""}`} style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", letterSpacing: 3, marginBottom: 12, textTransform: "uppercase" }}>
              {ar ? "فريقنا" : "OUR TEAM"}
            </div>
            <h2 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 700, color: "#0f172a", marginBottom: 10, fontFamily: "'Playfair Display', Georgia, serif" }}>
              {ar ? "تعرف على قيادتنا" : "Meet Our Leadership"}
            </h2>
            <div style={{ width: visibleTeam ? 52 : 0, height: 4, background: "#16a34a", transition: "width .7s ease .3s" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 28 }}>
            {TEAM_MEMBERS.map((m, i) => (
              <div key={i} className={`team-card reveal stagger-${(i % 4) + 1}${visibleTeam ? " visible" : ""}`}>
                {/* <div style={{ overflow: "hidden" }}>
                  <img src={m.img} alt={m.name} className="team-img" />
                </div> */}
                <div style={{ padding: "20px 20px 24px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", letterSpacing: 2, marginBottom: 6, textTransform: "uppercase" }}>
                    {ar ? m.roleAr : m.role}
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{ar ? m.nameAr : m.name}</h3>
                  <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>{ar ? m.bioAr : m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our History Timeline ── */}
      <section style={{ background: "#f8fafc", padding: "96px 0" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 2rem" }}>
          <div ref={refTimeline} className={`reveal${visibleTimeline ? " visible" : ""}`} style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", letterSpacing: 3, marginBottom: 12, textTransform: "uppercase" }}>
              {ar ? "تاريخنا" : "OUR HISTORY"}
            </div>
            <h2 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 700, color: "#0f172a", fontFamily: "'Playfair Display', Georgia, serif" }}>
              {ar ? "رحلتنا" : "Our Journey"}
            </h2>
          </div>
          <div>
            {TIMELINE.map((t, i) => (
              <div key={i} className={`timeline-item reveal stagger-${(i % 4) + 1}${visibleTimeline ? " visible" : ""}`}>
                <div style={{ width: 40, height: 40, background: "#16a34a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "white", fontWeight: 700, fontSize: 11 }}>
                  {t.year.slice(2)}
                </div>
                <div style={{ paddingTop: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", marginBottom: 4 }}>{t.year}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{ar ? t.titleAr : t.title}</h3>
                  <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7, margin: 0 }}>{ar ? t.descAr : t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partners ── */}
      <section style={{ background: "#0f172a", padding: "64px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#4ade80", letterSpacing: 3, marginBottom: 28, textTransform: "uppercase" }}>
            {ar ? "موثوق بها من" : "TRUSTED BY"}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 40 }}>
            {PARTNERS.map((p) => (
              <span key={p} style={{ fontSize: 22, fontWeight: 700, color: "#4b5563", transition: "color .2s", cursor: "default" }}
                onMouseEnter={(e: MouseEvent<HTMLSpanElement>) => { e.currentTarget.style.color = "#4ade80"; }}
                onMouseLeave={(e: MouseEvent<HTMLSpanElement>) => { e.currentTarget.style.color = "#4b5563"; }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "white", padding: "96px 0" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", padding: "0 2rem" }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, color: "#0f172a", marginBottom: 16, fontFamily: "'Playfair Display', Georgia, serif" }}>
            {ar ? "هل أنتم مستعدون للعمل معاً؟" : "Ready to Work Together?"}
          </h2>
          <p style={{ fontSize: 17, color: "#6b7280", lineHeight: 1.8, marginBottom: 36 }}>
            {ar
              ? "دعونا نناقش كيف يمكن لميدفيريتاس تقديم الأدلة الدقيقة التي تحتاجونها."
              : "Let's discuss how Medveritas can provide the rigorous evidence you need to make your next intervention a success."}
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary">{ar ? "طلب مقترح" : "Request a Proposal"} <ArrowIcon /></button>
            <button className="btn-outline-dark">{ar ? "تواصل معنا" : "Get in Touch"}</button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────
// ── HOME PAGE (UNCHANGED) ──
// ─────────────────────────────────────────────

function Hero({ lang }: SectionProps): React.ReactElement {
  return (
    <section style={{ position: "relative", width: "100%", height: "100vh", minHeight: 500, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url('surveyor.png')", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.45) contrast(1.1)" }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(15, 14, 14, 0.4)" }} />
      <div style={{ position: "relative", zIndex: 10, width: "100%", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
        <div style={{ maxWidth: 560 }} className="hero-content">
          <h1 style={{ fontSize: "clamp(40px,7vw,80px)", fontWeight: 700, color: "white", lineHeight: 1.1, margin: 0 }}>
            {lang === "ar" ? "أدلة" : "Rigorous"}
          </h1>
          <h2 style={{ fontSize: "clamp(40px,7vw,80px)", fontWeight: 700, color: "#4ade80", lineHeight: 1.1, margin: "0 0 20px" }}>
            {lang === "ar" ? "دقيقة" : "Evidence"}
          </h2>
          <p className="hero-sub" style={{ fontSize: "clamp(14px,1.5vw,17px)", color: "rgba(255,255,255,.85)", lineHeight: 1.7, maxWidth: 460, marginBottom: 28 }}>
            {lang === "ar"
              ? "ميدفيريتاس — مؤسسة البحث والرصد المستقلة الرائدة في اليمن. نقدم بيانات عالية الجودة في أكثر البيئات تعقيداً."
              : "Medveritas — Yemen's leading independent research and monitoring institution. Delivering high-quality data in the world's most complex environments."}
          </p>
          <div className="hero-actions" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button className="btn-primary">{lang === "ar" ? "استكشف خدماتنا" : "Explore Our Services"}</button>
            <button className="btn-outline">{lang === "ar" ? "اقرأ التقرير" : "Read 2025 Report"}</button>
          </div>
        </div>
        <button className="play-btn" aria-label="Play video">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 3 }}><polygon points="5,3 19,12 5,21" /></svg>
        </button>
      </div>
      <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
        <div style={{ width: 22, height: 36, border: "2px solid rgba(255,255,255,.7)", borderRadius: 11, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 5 }}>
          <div style={{ width: 3, height: 7, background: "white", borderRadius: 2, animation: "scrollBounce 1.5s infinite" }} />
        </div>
      </div>
    </section>
  );
}

function WhoWeAre({ lang }: SectionProps): React.ReactElement {
  const [ref, visible] = useScrollReveal();
  const [refImg, visibleImg] = useScrollReveal();
  const ar = lang === "ar";
  return (
    <section style={{ background: "#0f172a", color: "white", padding: "80px 0" }}>
      <div style={{ maxWidth: 1536, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 56, alignItems: "center" }}>
          <div ref={ref} className={`reveal-left${visible ? " visible" : ""}`}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#4ade80", letterSpacing: 3, marginBottom: 14, textTransform: "uppercase" }}>{ar ? AR.who_tag : "OUR ADVANTAGE"}</div>
            <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, marginBottom: 18, lineHeight: 1.2 }}>{ar ? AR.who_title : "Local Access, Global Standards"}</h2>
            <p style={{ fontSize: 18, color: "#d1d5db", lineHeight: 1.75, marginBottom: 14 }}>{ar ? AR.who_p1 : "Medveritas combines unparalleled local access with international methodological rigor. With more than 300 field staff deployed across all governorates of Yemen, we collect high-quality data in the most challenging and hard-to-reach areas."}</p>
            <p style={{ fontSize: 18, color: "#d1d5db", lineHeight: 1.75, marginBottom: 20 }}>{ar ? AR.who_p2 : "Our teams are trained to global standards and our processes are built on internationally recognized methodologies, ensuring that every study we deliver is credible, reliable, and actionable."}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {WHO_FEATURES.map(([title, desc], i) => (
                <div key={i} style={{ display: "flex", gap: 14 }}>
                  <div style={{ width: 3, background: "#4ade80", flexShrink: 0, borderRadius: 2 }} />
                  <div>
                    <h4 style={{ fontWeight: 700, color: "white", fontSize: "inherit", marginBottom: 3 }}>{title}</h4>
                    <p style={{ fontSize: "inherit", color: "#9ca3af", margin: 0 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{ marginTop: 22 }}>{ar ? AR.meet_team : "Meet Our Team"}</button>
          </div>
          <div ref={refImg} className={`reveal-right${visibleImg ? " visible" : ""}`} style={{ position: "relative", height: 360, borderRadius: 8, overflow: "hidden" }}>
            <img src="surveyor.png" alt="Team" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s ease" }}
              onMouseEnter={(e: MouseEvent<HTMLImageElement>) => { e.currentTarget.style.transform = "scale(1.04)"; }}
              onMouseLeave={(e: MouseEvent<HTMLImageElement>) => { e.currentTarget.style.transform = "scale(1)"; }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,23,42,.5),transparent)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Services({ lang }: SectionProps): React.ReactElement {
  const [ref, visible] = useScrollReveal();
  const ar = lang === "ar";
  const displayServices: ServiceItem[] = ar ? AR.services : SERVICES;
  return (
    <section style={{ background: "white", padding: "80px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div ref={ref} className={`reveal${visible ? " visible" : ""}`}>
          <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>{ar ? AR.services_title : "Our Services"}</h2>
          <p style={{ fontSize: 18, color: "#6b7280", marginBottom: 14 }}>{ar ? AR.services_sub : "Comprehensive research, monitoring, and strategy solutions for complex environments"}</p>
          <div style={{ width: visible ? 52 : 0, height: 4, background: "#16a34a", marginBottom: 48, transition: "width .7s ease .3s" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(580px, 1fr))", gap: 32, marginBottom: 40 }}>
          {displayServices.map((s, i) => (
            <div key={i} className={`service-card reveal stagger-${i + 1}${visible ? " visible" : ""}`}>
              <div style={{ fontSize: 44, fontWeight: 700, color: "#16a34a", marginBottom: 10, lineHeight: 1 }}>{s.num}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, marginBottom: 18 }}>{s.desc}</p>
              <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600, color: "#0f172a", textDecoration: "none", transition: "color .2s, gap .2s" }}
                onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = "#16a34a"; e.currentTarget.style.gap = "9px"; }}
                onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = "#0f172a"; e.currentTarget.style.gap = "5px"; }}>
                {ar ? AR.learn_more : "Learn More"}<ArrowIcon />
              </a>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 16, background: "#f8fafc", padding: 36, borderRadius: 8 }}>
          {STATS.map((s, i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, color: "#16a34a", marginBottom: 5 }}>{s.num}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImpactReport({ lang }: SectionProps): React.ReactElement {
  const [refL, visibleL] = useScrollReveal();
  const [refR, visibleR] = useScrollReveal();
  const ar = lang === "ar";
  return (
    <section style={{ background: "#f8fafc", padding: "80px 0" }}>
      <div style={{ maxWidth: 1536, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 56, alignItems: "center" }}>
          <div ref={refL} className={`reveal-left${visibleL ? " visible" : ""}`}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#16a34a", letterSpacing: 3, marginBottom: 14, textTransform: "uppercase" }}>{ar ? AR.impact_tag : "FEATURED CASE STUDY"}</div>
            <h2 style={{ fontSize: "48px", fontWeight: 700, color: "#0f172a", marginBottom: 18, lineHeight: 1.2 }}>{ar ? AR.impact_title : "Reaching the Unreachable"}</h2>
            <p style={{ fontSize: 18, color: "#374151", lineHeight: 1.75, marginBottom: 14 }}><strong>119-District Polio Vaccination Coverage Survey</strong></p>
            <p style={{ fontSize: 18, color: "#374151", lineHeight: 1.75, marginBottom: 20 }}>{ar ? AR.impact_p : "Medveritas conducted a comprehensive polio vaccination coverage survey across 119 districts in Yemen, including high-risk and hard-to-reach areas. Our nationwide field network and robust methodology delivered high-quality, actionable data that informed microplanning and strengthened immunization programs."}</p>
            <button className="btn-primary">{ar ? AR.read_study : "Read Full Case Study"}<ArrowIcon /></button>
          </div>
          <div ref={refR} className={`impact-card reveal-right${visibleR ? " visible" : ""}`} style={{ border: "4px solid #16a34a", background: "white", borderRadius: 8, padding: 28, boxShadow: "0 6px 20px rgba(0,0,0,.07)" }}>
            <div style={{ fontSize: 60, fontWeight: 700, color: "#16a34a", textAlign: "center", marginBottom: 3 }}>119</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", textAlign: "center", marginBottom: 18 }}>{ar ? "مديرية شملها المسح" : "Districts Surveyed"}</div>
            <img src="surveyor.png" alt="Case Study" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 4, marginBottom: 18, transition: "transform .4s ease" }}
              onMouseEnter={(e: MouseEvent<HTMLImageElement>) => { e.currentTarget.style.transform = "scale(1.03)"; }}
              onMouseLeave={(e: MouseEvent<HTMLImageElement>) => { e.currentTarget.style.transform = "scale(1)"; }} />
            <h3 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 9 }}>{ar ? "مسح تغطية التطعيم ضد شلل الأطفال" : "Polio Vaccination Coverage Survey"}</h3>
            <p style={{ fontSize: 17, color: "#6b7280", margin: 0 }}>{ar ? "جمع بيانات عالية الجودة في المناطق النائية باستخدام استراتيجيات ميدانية تكيفية." : "High-quality data collection across hard-to-reach areas using adaptive field strategies and real-time monitoring."}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function OurResults({ lang }: SectionProps): React.ReactElement {
  const [ref, visible] = useScrollReveal();
  const ar = lang === "ar";
  return (
    <section style={{ background: "white", padding: "80px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div ref={ref} className={`reveal${visible ? " visible" : ""}`} style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>{ar ? AR.results_title : "Why Choose Medveritas"}</h2>
          <p style={{ fontSize: 18, color: "#6b7280", maxWidth: 672, margin: "0 auto", lineHeight: 1.6 }}>{ar ? AR.results_sub : "Trusted by leading international organizations for rigorous research and monitoring in Yemen's most challenging contexts"}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 20, marginBottom: 48 }}>
          {RESULTS.map((r, i) => (
            <div key={i} className={`stat-card reveal stagger-${i + 1}${visible ? " visible" : ""}`}>
              <div style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 700, color: "#16a34a", marginBottom: 5 }}>{r.num}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>{r.unit}</div>
              <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{r.label}</div>
            </div>
          ))}
        </div>
        <div className={`reveal${visible ? " visible" : ""}`} style={{ background: "#f8fafc", borderRadius: 8, padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#16a34a", letterSpacing: 1, marginBottom: 20, textTransform: "uppercase" }}>{ar ? "موثوق بها من قِبل كبرى المنظمات" : "TRUSTED BY LEADING ORGANIZATIONS"}</div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 28 }}>
            {PARTNERS.map((p) => (
              <span key={p} style={{ fontSize: 18, fontWeight: 600, color: "#6b7280", transition: "color .2s, transform .2s", cursor: "default", display: "inline-block" }}
                onMouseEnter={(e: MouseEvent<HTMLSpanElement>) => { e.currentTarget.style.color = "#16a34a"; e.currentTarget.style.transform = "scale(1.1)"; }}
                onMouseLeave={(e: MouseEvent<HTMLSpanElement>) => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.transform = "scale(1)"; }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA({ lang }: SectionProps): React.ReactElement {
  const [ref, visible] = useScrollReveal();
  const ar = lang === "ar";
  return (
    <section style={{ background: "#0f172a", color: "white", padding: "80px 0" }}>
      <div ref={ref} className={`reveal${visible ? " visible" : ""}`} style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", padding: "0 1rem" }}>
        <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, marginBottom: 18 }}>{ar ? AR.cta_title : "Ready to Work Together?"}</h2>
        <p style={{ fontSize: 18, color: "#d1d5db", marginBottom: 32, lineHeight: 1.7 }}>{ar ? AR.cta_sub : "Let's discuss how Medveritas can provide the rigorous evidence you need to ensure your next intervention in Yemen is a success."}</p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 40, flexWrap: "wrap" }}>
          <button style={{ padding: "11px 26px", background: "#22c55e", color: "#0f172a", fontWeight: 700, fontSize: 13, borderRadius: 4, border: "none", cursor: "pointer", transition: "background .2s, transform .15s" }}
            onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.transform = "none"; }}>
            {ar ? AR.request : "Request a Proposal"}
          </button>
          <button className="btn-outline-green">{ar ? AR.contact : "Get in Touch"}</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9, color: "#9ca3af", fontSize: 13 }}>
          <span>📍 Sana'a, Yemen</span>
          <span>📧 info@medveritas.com</span>
          <span>📱 +967 (0) XXX XXX XXX</span>
        </div>
      </div>
    </section>
  );
}

function RecentNews({ lang }: SectionProps): React.ReactElement {
  const [ref, visible] = useScrollReveal();
  const ar = lang === "ar";
  return (
    <section style={{ background: "#f8fafc", padding: "80px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div ref={ref} className={`reveal${visible ? " visible" : ""}`}>
          <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>{ar ? AR.news_title : "Insights & Thought Leadership"}</h2>
          <p style={{ fontSize: 18, color: "#6b7280", marginBottom: 14 }}>{ar ? AR.news_sub : "Research briefs, methodology spotlights, and sector analysis from our team"}</p>
          <div style={{ width: visible ? 52 : 0, height: 4, background: "#16a34a", marginBottom: 40, transition: "width .7s ease .3s" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
          {NEWS.map((item, i) => (
            <div key={i} className={`news-card reveal stagger-${i + 1}${visible ? " visible" : ""}`}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", marginBottom: 6 }}>{item.type} • {item.date}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{item.body}</div>
              </div>
              <svg className="news-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ))}
        </div>
        <div className={`reveal${visible ? " visible" : ""}`} style={{ textAlign: "center" }}>
          <button className="btn-outline-dark">{ar ? AR.view_all : "View All Insights"}<ArrowIcon /></button>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────
function Footer({ lang, onNavigate }: SectionProps & { onNavigate: (p: Page) => void }): React.ReactElement {
  const year = new Date().getFullYear();
  const ar = lang === "ar";
  return (
    <footer style={{ background: "#0f172a", color: "white", padding: "64px 0 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
              <img src={LOGO_SRC} alt="Medveritas" style={{ height: 36, width: "auto", objectFit: "contain" }} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.1 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Medveritas</span>
                <span style={{ color: "#16a34a", fontSize: 12, fontWeight: 600 }}>{ar ? "ميدفرتاس للدراسات والبحوث" : "For Studies & Research"}</span>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6 }}>{ar ? "رؤى موثوقة. أنظمة أقوى. نتائج أفضل." : "Trusted insights. Stronger systems. Better outcomes."}</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 13, color: "white", marginBottom: 14 }}>{ar ? "الخدمات" : "Services"}</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9, padding: 0, margin: 0 }}>
              {["Research & Evaluation", "Third-Party Monitoring", "Strategy & Governance", "Capacity Building"].map((l) => (
                <li key={l}><a href="#" className="footer-link">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 13, color: "white", marginBottom: 14 }}>{ar ? "روابط سريعة" : "Quick Links"}</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9, padding: 0, margin: 0 }}>
              {(["about", "services", "research", "updates"] as Page[]).map((p, i) => (
                <li key={p}>
                  <button onClick={() => onNavigate(p)} className="footer-link" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    {ar ? ["من نحن", "خدماتنا", "الأبحاث", "التحديثات"][i] : ["About Us", "Services", "Research", "Updates"][i]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #374151", marginBottom: 28 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 28, marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid #374151" }}>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 13, color: "white", marginBottom: 10 }}>{ar ? "اتصل بنا" : "Contact Us"}</h4>
            <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 5 }}>📍 Sana'a, Yemen</p>
            <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 5 }}>📧 info@medveritas.com</p>
            <p style={{ fontSize: 12, color: "#9ca3af" }}>📱 +967 (0) XXX XXX XXX</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 13, color: "white", marginBottom: 10 }}>{ar ? "تابعنا" : "Follow Us"}</h4>
            <div style={{ display: "flex", gap: 14 }}>
              {["LinkedIn", "Twitter"].map((s) => (<a key={s} href="#" className="footer-link">{s}</a>))}
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 13, color: "white", marginBottom: 10 }}>{ar ? "النشرة البريدية" : "Newsletter"}</h4>
            <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>{ar ? "احصل على آخر أبحاثنا ومقالاتنا" : "Get updates on our latest research and insights"}</p>
            <div style={{ display: "flex" }}>
              <input className="subscribe-input" placeholder={ar ? "بريدك الإلكتروني" : "Your email"} />
              <button style={{ padding: "10px 16px", background: "#22c55e", color: "#0f172a", fontWeight: 700, fontSize: 12, border: "none", borderRadius: "0 4px 4px 0", cursor: "pointer", transition: "background .2s" }}
                onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = "#16a34a"; }}
                onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = "#22c55e"; }}>
                {ar ? "اشترك" : "Go"}
              </button>
            </div>
          </div>
        </div>
        <p style={{ fontSize: 12, color: "#6b7280" }}>© {year} Medveritas. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// Coming Soon placeholder for other pages
// ─────────────────────────────────────────────
function ComingSoon({ lang, title, titleAr }: { lang: Lang; title: string; titleAr: string }): React.ReactElement {
  const ar = lang === "ar";
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
      <div style={{ textAlign: "center", padding: "0 2rem" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🚧</div>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>{ar ? titleAr : title}</h2>
        <p style={{ fontSize: 16, color: "#6b7280" }}>{ar ? "هذه الصفحة قيد الإنشاء" : "This page is coming soon"}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// App Root
// ─────────────────────────────────────────────
export default function MedveritasHome(): React.ReactElement {
  const [lang, setLang] = useState<Lang>("en");
  const [page, setPage] = useState<Page>("home");
  const toggleLang = (): void => setLang((l) => (l === "en" ? "ar" : "en"));

  const navigate = (p: Page): void => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = (): React.ReactElement => {
    switch (page) {
      case "about":
        return <AboutPage lang={lang} />;
      case "services":
        return <ComingSoon lang={lang} title="Services" titleAr="خدماتنا" />;
      case "research":
        return <ComingSoon lang={lang} title="Research" titleAr="الأبحاث" />;
      case "updates":
        return <ComingSoon lang={lang} title="Updates" titleAr="التحديثات" />;
      default:
        return (
          <>
            <Hero lang={lang} />
            <WhoWeAre lang={lang} />
            <Services lang={lang} />
            <ImpactReport lang={lang} />
            <OurResults lang={lang} />
            <CTA lang={lang} />
            <RecentNews lang={lang} />
          </>
        );
    }
  };

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      style={{
        fontFamily: lang === "ar"
          ? "'Cairo', 'Tajawal', Arial, sans-serif"
          : "'Inter', 'Segoe UI', Arial, sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{GLOBAL_CSS}</style>
      {lang === "ar" && (
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');`}</style>
      )}
      <ScrollProgress />
      <AnnouncementBar lang={lang} />
      <Navbar lang={lang} onLangToggle={toggleLang} onNavigate={navigate} currentPage={page} />
      {page !== "home" && (
        <Breadcrumb
          label={NAV_ITEMS.find(n => n.page === page)?.label ?? ""}
          labelAr={NAV_ITEMS.find(n => n.page === page)?.labelAr ?? ""}
          lang={lang}
          onHome={() => navigate("home")}
        />
      )}
      {renderPage()}
      <Footer lang={lang} onNavigate={navigate} />
    </div>
  );
}
