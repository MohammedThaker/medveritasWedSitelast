/**
 * MedVeritas — Premium Healthcare Homepage v2.0
 * Stack: React + TypeScript + framer-motion
 * Install: npm install framer-motion
 *          npm install -D @types/react @types/react-dom
 *
 * Design direction: "Clinical Precision meets Human Warmth"
 */

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import type {
  ReactNode,
  MouseEvent,
  KeyboardEvent,
   FC,
} from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useInView,
  useReducedMotion,
} from "framer-motion";

/* ═══════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════ */
const T = {
  cyan:       "#29AAE1",
  cyanDark:   "#1a8bbf",
  cyanLight:  "rgba(41,170,225,.12)",
  green:      "#5BBB6B",
  greenDark:  "#3d9e4d",
  greenLight: "rgba(91,187,107,.12)",
  navy:       "#0D1B3E",
  navyLight:  "#162347",
  navyMid:    "#1a2d52",
  white:      "#ffffff",
  off:        "#F7F9FC",
  border:     "#E2E8F0",
  muted:      "#6B7A9A",
  body:       "#2D3748",
  glass:      "rgba(255,255,255,.07)",
  glassBorder:"rgba(255,255,255,.12)",
  xs:  "0 1px 3px rgba(13,27,62,.06)",
  sm:  "0 2px 12px rgba(13,27,62,.08)",
  md:  "0 8px 32px rgba(13,27,62,.12)",
  lg:  "0 20px 60px rgba(13,27,62,.16)",
  xl:  "0 32px 80px rgba(13,27,62,.22)",
  display:   "'Syne', sans-serif",
  body_font: "'DM Sans', system-ui, sans-serif",
  r4:   "4px",
  r8:   "8px",
  r12:  "12px",
  r16:  "16px",
  r24:  "24px",
  r32:  "32px",
  full: "9999px",
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
} as const;

/* ═══════════════════════════════════════════
   TYPES
═══════════════════════════════════════════ */
interface ServiceItem {
  Icon: FC;
  title: string;
  desc: string;
  color: string;
  bg: string;
}

interface StatItem {
  value: string;
  label: string;
  Icon: FC;
}

interface ProjectItem {
  id: number;
  title: string;
  desc: string;
  category: string;
  image: string;
}

interface WhyItem {
  Icon: FC;
  title: string;
  desc: string;
  color: string;
}

interface FooterCol {
  title: string;
  links: string[];
}

interface HeroCard {
  Icon: FC;
  title: string;
  sub: string;
}

interface BtnProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  href?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  className?: string;
}

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  style?: React.CSSProperties;
  className?: string;
}

interface CounterProps {
  end: string;
  suffix?: string;
  duration?: number;
}

interface SectionLabelProps {
  label: string;
  color?: string;
}

interface IconProps {
  dir?: "right" | "left" | "up";
  size?: number;
}

