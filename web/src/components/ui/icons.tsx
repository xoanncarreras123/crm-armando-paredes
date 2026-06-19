import type { SVGProps } from "react";

// Set de íconos stroke, 1.6px, heredan currentColor. Sin librerías.
type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...p,
});

export const IconDashboard = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </svg>
);
export const IconPipeline = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 6h18M6 12h12M9 18h6" />
  </svg>
);
export const IconProspectos = (p: P) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8" r="3" />
    <path d="M4 19c0-2.8 2.2-5 5-5s5 2.2 5 5" />
    <path d="M16 11a3 3 0 0 0 0-6M20 19c0-2.2-1.2-4-3-4.6" />
  </svg>
);
export const IconProyectos = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 21V7l7-4 7 4v14" />
    <path d="M17 21V11l4 2v8" />
    <path d="M7 9h2M7 13h2M7 17h2" />
  </svg>
);
export const IconInventario = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 9v12M15 3v6" />
  </svg>
);
export const IconAlertas = (p: P) => (
  <svg {...base(p)}>
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
);
export const IconAuto = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6 6l1.5 1.5M16.5 16.5L18 18" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);
export const IconSearch = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3-3" />
  </svg>
);
export const IconPlus = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const IconWhatsapp = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 21l1.6-4.2A8 8 0 1 1 8 19.5z" />
    <path d="M8.5 9.5c0 3 2 5 5 5 .8 0 1.2-.4 1.2-1l-.3-1.2-1.5-.5-.8.8c-1-.4-1.8-1.2-2.2-2.2l.8-.8-.5-1.5L9.5 7c-.6 0-1 .4-1 1.2z" />
  </svg>
);
export const IconMail = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
export const IconVisit = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);
export const IconCall = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 3h3l2 5-2 1.5a11 11 0 0 0 5 5L19 12l2 5v3a1 1 0 0 1-1 1A16 16 0 0 1 4 4a1 1 0 0 1 1-1z" />
  </svg>
);
export const IconArrowUp = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);
export const IconArrowDown = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);
export const IconBolt = (p: P) => (
  <svg {...base(p)}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
  </svg>
);
export const IconClock = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const IconCotizador = (p: P) => (
  <svg {...base(p)}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M8 7h8M8 11h2M8 15h2" />
    <path d="M13 11h3v6h-3z" />
  </svg>
);
export const IconCopy = (p: P) => (
  <svg {...base(p)}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h8" />
  </svg>
);
