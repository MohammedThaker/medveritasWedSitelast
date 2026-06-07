import { useState, useEffect, useRef } from "react";
import type { MouseEvent, RefObject } from "react";
import type React from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type Lang = "en" | "ar";

interface ServiceItem {
  num: string;
  title: string;
  desc: string;
}

interface StatItem {
  num: string;
  label: string;
}

interface ResultItem {
  num: string;
  unit: string;
  label: string;
}

interface NewsItem {
  type: string;
  date: string;
  title: string;
  body: string;
}

interface NavGroup {
  title: string;
  links: string[];
}

interface NavDropdown {
  desc: string;
  groups: NavGroup[];
}

interface NavItem {
  label: string;
  labelAr: string;
  dropdown: NavDropdown;
}

interface ArContent {
  nav: string[];
  services_title: string;
  services_sub: string;
  who_tag: string;
  who_title: string;
  who_p1: string;
  who_p2: string;
  results_title: string;
  results_sub: string;
  cta_title: string;
  cta_sub: string;
  news_title: string;
  news_sub: string;
  subscribe: string;
  meet_team: string;
  learn_more: string;
  read_study: string;
  view_all: string;
  request: string;
  contact: string;
  services: ServiceItem[];
  impact_tag: string;
  impact_title: string;
  impact_p: string;
}

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
    label: "About Us",
    labelAr: "من نحن",
    dropdown: {
      desc: "Yemen's leading independent research and monitoring institution.",
      groups: [
        { title: "Our Story", links: ["Mission and Vision", "Our History", "Our Team"] },
        { title: "Work With Us", links: ["Careers", "Partnerships"] },
      ],
    },
  },
  {
    label: "Services",
    labelAr: "خدماتنا",
    dropdown: {
      desc: "Comprehensive research and monitoring solutions for complex environments.",
      groups: [
        { title: "", links: ["Research & Evaluation", "Third-Party Monitoring", "Strategy & Governance", "Capacity Building"] },
      ],
    },
  },
  {
    label: "Research",
    labelAr: "الأبحاث",
    dropdown: {
      desc: "",
      groups: [{ title: "", links: ["Reports Library", "Case Studies", "Methodologies"] }],
    },
  },
  {
    label: "Updates",
    labelAr: "التحديثات",
    dropdown: {
      desc: "",
      groups: [{ title: "", links: ["News & Announcements", "Insights Blog", "Newsletters"] }],
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
// Global CSS
// ─────────────────────────────────────────────

const GLOBAL_CSS = `
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }

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
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

// ─────────────────────────────────────────────
// Arrow Icon (reusable)
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
      const scrolled = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setProgress(Math.round(scrolled * 100));
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div className="progress-bar" style={{ width: `${progress}%` }} />;
}

// ─────────────────────────────────────────────
// AnnouncementBar
// ─────────────────────────────────────────────

interface AnnouncementBarProps { lang: Lang; }

function AnnouncementBar({ lang }: AnnouncementBarProps): React.ReactElement | null {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div style={{ background: "#1a1a1a", color: "white", textAlign: "center", padding: "9px 40px", fontSize: 12, lineHeight: 1.5, position: "relative" }}>
      {lang === "ar"
        ? "لمعرفة المزيد عن أعمالنا في اليمن تفضل بزيارة تقرير التأثير لعام 2025."
        : "New: Our 2025 Impact Report is now available. Read our latest findings from across Yemen."}
      <a
        href="#"
        style={{ color: "#4ade80", textDecoration: "underline", marginLeft: 6, marginRight: 6, transition: "opacity .2s" }}
        onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.opacity = ".7"; }}
        onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.opacity = "1"; }}
      >
        {lang === "ar" ? "اقرأ الآن" : "Read Now"}
      </a>
      <button
        onClick={() => setVisible(false)}
        style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 18, lineHeight: 1, transition: "opacity .2s" }}
        onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.opacity = ".6"; }}
        onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.opacity = "1"; }}
      >×</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// DropdownMenu
// ─────────────────────────────────────────────

interface DropdownMenuProps { item: NavItem; lang: Lang; }

function DropdownMenu({ item, lang }: DropdownMenuProps): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{ position: "relative", height: "100%" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className={`nav-link-btn${open ? " active" : ""}`}>
        {lang === "ar" ? item.labelAr : item.label}
        <svg
          width="11" height="11" viewBox="0 0 12 12" fill="none"
          style={{ transition: "transform .25s", transform: open ? "rotate(180deg)" : "none" }}
        >
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
                <a key={li} href="#" className="dropdown-link">{link}</a>
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

interface MobileMenuProps { open: boolean; onClose: () => void; lang: Lang; }

function MobileMenu({ open, onClose, lang }: MobileMenuProps): React.ReactElement {
  const [openSub, setOpenSub] = useState<number | null>(null);

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 9998, animation: "fadeIn .2s ease" }}
        />
      )}
      <div style={{
        position: "fixed", top: 0, right: 0, width: "min(320px, 90vw)", height: "100%",
        background: "white", zIndex: 9999, overflowY: "auto",
        boxShadow: "-4px 0 20px rgba(0,0,0,.15)",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform .3s cubic-bezier(.4,0,.2,1)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 34, height: 34, background: "#0f172a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "white" }}>MV</div>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Medveritas</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: 22, color: "#6b7280", cursor: "pointer", lineHeight: 1, transition: "color .2s" }}
            onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.color = "#0f172a"; }}
            onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.color = "#6b7280"; }}
          >×</button>
        </div>

        {/* Nav items */}
        <div>
          {NAV_ITEMS.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenSub(openSub === i ? null : i)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 20px", fontSize: 18, fontWeight: 500,
                  color: openSub === i ? "#060706" : "#1a1a1a",
                  background: openSub === i ? "#f0fdf4" : "none",
                  border: "none", borderBottom: "1px solid #f3f4f6", cursor: "pointer",
                  transition: "background .15s, color .15s",
                }}
              >
                {lang === "ar" ? item.labelAr : item.label}
                <svg
                  width="11" height="11" viewBox="0 0 12 12" fill="none"
                  style={{ transition: "transform .25s", transform: openSub === i ? "rotate(180deg)" : "none" }}
                >
                  <path d="M2 4l4 4 4-4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div style={{
                background: "#f9fafb",
                borderBottom: openSub === i ? "1px solid #e5e7eb" : "none",
                maxHeight: openSub === i ? "400px" : "0",
                overflow: "hidden",
                transition: "max-height .3s cubic-bezier(.4,0,.2,1)",
              }}>
                {item.dropdown.groups.flatMap((g) => g.links).map((link, li) => (
                  <a
                    key={li}
                    href="#"
                    style={{ display: "block", padding: "10px 28px", fontSize: 13, color: "#374151", textDecoration: "none", borderBottom: "1px solid #f0f0f0", transition: "color .15s, background .15s" }}
                    onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.color = "#16a34a"; }}
                    onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "#374151"; }}
                  >{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ margin: "16px 20px" }}>
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            {lang === "ar" ? AR.subscribe : "تواصل معانا"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────

interface NavbarProps { lang: Lang; onLangToggle: () => void; }

function Navbar({ lang, onLangToggle }: NavbarProps): React.ReactElement {
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
      <nav style={{
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky", top: 0, zIndex: 1000,
        boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,.10)" : "0 1px 4px rgba(0,0,0,.06)",
        transition: "box-shadow .3s",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

          {/* Logo */}
          <a
            href="#"
            style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0, transition: "opacity .2s" }}
            onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.opacity = ".8"; }}
            onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.opacity = "1"; }}
          >
            <div style={{ width: 40, height: 40, background: "#0f172a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, color: "white", flexShrink: 0 }}>MV</div>
            <span style={{ fontWeight: 700, fontSize: 17, color: "#0f172a", letterSpacing: "-0.3px" }}>Medveritas</span>
          </a>

          {/* Desktop nav */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", height: 68 }}>
              {NAV_ITEMS.map((item, i) => <DropdownMenu key={i} item={item} lang={lang} />)}
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
                {lang === "ar" ? AR.subscribe : "تواصل معانا"}
              </button>
            )}

            {isMobile && (
              <button
                onClick={() => setMenuOpen(true)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "#1a1a1a", display: "flex", alignItems: "center", transition: "color .2s" }}
                onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.color = "#16a34a"; }}
                onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.color = "#1a1a1a"; }}
                aria-label="Open menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </nav>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} lang={lang} />
    </>
  );
}

// ─────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────

interface SectionProps { lang: Lang; }

function Hero({ lang }: SectionProps): React.ReactElement {
  return (
    <section style={{ position: "relative", width: "100%", height: "100vh", minHeight: 500, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/surveyor.png')", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.45) contrast(1.1)" }} />
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
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 3 }}>
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </button>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
        <div style={{ width: 22, height: 36, border: "2px solid rgba(255,255,255,.7)", borderRadius: 11, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 5 }}>
          <div style={{ width: 3, height: 7, background: "white", borderRadius: 2, animation: "scrollBounce 1.5s infinite" }} />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// WhoWeAre
// ─────────────────────────────────────────────

function WhoWeAre({ lang }: SectionProps): React.ReactElement {
  const [ref, visible] = useScrollReveal();
  const [refImg, visibleImg] = useScrollReveal();
  const ar = lang === "ar";

  return (
    <section style={{ background: "#0f172a", color: "white", padding: "80px 0" }}>
      <div style={{ maxWidth: 1536, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 56, alignItems: "center" }}>

          <div ref={ref} className={`reveal-left${visible ? " visible" : ""}`}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#4ade80", letterSpacing: 3, marginBottom: 14, textTransform: "uppercase" }}>
              {ar ? AR.who_tag : "OUR ADVANTAGE"}
            </div>
            <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, marginBottom: 18, lineHeight: 1.2 }}>
              {ar ? AR.who_title : "Local Access, Global Standards"}
            </h2>
            <p style={{ fontSize: 18, color: "#d1d5db", lineHeight: 1.75, marginBottom: 14 }}>
              {ar ? AR.who_p1 : "Medveritas combines unparalleled local access with international methodological rigor. With more than 300 field staff deployed across all governorates of Yemen, we collect high-quality data in the most challenging and hard-to-reach areas."}
            </p>
            <p style={{ fontSize: 18, color: "#d1d5db", lineHeight: 1.75, marginBottom: 20 }}>
              {ar ? AR.who_p2 : "Our teams are trained to global standards and our processes are built on internationally recognized methodologies, ensuring that every study we deliver is credible, reliable, and actionable."}
            </p>

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

            <button className="btn-primary" style={{ marginTop: 22 }}>
              {ar ? AR.meet_team : "Meet Our Team"}
            </button>
          </div>

          <div
            ref={refImg}
            className={`reveal-right${visibleImg ? " visible" : ""}`}
            style={{ position: "relative", height: 360, borderRadius: 8, overflow: "hidden" }}
          >
            <img
              src="surveyor.png"
              alt="Team"
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s ease" }}
              onMouseEnter={(e: MouseEvent<HTMLImageElement>) => { e.currentTarget.style.transform = "scale(1.04)"; }}
              onMouseLeave={(e: MouseEvent<HTMLImageElement>) => { e.currentTarget.style.transform = "scale(1)"; }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,23,42,.5),transparent)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Services
// ─────────────────────────────────────────────

function Services({ lang }: SectionProps): React.ReactElement {
  const [ref, visible] = useScrollReveal();
  const ar = lang === "ar";
  const displayServices: ServiceItem[] = ar ? AR.services : SERVICES;

  return (
    <section style={{ background: "white", padding: "80px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div ref={ref} className={`reveal${visible ? " visible" : ""}`}>
          <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>
            {ar ? AR.services_title : "Our Services"}
          </h2>
          <p style={{ fontSize: 18, color: "#6b7280", marginBottom: 14 }}>
            {ar ? AR.services_sub : "Comprehensive research, monitoring, and strategy solutions for complex environments"}
          </p>
          <div style={{ width: visible ? 52 : 0, height: 4, background: "#16a34a", marginBottom: 48, transition: "width .7s ease .3s" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 32, marginBottom: 40 }}>
          {displayServices.map((s, i) => (
            <div key={i} className={`service-card reveal stagger-${i + 1}${visible ? " visible" : ""}`}>
              <div style={{ fontSize: 44, fontWeight: 700, color: "#16a34a", marginBottom: 10, lineHeight: 1 }}>{s.num}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, marginBottom: 18 }}>{s.desc}</p>
              <a
                href="#"
                style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600, color: "#0f172a", textDecoration: "none", transition: "color .2s, gap .2s" }}
                onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = "#16a34a"; e.currentTarget.style.gap = "9px"; }}
                onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = "#0f172a"; e.currentTarget.style.gap = "5px"; }}
              >
                {ar ? AR.learn_more : "Learn More"}
                <ArrowIcon />
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

// ─────────────────────────────────────────────
// ImpactReport
// ─────────────────────────────────────────────

function ImpactReport({ lang }: SectionProps): React.ReactElement {
  const [refL, visibleL] = useScrollReveal();
  const [refR, visibleR] = useScrollReveal();
  const ar = lang === "ar";

  return (
    <section style={{ background: "#f8fafc", padding: "80px 0" }}>
      <div style={{ maxWidth: 1536, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 56, alignItems: "center" }}>

          <div ref={refL} className={`reveal-left${visibleL ? " visible" : ""}`}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#16a34a", letterSpacing: 3, marginBottom: 14, textTransform: "uppercase" }}>
              {ar ? AR.impact_tag : "FEATURED CASE STUDY"}
            </div>
            <h2 style={{ fontSize: "48px", fontWeight: 700, color: "#0f172a", marginBottom: 18, lineHeight: 1.2 }}>
              {ar ? AR.impact_title : "Reaching the Unreachable"}
            </h2>
            <p style={{ fontSize: 18, color: "#374151", lineHeight: 1.75, marginBottom: 14 }}>
              <strong>119-District Polio Vaccination Coverage Survey</strong>
            </p>
            <p style={{ fontSize: 18, color: "#374151", lineHeight: 1.75, marginBottom: 20 }}>
              {ar ? AR.impact_p : "Medveritas conducted a comprehensive polio vaccination coverage survey across 119 districts in Yemen, including high-risk and hard-to-reach areas. Our nationwide field network and robust methodology delivered high-quality, actionable data that informed microplanning and strengthened immunization programs."}
            </p>
            <button className="btn-primary">
              {ar ? AR.read_study : "Read Full Case Study"}
              <ArrowIcon />
            </button>
          </div>

          <div
            ref={refR}
            className={`impact-card reveal-right${visibleR ? " visible" : ""}`}
            style={{ border: "4px solid #16a34a", background: "white", borderRadius: 8, padding: 28, boxShadow: "0 6px 20px rgba(0,0,0,.07)" }}
          >
            <div style={{ fontSize: 60, fontWeight: 700, color: "#16a34a", textAlign: "center", marginBottom: 3 }}>119</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", textAlign: "center", marginBottom: 18 }}>
              {ar ? "مديرية شملها المسح" : "Districts Surveyed"}
            </div>
            <img
              src="/surveyor.png"
              alt="Case Study"
              style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 4, marginBottom: 18, transition: "transform .4s ease" }}
              onMouseEnter={(e: MouseEvent<HTMLImageElement>) => { e.currentTarget.style.transform = "scale(1.03)"; }}
              onMouseLeave={(e: MouseEvent<HTMLImageElement>) => { e.currentTarget.style.transform = "scale(1)"; }}
            />
            <h3 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 9 }}>
              {ar ? "مسح تغطية التطعيم ضد شلل الأطفال" : "Polio Vaccination Coverage Survey"}
            </h3>
            <p style={{ fontSize: 17, color: "#6b7280", margin: 0 }}>
              {ar ? "جمع بيانات عالية الجودة في المناطق النائية باستخدام استراتيجيات ميدانية تكيفية." : "High-quality data collection across hard-to-reach areas using adaptive field strategies and real-time monitoring."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// OurResults
// ─────────────────────────────────────────────

function OurResults({ lang }: SectionProps): React.ReactElement {
  const [ref, visible] = useScrollReveal();
  const ar = lang === "ar";

  return (
    <section style={{ background: "white", padding: "80px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div ref={ref} className={`reveal${visible ? " visible" : ""}`} style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>
            {ar ? AR.results_title : "Why Choose Medveritas"}
          </h2>
          <p style={{ fontSize: 18, color: "#6b7280", maxWidth: 672, margin: "0 auto", lineHeight: 1.6 }}>
            {ar ? AR.results_sub : "Trusted by leading international organizations for rigorous research and monitoring in Yemen's most challenging contexts"}
          </p>
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
          <div style={{ fontSize: 14, fontWeight: 700, color: "#16a34a", letterSpacing: 1, marginBottom: 20, textTransform: "uppercase" }}>
            {ar ? "موثوق بها من قِبل كبرى المنظمات" : "TRUSTED BY LEADING ORGANIZATIONS"}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 28 }}>
            {PARTNERS.map((p) => (
              <span
                key={p}
                style={{ fontSize: 18, fontWeight: 600, color: "#6b7280", transition: "color .2s, transform .2s", cursor: "default", display: "inline-block" }}
                onMouseEnter={(e: MouseEvent<HTMLSpanElement>) => { e.currentTarget.style.color = "#16a34a"; e.currentTarget.style.transform = "scale(1.1)"; }}
                onMouseLeave={(e: MouseEvent<HTMLSpanElement>) => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.transform = "scale(1)"; }}
              >{p}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// CTA
// ─────────────────────────────────────────────

function CTA({ lang }: SectionProps): React.ReactElement {
  const [ref, visible] = useScrollReveal();
  const ar = lang === "ar";

  return (
    <section style={{ background: "#0f172a", color: "white", padding: "80px 0" }}>
      <div
        ref={ref}
        className={`reveal${visible ? " visible" : ""}`}
        style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", padding: "0 1rem" }}
      >
        <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, marginBottom: 18 }}>
          {ar ? AR.cta_title : "Ready to Work Together?"}
        </h2>
        <p style={{ fontSize: 18, color: "#d1d5db", marginBottom: 32, lineHeight: 1.7 }}>
          {ar ? AR.cta_sub : "Let's discuss how Medveritas can provide the rigorous evidence you need to ensure your next intervention in Yemen is a success."}
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 40, flexWrap: "wrap" }}>
          <button
            style={{ padding: "11px 26px", background: "#22c55e", color: "#0f172a", fontWeight: 700, fontSize: 13, borderRadius: 4, border: "none", cursor: "pointer", transition: "background .2s, transform .15s" }}
            onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.transform = "none"; }}
          >
            {ar ? AR.request : "Request a Proposal"}
          </button>
          <button className="btn-outline-green">
            {ar ? AR.contact : "Get in Touch"}
          </button>
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

// ─────────────────────────────────────────────
// RecentNews
// ─────────────────────────────────────────────

function RecentNews({ lang }: SectionProps): React.ReactElement {
  const [ref, visible] = useScrollReveal();
  const ar = lang === "ar";

  return (
    <section style={{ background: "#f8fafc", padding: "80px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div ref={ref} className={`reveal${visible ? " visible" : ""}`}>
          <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>
            {ar ? AR.news_title : "Insights & Thought Leadership"}
          </h2>
          <p style={{ fontSize: 18, color: "#6b7280", marginBottom: 14 }}>
            {ar ? AR.news_sub : "Research briefs, methodology spotlights, and sector analysis from our team"}
          </p>
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
          <button className="btn-outline-dark">
            {ar ? AR.view_all : "View All Insights"}
            <ArrowIcon />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────

function Footer({ lang }: SectionProps): React.ReactElement {
  const year = new Date().getFullYear();
  const ar = lang === "ar";

  return (
    <footer style={{ background: "#0f172a", color: "white", padding: "64px 0 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 40, marginBottom: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, background: "#22c55e", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#0f172a" }}>MV</div>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Medveritas</span>
            </div>
            <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6 }}>
              {ar ? "رؤى موثوقة. أنظمة أقوى. نتائج أفضل." : "Trusted insights. Stronger systems. Better outcomes."}
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 13, color: "white", marginBottom: 14 }}>{ar ? "الخدمات" : "Services"}</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9, padding: 0, margin: 0 }}>
              {["Research & Evaluation", "Third-Party Monitoring", "Strategy & Governance", "Capacity Building"].map((l) => (
                <li key={l}><a href="#" className="footer-link">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 13, color: "white", marginBottom: 14 }}>{ar ? "روابط سريعة" : "Quick Links"}</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9, padding: 0, margin: 0 }}>
              {["About Us", "Services", "Insights", "Contact"].map((l) => (
                <li key={l}><a href="#" className="footer-link">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #374151", marginBottom: 28 }} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 28, marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid #374151" }}>
          {/* Contact */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 13, color: "white", marginBottom: 10 }}>{ar ? "اتصل بنا" : "Contact Us"}</h4>
            <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 5 }}>📍 Sana'a, Yemen</p>
            <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 5 }}>📧 info@medveritas.com</p>
            <p style={{ fontSize: 12, color: "#9ca3af" }}>📱 +967 (0) XXX XXX XXX</p>
          </div>

          {/* Social */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 13, color: "white", marginBottom: 10 }}>{ar ? "تابعنا" : "Follow Us"}</h4>
            <div style={{ display: "flex", gap: 14 }}>
              {["LinkedIn", "Twitter"].map((s) => (
                <a key={s} href="#" className="footer-link">{s}</a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 13, color: "white", marginBottom: 10 }}>{ar ? "النشرة البريدية" : "Newsletter"}</h4>
            <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>
              {ar ? "احصل على آخر أبحاثنا ومقالاتنا" : "Get updates on our latest research and insights"}
            </p>
            <div style={{ display: "flex" }}>
              <input className="subscribe-input" placeholder={ar ? "بريدك الإلكتروني" : "Your email"} />
              <button
                style={{ padding: "10px 16px", background: "#22c55e", color: "#0f172a", fontWeight: 700, fontSize: 12, border: "none", borderRadius: "0 4px 4px 0", cursor: "pointer", transition: "background .2s" }}
                onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = "#16a34a"; }}
                onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = "#22c55e"; }}
              >
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
// App Root
// ─────────────────────────────────────────────

export default function MedveritasHome(): React.ReactElement {
  const [lang, setLang] = useState<Lang>("en");
  const toggleLang = (): void => setLang((l) => (l === "en" ? "ar" : "en"));

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
      <Navbar lang={lang} onLangToggle={toggleLang} />
      <Hero lang={lang} />
      <WhoWeAre lang={lang} />
      <Services lang={lang} />
      <ImpactReport lang={lang} />
      <OurResults lang={lang} />
      <CTA lang={lang} />
      <RecentNews lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}