/* ═══════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════ */
const GlobalStyles: FC = memo(() => {
  useEffect(() => {
    if (document.getElementById("mv-global-v2")) return;
    const s = document.createElement("style");
    s.id = "mv-global-v2";
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; font-size: 16px; }
      body { font-family: 'DM Sans', system-ui, sans-serif; color: #2D3748; background: #fff; overflow-x: hidden; line-height: 1.6; }
      img { display: block; max-width: 100%; }
      a { text-decoration: none; color: inherit; }
      button { font-family: inherit; cursor: pointer; border: none; background: none; }

      :focus-visible { outline: 2px solid #29AAE1; outline-offset: 3px; border-radius: 4px; }
      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: #f0f4f8; }
      ::-webkit-scrollbar-thumb { background: #29AAE1; border-radius: 3px; }

      @media (prefers-reduced-motion: no-preference) {
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.5; transform:scale(.8); } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      }
      @media (prefers-reduced-motion: reduce) {
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.7; } }
        @keyframes float { }
        @keyframes marquee { }
      }

      .mv-ripple { position:relative; overflow:hidden; }
      .mv-ripple::after {
        content:''; position:absolute; inset:0;
        background: radial-gradient(circle, rgba(255,255,255,.25) 0%, transparent 65%);
        opacity:0; transition: opacity .3s;
      }
      .mv-ripple:hover::after { opacity:1; }

      .mv-card:hover {
        box-shadow: 0 0 0 1px rgba(41,170,225,.2), 0 16px 48px rgba(41,170,225,.12) !important;
      }

      .mv-desktop-nav { display:flex !important; }
      .mv-desktop-cta { display:inline-flex !important; }
      .mv-hamburger { display:none !important; }

      @media (max-width: 900px) {
        .mv-desktop-nav { display:none !important; }
        .mv-desktop-cta { display:none !important; }
        .mv-hamburger { display:flex !important; }
      }

      .mv-hero-grid { display:grid; grid-template-columns:1.1fr 1fr; gap:clamp(2rem,5vw,5rem); align-items:center; }
      .mv-services-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }
      .mv-why-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
      .mv-footer-grid { display:grid; grid-template-columns:1.8fr 1fr 1fr 1fr 1.4fr; gap:clamp(1.5rem,4vw,3rem); }
      .mv-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
      .mv-impact-grid { display:grid; grid-template-columns:auto 1fr; gap:clamp(2rem,6vw,6rem); align-items:center; }

      @media (max-width: 1024px) {
        .mv-services-grid { grid-template-columns:1fr 1fr; }
        .mv-why-grid { grid-template-columns:1fr 1fr; }
        .mv-footer-grid { grid-template-columns:1fr 1fr 1fr; }
        .mv-stats-grid { grid-template-columns:repeat(2,1fr); }
        .mv-impact-grid { grid-template-columns:1fr; }
      }
      @media (max-width: 640px) {
        .mv-hero-grid { grid-template-columns:1fr !important; }
        .mv-services-grid { grid-template-columns:1fr; }
        .mv-why-grid { grid-template-columns:1fr 1fr; }
        .mv-footer-grid { grid-template-columns:1fr 1fr; }
        .mv-stats-grid { grid-template-columns:1fr 1fr; }
      }
      @media (max-width: 420px) {
        .mv-why-grid { grid-template-columns:1fr; }
        .mv-footer-grid { grid-template-columns:1fr; }
      }

      .mv-carousel::-webkit-scrollbar { display:none; }
      .mv-carousel { -ms-overflow-style:none; scrollbar-width:none; }
    `;
    document.head.appendChild(s);
  }, []);
  return null;
});
GlobalStyles.displayName = "GlobalStyles";

/* ═══════════════════════════════════════════
   REUSABLE: SCROLL REVEAL
═══════════════════════════════════════════ */
const Reveal: FC<RevealProps> = memo(({ children, delay = 0, y = 24, style, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: shouldReduce ? 0 : y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: shouldReduce ? 0.2 : 0.6, delay: shouldReduce ? 0 : delay, ease: T.ease }}
      style={style}
    >
      {children}
    </motion.div>
  );
});
Reveal.displayName = "Reveal";

/* ═══════════════════════════════════════════
   REUSABLE: ANIMATED COUNTER
═══════════════════════════════════════════ */
const Counter: FC<CounterProps> = memo(({ end, suffix = "", duration = 2 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduce = useReducedMotion();
  const [count, setCount] = useState(0);

  const endVal = useMemo(() => parseFloat(end.replace(/[^0-9.]/g, "")), [end]);
  const isMillion = end.includes("M");
  const isPlus = end.includes("+");

  useEffect(() => {
    if (!isInView) return;

  if (shouldReduce) {
    setTimeout(() => setCount(endVal), 0);
    return;
  }   
   const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(ease * endVal);
      if (progress < 1) requestAnimationFrame(step);
      else setCount(endVal);
    };
    requestAnimationFrame(step);
  }, [isInView, endVal, duration, shouldReduce]);

  return (
    <span ref={ref}>
      {isMillion ? count.toFixed(count < 10 ? 1 : 0) : Math.floor(count)}
      {isMillion ? "M" : ""}
      {isPlus ? "+" : ""}
      {suffix}
    </span>
  );
});
Counter.displayName = "Counter";

/* ═══════════════════════════════════════════
   REUSABLE: SECTION LABEL
═══════════════════════════════════════════ */
const SectionLabel: FC<SectionLabelProps> = memo(({ label, color = T.cyan }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
    <div style={{ width: 24, height: 2, background: color, borderRadius: 1 }} />
    <span style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color }}>{label}</span>
    <div style={{ width: 24, height: 2, background: color, borderRadius: 1 }} />
  </div>
));
SectionLabel.displayName = "SectionLabel";

/* ═══════════════════════════════════════════
   REUSABLE: BUTTON
═══════════════════════════════════════════ */
const Btn: FC<BtnProps> = memo(({ children, variant = "primary", href = "#", style, onClick, className }) => {
  const shouldReduce = useReducedMotion();

  const baseStyle: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "11px 26px", borderRadius: T.full,
    fontSize: "0.875rem", fontWeight: 600, letterSpacing: "-.01em",
    cursor: "pointer", transition: "all .25s ease",
    textDecoration: "none", flexShrink: 0,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: `linear-gradient(135deg, ${T.cyan} 0%, ${T.green} 100%)`,
      color: "#fff", border: "none",
      boxShadow: `0 6px 20px rgba(41,170,225,.38)`,
    },
    secondary: {
      background: "rgba(255,255,255,.09)",
      color: "#fff", border: "1.5px solid rgba(255,255,255,.22)",
      backdropFilter: "blur(10px)",
    },
    outline: {
      background: "transparent",
      color: T.navy, border: `1.5px solid ${T.border}`,
    },
    ghost: {
      background: T.cyanLight,
      color: T.cyan, border: `1.5px solid rgba(41,170,225,.25)`,
    },
  };

  return (
    <motion.a
      href={href}
      onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
      whileHover={shouldReduce ? {} : {
        scale: 1.03,
        boxShadow: variant === "primary" ? `0 8px 28px rgba(41,170,225,.5)` : undefined,
      }}
      whileTap={shouldReduce ? {} : { scale: 0.97 }}
      className={`${variant === "primary" ? "mv-ripple" : ""} ${className ?? ""}`}
      style={{ ...baseStyle, ...variantStyles[variant], ...style }}
    >
      {children}
    </motion.a>
  );
});
Btn.displayName = "Btn";

/* ═══════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════ */
const IconSearch: FC = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
));
IconSearch.displayName = "IconSearch";

const IconChart: FC = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
  </svg>
));
IconChart.displayName = "IconChart";

const IconShield: FC = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
));
IconShield.displayName = "IconShield";

const IconUsers: FC = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
));
IconUsers.displayName = "IconUsers";

const IconStar: FC = memo(() => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
));
IconStar.displayName = "IconStar";

const IconCheck: FC = memo(() => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="m20 6-11 11-5-5"/>
  </svg>
));
IconCheck.displayName = "IconCheck";

const IconArrow: FC<IconProps> = memo(({ dir = "right", size = 16 }) => {
  const paths: Record<string, string> = {
    right: "M5 12h14 M12 5l7 7-7 7",
    left:  "M19 12H5 M12 19l-7-7 7-7",
    up:    "M12 19V5 M5 12l7-7 7 7",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d={paths[dir]}/>
    </svg>
  );
});
IconArrow.displayName = "IconArrow";

const IconChevron: FC<{ size?: number }> = memo(({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
));
IconChevron.displayName = "IconChevron";

const IconMail: FC = memo(() => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/>
    <rect x="2" y="4" width="20" height="16" rx="2"/>
  </svg>
));
IconMail.displayName = "IconMail";

const IconPhone: FC = memo(() => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>
  </svg>
));
IconPhone.displayName = "IconPhone";

const IconPin: FC = memo(() => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
));
IconPin.displayName = "IconPin";

const IconLinkedIn: FC = memo(() => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
));
IconLinkedIn.displayName = "IconLinkedIn";

const IconTwitter: FC = memo(() => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
));
IconTwitter.displayName = "IconTwitter";

const IconFacebook: FC = memo(() => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
));
IconFacebook.displayName = "IconFacebook";

const IconYouTube: FC = memo(() => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
));
IconYouTube.displayName = "IconYouTube";

const IconMenu: FC = memo(() => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 12h18M3 6h18M3 18h18"/>
  </svg>
));
IconMenu.displayName = "IconMenu";

const IconClose: FC = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
));
IconClose.displayName = "IconClose";

const IconGlobe: FC = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2a14.5 14.5 0 0 1 0 20 14.5 14.5 0 0 1 0-20"/>
    <path d="M2 12h20"/>
  </svg>
));
IconGlobe.displayName = "IconGlobe";

const IconTarget: FC = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
));
IconTarget.displayName = "IconTarget";

const IconAward: FC = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
));
IconAward.displayName = "IconAward";

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const NAV_LINKS: string[] = ["Home", "About Us", "Services", "Projects", "Insights", "Careers", "Contact"];

const SERVICES: ServiceItem[] = [
  { Icon: IconSearch, title: "Research & Studies",  desc: "High-quality primary and secondary research to generate robust evidence for policy and program decisions.", color: T.cyan,  bg: T.cyanLight  },
  { Icon: IconChart,  title: "Data & Analytics",    desc: "Advanced data analytics and digital solutions that transform complex information into actionable insights.",  color: T.green, bg: T.greenLight },
  { Icon: IconShield, title: "Health Systems",      desc: "Comprehensive support for health system strengthening, reform design, and performance evaluation.",           color: T.cyan,  bg: T.cyanLight  },
  { Icon: IconUsers,  title: "Training & Capacity", desc: "Customized training programs and institutional capacity building for lasting local impact.",                   color: T.green, bg: T.greenLight },
];

const STATS: StatItem[] = [
  { value: "50+", label: "Projects Delivered",        Icon: IconTarget },
  { value: "5M+", label: "People Reached",             Icon: IconGlobe  },
  { value: "80+", label: "Reports & Publications",    Icon: IconStar   },
  { value: "30+", label: "National & Local Partners", Icon: IconAward  },
];

const CATEGORIES: string[] = ["All Projects", "Research & Studies", "Training & Capacity", "Health Systems", "Emergency Response"];

const PROJECTS: ProjectItem[] = [
  { id:1, title:"Health System Strengthening in Yemen", desc:"Improving health facilities and service delivery across 12 underserved governorates.", category:"Health Systems",        image:"https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80" },
  { id:2, title:"Disease Surveillance Enhancement",     desc:"Building national capacities for early detection and response to infectious diseases.",  category:"Research & Studies",   image:"https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=600&q=80" },
  { id:3, title:"Community Health Empowerment",         desc:"Engaging communities through participatory health promotion and education programs.",    category:"Training & Capacity", image:"https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80" },
  { id:4, title:"Humanitarian Health Response",         desc:"Providing life-saving support to vulnerable populations in conflict-affected areas.",    category:"Emergency Response",  image:"https://images.unsplash.com/photo-1593113616828-6f22bca04804?w=600&q=80" },
  { id:5, title:"Nutrition Assessment Study",           desc:"Assessing nutritional status and food security across four rural governorates.",          category:"Research & Studies",  image:"https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80" },
];

const WHY: WhyItem[] = [
  { Icon: IconTarget, title:"Evidence-Driven",  desc:"Our work is grounded in rigorous research methods and reliably verified data.",                        color: T.cyan  },
  { Icon: IconGlobe,  title:"Local & Global",   desc:"Deep local context understanding combined with international standards and global best practice.",     color: T.green },
  { Icon: IconChart,  title:"Impact Focused",   desc:"Committed to achieving measurable, sustainable impact that improves lives in every community.",        color: T.cyan  },
  { Icon: IconAward,  title:"Ethical & Quality",desc:"Upholding the highest standards of research ethics, data quality, and professional integrity.",       color: T.green },
];

const PARTNERS: string[] = ["World Health Organization", "UNICEF", "USAID", "The World Bank", "Gavi", "UNDP"];

const FOOTER_COLS: FooterCol[] = [
  { title: "Company",   links: ["About Us", "Our Team", "Careers", "News"] },
  { title: "Services",  links: ["Research & Studies", "Data & Analytics", "Health Systems", "Training & Capacity"] },
  { title: "Resources", links: ["Publications", "Reports", "Tools & Guidelines", "Blogs"] },
];

const HERO_CARDS: HeroCard[] = [
  { Icon: IconSearch, title: "Research & Studies",  sub: "Generating reliable evidence to inform policies and programs." },
  { Icon: IconChart,  title: "Data & Analytics",    sub: "Transforming data into actionable insights."                  },
  { Icon: IconShield, title: "Health Systems",      sub: "Strengthening systems for sustainable improvement."           },
  { Icon: IconUsers,  title: "Training & Capacity", sub: "Building skills and capacities for long-term impact."        },
];

const SOCIAL_ICONS: Array<{ Icon: FC; label: string }> = [
  { Icon: IconLinkedIn, label: "LinkedIn"  },
  { Icon: IconTwitter,  label: "Twitter"   },
  { Icon: IconFacebook, label: "Facebook"  },
  { Icon: IconYouTube,  label: "YouTube"   },
];

/* ═══════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════ */
const Navbar: FC = memo(() => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    return scrollY.on("change", (y: number) => setScrolled(y > 56));
  }, [scrollY]);

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), []);

  return (
    <>
      <motion.header
        role="banner"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: shouldReduce ? 0.2 : 0.55, ease: T.ease }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          height: 68, display: "flex", alignItems: "center",
          padding: "0 clamp(1.25rem, 4vw, 2.5rem)",
          background: scrolled ? "rgba(255,255,255,.97)" : "rgba(255,255,255,.9)",
          backdropFilter: "blur(24px) saturate(180%)",
          borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent",
          boxShadow: scrolled ? T.sm : "none",
          transition: "background .3s, border-color .3s, box-shadow .3s",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
          {/* Logo */}
          <a href="#" aria-label="MedVeritas home" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <path d="M8 8L20 20L8 32" stroke={T.green} strokeWidth="3.5" strokeLinecap="round"/>
              <path d="M20 8L32 20L20 32" stroke={T.cyan} strokeWidth="3.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: "1.2rem", color: T.navy, letterSpacing: "-.025em" }}>
              Med<span style={{ color: T.cyan }}>Veritas</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="mv-desktop-nav" style={{ gap: 2, alignItems: "center" }} aria-label="Primary navigation">
            {NAV_LINKS.filter((l) => l !== "Contact").map((link) => (
              <a key={link} href="#"
                style={{ padding: "6px 13px", borderRadius: T.r8, fontSize: ".875rem", fontWeight: 500, color: T.body, transition: "all .18s", whiteSpace: "nowrap" }}
                onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = T.off; e.currentTarget.style.color = T.navy; }}
                onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.body; }}>
                {link}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <Btn href="#contact" className="mv-desktop-cta" style={{ fontSize: ".85rem", padding: "9px 22px" }}>
            Get In Touch
            <span style={{ width: 22, height: 22, background: "rgba(255,255,255,.22)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconChevron size={12} />
            </span>
          </Btn>

          {/* Hamburger */}
          <motion.button
            className="mv-hamburger"
            onClick={toggleMobile}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            whileTap={shouldReduce ? {} : { scale: 0.9 }}
            style={{ width: 40, height: 40, borderRadius: T.r8, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: T.navy, background: "#fff" }}>
            {mobileOpen ? <IconClose /> : <IconMenu />}
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            role="dialog" aria-modal="true" aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: shouldReduce ? 0.1 : 0.28, ease: T.ease }}
            style={{ position: "fixed", top: 68, left: 0, right: 0, zIndex: 99, background: "rgba(255,255,255,.99)", backdropFilter: "blur(24px)", borderBottom: `1px solid ${T.border}`, padding: "1.25rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: 4, boxShadow: T.lg }}>
            {NAV_LINKS.map((link, i) => (
              <motion.a key={link} href="#" onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                style={{ padding: "11px 14px", borderRadius: T.r12, fontSize: ".975rem", fontWeight: 500, color: T.body, transition: "background .15s", display: "block" }}
                onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = T.off; }}
                onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = "transparent"; }}>
                {link}
              </motion.a>
            ))}
            <div style={{ marginTop: 8, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
              <Btn href="#contact" style={{ width: "100%", justifyContent: "center" }}>Get In Touch</Btn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
Navbar.displayName = "Navbar";

/* ═══════════════════════════════════════════
   STICKY CTA BAR
═══════════════════════════════════════════ */
const StickyCtaBar: FC = memo(() => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    return scrollY.on("change", (y: number) => setVisible(y > 600));
  }, [scrollY]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
          transition={{ duration: shouldReduce ? 0.1 : 0.35, ease: T.ease }}
          style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
            zIndex: 90, display: "flex", alignItems: "center", gap: 12,
            background: "rgba(13,27,62,.95)", backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,.12)",
            borderRadius: T.full, padding: "10px 10px 10px 22px",
            boxShadow: "0 16px 48px rgba(13,27,62,.4), 0 0 0 1px rgba(41,170,225,.15)",
            whiteSpace: "nowrap",
          }}>
          <span style={{ fontSize: ".85rem", fontWeight: 500, color: "rgba(255,255,255,.7)" }}>
            Ready to create impact?
          </span>
          <Btn href="mailto:info@medveritasye.com" style={{ padding: "9px 22px", fontSize: ".85rem" }}>
            Get In Touch <IconArrow size={14} />
          </Btn>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
StickyCtaBar.displayName = "StickyCtaBar";

/* ═══════════════════════════════════════════
   HERO
═══════════════════════════════════════════ */
const Hero: FC = memo(() => {
  const shouldReduce = useReducedMotion();

  const trustBadges = useMemo(() => [
    { Icon: IconChart,  label: "Evidence-Based"      },
    { Icon: IconGlobe,  label: "Global Standards"    },
    { Icon: IconTarget, label: "Sustainable Impact"  },
    { Icon: IconShield, label: "Trusted Partnerships"},
  ], []);

  return (
    <section
      aria-labelledby="hero-heading"
      style={{ position: "relative", paddingTop: 68, minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden", background: T.navy }}>

      {/* Background layers */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=80"
          alt=""
          role="presentation"
          loading="eager"
          decoding="async"
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: .14, filter: "saturate(0) contrast(1.1)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, ${T.navy} 45%, rgba(13,27,62,.85) 72%, rgba(41,170,225,.1) 100%)` }} />
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .035 }} aria-hidden="true">
          <pattern id="mv-dots" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="14" cy="14" r="1.2" fill="white"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#mv-dots)"/>
        </svg>
        {!shouldReduce && (
          <>
            <div style={{ position: "absolute", top: "12%", right: "8%", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, rgba(41,170,225,.1) 0%, transparent 68%)`, animation: "float 9s ease-in-out infinite" }} />
            <div style={{ position: "absolute", bottom: "8%", left: "4%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, rgba(91,187,107,.07) 0%, transparent 68%)`, animation: "float 12s ease-in-out infinite reverse" }} />
          </>
        )}
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", width: "100%", padding: "clamp(3rem,8vh,6rem) clamp(1.25rem,4vw,2.5rem)" }} className="mv-hero-grid">
        {/* Left */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .1, duration: shouldReduce ? .2 : .65, ease: T.ease }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px 5px 8px", background: "rgba(41,170,225,.1)", border: "1px solid rgba(41,170,225,.22)", borderRadius: T.full, marginBottom: 24 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.cyan, animation: "pulse 2.2s ease-in-out infinite" }} aria-hidden="true" />
            <span style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase", color: T.cyan }}>Evidence. Insight. Impact.</span>
          </motion.div>

          <motion.h1 id="hero-heading"
            initial={{ opacity: 0, y: shouldReduce ? 0 : 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .2, duration: shouldReduce ? .2 : .75, ease: T.ease }}
            style={{ fontFamily: T.display, fontSize: "clamp(2.4rem, 5vw, 3.9rem)", fontWeight: 800, color: "#fff", lineHeight: 1.08, letterSpacing: "-.032em", marginBottom: 24 }}>
            Data-driven solutions<br />for{" "}
            <span style={{ background: `linear-gradient(125deg, ${T.green} 0%, ${T.cyan} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              healthier communities
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: shouldReduce ? 0 : 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .3, duration: shouldReduce ? .2 : .65, ease: T.ease }}
            style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,.62)", lineHeight: 1.75, maxWidth: 500, marginBottom: 36 }}>
            MedVeritas is a health research and consulting firm generating evidence, strengthening systems, and improving lives in Yemen and beyond.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: shouldReduce ? 0 : 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .4, duration: shouldReduce ? .2 : .6, ease: T.ease }}
            style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 }}>
            <Btn href="#services">Explore Our Services <IconArrow size={15} /></Btn>
            <Btn href="#about" variant="secondary">Learn More About Us</Btn>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: .58, duration: .7 }}
            style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", paddingTop: 28, borderTop: "1px solid rgba(255,255,255,.1)" }}>
            {trustBadges.map(({ Icon: BadgeIcon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: T.cyan, opacity: .75 }}><BadgeIcon /></span>
                <span style={{ fontSize: ".76rem", fontWeight: 600, color: "rgba(255,255,255,.5)", whiteSpace: "nowrap" }}>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — service cards */}
        <motion.div
          initial={{ opacity: 0, x: shouldReduce ? 0 : 36 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: .35, duration: shouldReduce ? .2 : .85, ease: T.ease }}
          style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {HERO_CARDS.map((card, i) => (
            <motion.div key={card.title}
              initial={{ opacity: 0, x: shouldReduce ? 0 : 24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: .5 + i * .09, duration: .55, ease: T.ease }}
              whileHover={shouldReduce ? {} : { x: 5, boxShadow: `0 10px 32px rgba(41,170,225,.22)` }}
              style={{ display: "flex", alignItems: "center", gap: 16, padding: "15px 18px", background: T.glass, backdropFilter: "blur(20px) saturate(160%)", border: `1px solid ${T.glassBorder}`, borderRadius: T.r16, cursor: "pointer", transition: "all .25s ease" }}>
              <div style={{ width: 44, height: 44, borderRadius: 11, background: "rgba(41,170,225,.15)", border: "1px solid rgba(41,170,225,.22)", display: "flex", alignItems: "center", justifyContent: "center", color: T.cyan, flexShrink: 0 }}>
                <card.Icon />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.display, fontWeight: 700, fontSize: ".875rem", color: "#fff", marginBottom: 3 }}>{card.title}</div>
                <div style={{ fontSize: ".76rem", color: "rgba(255,255,255,.48)", lineHeight: 1.5 }}>{card.sub}</div>
              </div>
              <IconChevron size={15} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, zIndex: 2 }} aria-hidden="true">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }}>
          <path d="M0 60 L0 32 Q360 0 720 32 Q1080 60 1440 32 L1440 60 Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
});
Hero.displayName = "Hero";

/* ═══════════════════════════════════════════
   TRUSTED BY
═══════════════════════════════════════════ */
const TrustedBy: FC = memo(() => {
  const shouldReduce = useReducedMotion();
  const items = useMemo(() => [...PARTNERS, ...PARTNERS], []);

  return (
    <section aria-label="Our partners" style={{ background: "#fff", padding: "clamp(2rem,4vw,3.5rem) 0", borderBottom: `1px solid ${T.border}`, overflow: "hidden" }}>
      <Reveal>
        <p style={{ textAlign: "center", fontSize: ".6875rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: T.muted, marginBottom: 28 }}>
          Trusted by partners who share our mission
        </p>
      </Reveal>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to right, #fff, transparent)", zIndex: 2, pointerEvents: "none" }} aria-hidden="true" />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to left, #fff, transparent)", zIndex: 2, pointerEvents: "none" }} aria-hidden="true" />
        <div style={{ display: "flex", gap: 16, animation: shouldReduce ? "none" : "marquee 22s linear infinite", width: "max-content" }}>
          {items.map((p, i) => (
            <div key={`${p}-${i}`}
              style={{ padding: "10px 22px", borderRadius: T.r12, border: `1px solid ${T.border}`, fontSize: ".8rem", fontWeight: 700, color: T.muted, letterSpacing: ".04em", whiteSpace: "nowrap", flexShrink: 0 }}>
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
TrustedBy.displayName = "TrustedBy";

/* ═══════════════════════════════════════════
   SERVICES
═══════════════════════════════════════════ */
const Services: FC = memo(() => {
  const shouldReduce = useReducedMotion();
  return (
    <section id="services" aria-labelledby="services-heading" style={{ background: "#fff", padding: "clamp(4rem,8vw,7rem) clamp(1.25rem,4vw,2.5rem)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Reveal style={{ textAlign: "center", marginBottom: "clamp(2rem,5vw,4rem)" }}>
          <SectionLabel label="What We Do" />
          <h2 id="services-heading" style={{ fontFamily: T.display, fontSize: "clamp(1.875rem,4vw,2.875rem)", fontWeight: 800, color: T.navy, letterSpacing: "-.03em", marginBottom: 16, marginTop: 4 }}>Our Services</h2>
          <p style={{ fontSize: "1rem", color: T.muted, maxWidth: 460, margin: "0 auto", lineHeight: 1.75 }}>End-to-end support across the health program cycle.</p>
        </Reveal>

        <div className="mv-services-grid">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * .08}>
              <motion.div
                whileHover={shouldReduce ? {} : { y: -7 }}
                className="mv-card"
                style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: T.r24, padding: "32px 26px 26px", display: "flex", flexDirection: "column", cursor: "default", transition: "all .3s ease", position: "relative", overflow: "hidden", height: "100%", boxShadow: T.xs }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${s.color}, transparent 70%)`, borderRadius: `${T.r24} ${T.r24} 0 0` }} aria-hidden="true" />
                <div style={{ position: "absolute", top: 0, right: 0, width: 100, height: 100, background: `radial-gradient(circle at top right, ${s.color}14 0%, transparent 65%)`, pointerEvents: "none" }} aria-hidden="true" />
                <div style={{ width: 52, height: 52, borderRadius: 14, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, marginBottom: 20, flexShrink: 0 }}>
                  <s.Icon />
                </div>
                <h3 style={{ fontFamily: T.display, fontSize: "1rem", fontWeight: 700, color: T.navy, letterSpacing: "-.02em", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: ".875rem", color: T.muted, lineHeight: 1.72, flex: 1, marginBottom: 22 }}>{s.desc}</p>
                <motion.a href="#" whileHover={shouldReduce ? {} : { gap: 10 }} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: ".84rem", fontWeight: 600, color: s.color, transition: "gap .2s" }}>
                  Learn more <IconArrow size={13} />
                </motion.a>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
});
Services.displayName = "Services";

/* ═══════════════════════════════════════════
   IMPACT / STATS
═══════════════════════════════════════════ */
const Impact: FC = memo(() => {
  const shouldReduce = useReducedMotion();
  return (
    <section aria-labelledby="impact-heading" style={{ background: `linear-gradient(160deg, ${T.navy} 0%, ${T.navyLight} 55%, #0e2235 100%)`, padding: "clamp(4rem,8vw,6rem) clamp(1.25rem,4vw,2.5rem)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: -90, transform: "translateY(-50%)", width: 380, height: 380, borderRadius: "50%", border: "60px solid rgba(41,170,225,.05)", pointerEvents: "none" }} aria-hidden="true" />
      <div style={{ position: "absolute", bottom: -70, right: -70, width: 300, height: 300, borderRadius: "50%", border: "50px solid rgba(91,187,107,.05)", pointerEvents: "none" }} aria-hidden="true" />

      <div style={{ maxWidth: 1280, margin: "0 auto" }} className="mv-impact-grid">
        <Reveal style={{ maxWidth: 340 }}>
          <SectionLabel label="Our Impact" color={T.cyan} />
          <h2 id="impact-heading" style={{ fontFamily: T.display, fontSize: "clamp(1.75rem,3.5vw,2.75rem)", fontWeight: 800, color: "#fff", letterSpacing: "-.03em", lineHeight: 1.14, marginBottom: 16, marginTop: 4 }}>
            Turning evidence<br />into real impact
          </h2>
          <p style={{ fontSize: ".9375rem", color: "rgba(255,255,255,.55)", lineHeight: 1.75, marginBottom: 28 }}>
            We are proud of the difference our work makes in the communities we serve.
          </p>
          <Btn href="#projects" variant="ghost">View Our Projects <IconChevron size={15} /></Btn>
        </Reveal>

        <div className="mv-stats-grid">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * .09}>
              <motion.div whileHover={shouldReduce ? {} : { y: -4 }}
                style={{ padding: "clamp(20px,3vw,32px) 20px", background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: T.r16, textAlign: "center", position: "relative", overflow: "hidden", transition: "all .3s ease" }}>
                <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: `linear-gradient(90deg, transparent, rgba(41,170,225,.5), transparent)` }} aria-hidden="true" />
                <div style={{ color: T.cyan, display: "flex", justifyContent: "center", marginBottom: 14, opacity: .7 }}><s.Icon /></div>
                <div style={{ fontFamily: T.display, fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 800, color: "#fff", letterSpacing: "-.04em", lineHeight: 1, marginBottom: 8 }}>
                  <Counter end={s.value} />
                </div>
                <div style={{ fontSize: ".76rem", color: "rgba(255,255,255,.45)", fontWeight: 500, lineHeight: 1.4 }}>{s.label}</div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
});
Impact.displayName = "Impact";

/* ═══════════════════════════════════════════
   PROJECTS
═══════════════════════════════════════════ */
const Projects: FC = () => {
  const [active, setActive] = useState<string>("All Projects");
  const carouselRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);
  const shouldReduce = useReducedMotion();

  const filtered = useMemo<ProjectItem[]>(
    () => active === "All Projects" ? PROJECTS : PROJECTS.filter((p) => p.category === active),
    [active]
  );

  const scroll = useCallback((dir: number) => {
    carouselRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }, []);

  const onMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    startX.current = e.pageX - (carouselRef.current?.offsetLeft ?? 0);
    scrollLeftRef.current = carouselRef.current?.scrollLeft ?? 0;
  }, []);
  const onMouseLeave = useCallback(() => { isDragging.current = false; }, []);
  const onMouseUp = useCallback(() => { isDragging.current = false; }, []);
  const onMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    carouselRef.current.scrollLeft = scrollLeftRef.current - (x - startX.current) * 1.4;
  }, []);

  return (
    <section id="projects" aria-labelledby="projects-heading" style={{ background: T.off, padding: "clamp(4rem,8vw,7rem) clamp(1.25rem,4vw,2.5rem)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20, marginBottom: "clamp(1.5rem,4vw,3rem)" }}>
          <Reveal>
            <SectionLabel label="Featured Projects" color={T.green} />
            <h2 id="projects-heading" style={{ fontFamily: T.display, fontSize: "clamp(1.875rem,4vw,2.875rem)", fontWeight: 800, color: T.navy, letterSpacing: "-.03em", marginTop: 4 }}>
              Projects that create change
            </h2>
          </Reveal>
          <Reveal delay={.1}>
            <Btn href="#" variant="outline" style={{ marginTop: 8 }}>View All Projects <IconArrow size={14} /></Btn>
          </Reveal>
        </div>

        <Reveal style={{ marginBottom: 28 }}>
          <div role="tablist" aria-label="Project categories" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => {
              const isActive = active === cat;
              return (
                <motion.button key={cat} role="tab" aria-selected={isActive}
                  onClick={() => setActive(cat)}
                  whileHover={shouldReduce ? {} : { scale: 1.03 }} whileTap={shouldReduce ? {} : { scale: .97 }}
                  style={{ padding: "8px 18px", borderRadius: T.full, fontSize: ".8125rem", fontWeight: 600, border: "none", cursor: "pointer", transition: "all .22s ease",
                    background: isActive ? `linear-gradient(135deg, ${T.cyan}, ${T.green})` : "#fff",
                    color: isActive ? "#fff" : T.body,
                    boxShadow: isActive ? `0 4px 16px rgba(41,170,225,.28)` : T.xs,
                  }}>
                  {cat}
                </motion.button>
              );
            })}
          </div>
        </Reveal>

        <div style={{ position: "relative" }}>
          <div ref={carouselRef} className="mv-carousel"
            onMouseDown={onMouseDown} onMouseLeave={onMouseLeave} onMouseUp={onMouseUp} onMouseMove={onMouseMove}
            style={{ display: "flex", gap: 18, overflowX: "auto", cursor: "grab", scrollSnapType: "x mandatory", paddingBottom: 8 }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <motion.article key={p.id}
                  initial={{ opacity: 0, scale: .93 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .93 }}
                  transition={{ duration: shouldReduce ? .15 : .32, delay: i * .05, ease: T.ease }}
                  style={{ flexShrink: 0, width: 296, scrollSnapAlign: "start", borderRadius: T.r16, overflow: "hidden", background: "#fff", border: `1px solid ${T.border}`, boxShadow: T.xs, cursor: "pointer", userSelect: "none" }}>
                  <div style={{ overflow: "hidden", height: 180, position: "relative" }}>
                    <motion.img
                      src={p.image} alt={p.title} loading="lazy" decoding="async"
                      whileHover={shouldReduce ? {} : { scale: 1.07 }}
                      transition={{ duration: .5 }}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                    <div style={{ position: "absolute", bottom: 10, left: 12 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: T.full, fontSize: ".62rem", fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", background: "rgba(41,170,225,.88)", color: "#fff", backdropFilter: "blur(8px)" }}>
                        {p.category}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: "18px 20px 20px" }}>
                    <h3 style={{ fontFamily: T.display, fontSize: ".9375rem", fontWeight: 700, color: T.navy, letterSpacing: "-.02em", marginBottom: 8, lineHeight: 1.3 }}>{p.title}</h3>
                    <p style={{ fontSize: ".8125rem", color: T.muted, lineHeight: 1.65, marginBottom: 16 }}>{p.desc}</p>
                    <motion.a href="#" whileHover={shouldReduce ? {} : { gap: 10 }} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: ".8125rem", fontWeight: 600, color: T.cyan, transition: "gap .2s" }}>
                      View project <IconChevron size={12} />
                    </motion.a>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
            {(["left", "right"] as const).map((dir) => (
              <motion.button key={dir} onClick={() => scroll(dir === "right" ? 1 : -1)}
                aria-label={`Scroll ${dir}`}
                whileHover={shouldReduce ? {} : { scale: 1.1 }} whileTap={shouldReduce ? {} : { scale: .9 }}
                style={{ width: 42, height: 42, borderRadius: "50%", border: `1.5px solid ${T.border}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: T.navy, cursor: "pointer", boxShadow: T.xs }}>
                <IconArrow dir={dir} size={16} />
              </motion.button>
            ))}
          </div>

          <div role="presentation" style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 14 }}>
            {filtered.map((_, i) => (
              <div key={i} style={{ width: i === 0 ? 22 : 7, height: 7, borderRadius: T.full, background: i === 0 ? T.cyan : T.border, transition: "all .3s" }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   WHY MEDVERITAS
═══════════════════════════════════════════ */
const Why: FC = memo(() => {
  const shouldReduce = useReducedMotion();
  return (
    <section aria-labelledby="why-heading" style={{ background: "#fff", padding: "clamp(4rem,8vw,7rem) clamp(1.25rem,4vw,2.5rem)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Reveal style={{ textAlign: "center", marginBottom: "clamp(2.5rem,5vw,4rem)" }}>
          <SectionLabel label="Why Choose MedVeritas?" color={T.muted} />
          <h2 id="why-heading" style={{ fontFamily: T.display, fontSize: "clamp(1.875rem,4vw,2.75rem)", fontWeight: 800, color: T.navy, letterSpacing: "-.03em", marginTop: 4 }}>
            Built on trust. Driven by impact.
          </h2>
        </Reveal>

        <div className="mv-why-grid">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={i * .08}>
              <motion.div whileHover={shouldReduce ? {} : { y: -6 }}
                className="mv-card"
                style={{ padding: "28px 24px", border: `1px solid ${T.border}`, borderRadius: T.r24, background: "#fff", transition: "all .3s ease", position: "relative", overflow: "hidden", height: "100%", boxShadow: T.xs }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 90, height: 90, background: `radial-gradient(circle at top right, ${w.color}1a 0%, transparent 65%)`, pointerEvents: "none" }} aria-hidden="true" />
                <div style={{ width: 48, height: 48, borderRadius: 13, background: w.color === T.cyan ? T.cyanLight : T.greenLight, display: "flex", alignItems: "center", justifyContent: "center", color: w.color, marginBottom: 18 }}>
                  <w.Icon />
                </div>
                <h3 style={{ fontFamily: T.display, fontSize: "1rem", fontWeight: 700, color: T.navy, marginBottom: 10 }}>{w.title}</h3>
                <p style={{ fontSize: ".875rem", color: T.muted, lineHeight: 1.72 }}>{w.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
});
Why.displayName = "Why";

/* ═══════════════════════════════════════════
   CTA SECTION
═══════════════════════════════════════════ */
const CTA: FC = memo(() => (
  <section id="contact" aria-labelledby="cta-heading" style={{ padding: "clamp(1.5rem,4vw,2.5rem)", background: T.off }}>
    <Reveal>
      <div style={{ maxWidth: 1280, margin: "0 auto", borderRadius: T.r32, overflow: "hidden", position: "relative", background: `linear-gradient(135deg, ${T.navy} 0%, ${T.navyLight} 55%, rgba(41,170,225,.8) 100%)` }}>
        <div style={{ position: "absolute", top: "50%", left: -80, transform: "translateY(-50%)", width: 300, height: 300, borderRadius: "50%", border: "50px solid rgba(255,255,255,.04)", pointerEvents: "none" }} aria-hidden="true" />
        <div style={{ position: "absolute", top: "50%", right: -60, transform: "translateY(-50%)", width: 220, height: 220, borderRadius: "50%", border: "40px solid rgba(91,187,107,.09)", pointerEvents: "none" }} aria-hidden="true" />
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .025, pointerEvents: "none" }} aria-hidden="true">
          <pattern id="cta-dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="1" fill="white"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#cta-dots)"/>
        </svg>
        <div style={{ position: "relative", padding: "clamp(2.5rem,5vw,4.5rem) clamp(2rem,5vw,5rem)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ width: 64, height: 64, borderRadius: T.r16, background: "rgba(41,170,225,.18)", border: "1px solid rgba(41,170,225,.28)", display: "flex", alignItems: "center", justifyContent: "center", color: T.cyan, flexShrink: 0 }}>
            <IconMail />
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <h2 id="cta-heading" style={{ fontFamily: T.display, fontSize: "clamp(1.5rem,3vw,2.3rem)", fontWeight: 800, color: "#fff", letterSpacing: "-.03em", marginBottom: 10, lineHeight: 1.2 }}>
              Let's work together for<br />better health outcomes
            </h2>
            <p style={{ fontSize: ".9375rem", color: "rgba(255,255,255,.58)", lineHeight: 1.7 }}>
              Partner with us to design solutions, generate evidence, and create sustainable impact.
            </p>
          </div>
          <Btn href="mailto:info@medveritasye.com" style={{ flexShrink: 0, background: "#fff", color: T.navy, boxShadow: T.lg }}>
            Get In Touch Today
            <span style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${T.cyan}, ${T.green})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <IconChevron size={13} />
            </span>
          </Btn>
        </div>
      </div>
    </Reveal>
  </section>
));
CTA.displayName = "CTA";

/* ═══════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════ */
const Footer: FC = memo(() => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const shouldReduce = useReducedMotion();

  const handleSubscribe = useCallback(() => {
    if (email && email.includes("@")) setSubmitted(true);
  }, [email]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubscribe();
  }, [handleSubscribe]);

  return (
    <footer role="contentinfo" style={{ background: `linear-gradient(160deg, ${T.navy} 0%, #0a1628 60%, #0e2235 100%)`, padding: "clamp(3rem,6vw,5rem) clamp(1.25rem,4vw,2.5rem) 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "60%", height: 1, background: `linear-gradient(90deg, transparent, ${T.cyan}40, transparent)` }} aria-hidden="true" />

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="mv-footer-grid" style={{ paddingBottom: "clamp(2.5rem,5vw,4rem)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          {/* Brand */}
          <div>
            <a href="#" aria-label="MedVeritas home" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <path d="M8 8L20 20L8 32" stroke={T.green} strokeWidth="3.5" strokeLinecap="round"/>
                <path d="M20 8L32 20L20 32" stroke={T.cyan} strokeWidth="3.5" strokeLinecap="round"/>
              </svg>
              <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: "1.1rem", color: "#fff" }}>Med<span style={{ color: T.cyan }}>Veritas</span></span>
            </a>
            <p style={{ fontSize: ".84rem", color: "rgba(255,255,255,.38)", lineHeight: 1.75, marginBottom: 24, maxWidth: 250 }}>
              Data-driven healthcare solutions for a healthier Yemen and beyond.
            </p>
            <div style={{ display: "flex", gap: 9 }}>
              {SOCIAL_ICONS.map(({ Icon: SocialIcon, label }) => (
                <motion.a key={label} href="#" aria-label={label}
                  whileHover={shouldReduce ? {} : { scale: 1.12, y: -2 }} whileTap={shouldReduce ? {} : { scale: .9 }}
                  style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,.45)", transition: "all .2s" }}
                  onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = T.cyan; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = T.cyan; }}
                  onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = "rgba(255,255,255,.07)"; e.currentTarget.style.color = "rgba(255,255,255,.45)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"; }}>
                  <SocialIcon />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {FOOTER_COLS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h4 style={{ fontSize: ".6875rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.28)", marginBottom: 16 }}>{col.title}</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#"
                      style={{ fontSize: ".875rem", color: "rgba(255,255,255,.48)", transition: "color .18s", display: "inline-flex", alignItems: "center", gap: 5 }}
                      onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = "rgba(255,255,255,.88)"; }}
                      onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = "rgba(255,255,255,.48)"; }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact + Newsletter */}
          <div>
            <h4 style={{ fontSize: ".6875rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.28)", marginBottom: 16 }}>Contact Us</h4>
            {([
              { Icon: IconMail,  val: "info@medveritasye.com" },
              { Icon: IconPhone, val: "+967 711 123 456"      },
              { Icon: IconPin,   val: "Sana'a, Yemen"         },
            ] as Array<{ Icon: FC; val: string }>).map((c) => (
              <div key={c.val} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ color: T.cyan, opacity: .65, marginTop: 1, flexShrink: 0 }}><c.Icon /></span>
                <span style={{ fontSize: ".8125rem", color: "rgba(255,255,255,.42)", lineHeight: 1.55 }}>{c.val}</span>
              </div>
            ))}

            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: ".6875rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.28)", marginBottom: 12 }}>Subscribe to newsletter</div>
              <div style={{ display: "flex", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: T.r12, overflow: "hidden" }}>
                <input type="email" placeholder="Your email address" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Newsletter email"
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "10px 13px", fontSize: ".8125rem", color: "#fff", fontFamily: T.body_font }}
                />
                <motion.button onClick={handleSubscribe}
                  whileHover={shouldReduce ? {} : { scale: 1.05 }} whileTap={shouldReduce ? {} : { scale: .95 }}
                  aria-label="Subscribe"
                  style={{ padding: "10px 14px", background: submitted ? T.green : T.cyan, border: "none", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .3s" }}>
                  {submitted ? <IconCheck /> : <IconArrow size={16} />}
                </motion.button>
              </div>
              {submitted && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: ".75rem", color: T.green, marginTop: 8 }}>
                  ✓ You're subscribed!
                </motion.p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ padding: "20px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: ".76rem", color: "rgba(255,255,255,.22)" }}>© {new Date().getFullYear()} MedVeritas. All rights reserved.</span>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Terms of Use", "Cookie Policy"].map((l) => (
              <a key={l} href="#"
                style={{ fontSize: ".74rem", color: "rgba(255,255,255,.22)", transition: "color .2s" }}
                onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = "rgba(255,255,255,.55)"; }}
                onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = "rgba(255,255,255,.22)"; }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
});
Footer.displayName = "Footer";

/* ═══════════════════════════════════════════
   ROOT
═══════════════════════════════════════════ */
const MedVeritasHome: FC = () => (
  <>
    <GlobalStyles />
    <Navbar />
    <StickyCtaBar />
    <main id="main-content">
      <Hero />
      <TrustedBy />
      <Services />
      <Impact />
      <Projects />
      <Why />
      <CTA />
    </main>
    <Footer />
  </>
);

export default MedVeritasHome;
