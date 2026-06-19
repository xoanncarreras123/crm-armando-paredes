import type { Config } from "tailwindcss";

// Sistema de diseño — Armando Paredes CRM.
// Premium adaptable (Linear/Vercel). Tokens vía variables CSS → light/dark.
// Acento oro terracota usado con avaricia. Ver índice de variables en index.css.
const c = (v: string) => `rgb(var(${v}) / <alpha-value>)`;
const soft = (v: string) => `rgb(var(${v}) / 0.12)`;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: c("--bg-rgb"),
        surface: c("--surface-rgb"),
        raised: c("--raised-rgb"), // superficie elevada (hover, popovers)
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        ink: {
          DEFAULT: c("--ink-rgb"), // texto primario
          muted: c("--ink-muted-rgb"), // texto secundario
          faint: c("--ink-faint-rgb"), // texto terciario / labels
        },
        gold: { DEFAULT: c("--gold-rgb"), soft: soft("--gold-rgb") },
        green: { DEFAULT: c("--green-rgb"), soft: soft("--green-rgb") },
        red: { DEFAULT: c("--red-rgb"), soft: soft("--red-rgb") },
        blue: { DEFAULT: c("--blue-rgb"), soft: soft("--blue-rgb") },
        violet: { DEFAULT: c("--violet-rgb"), soft: soft("--violet-rgb") },
      },
      fontFamily: {
        display: ['"Syne"', "system-ui", "sans-serif"],
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      fontSize: {
        // Escala real, no px al azar.
        "2xs": ["11px", { lineHeight: "14px", letterSpacing: "0.12em" }],
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["13px", { lineHeight: "20px" }],
        base: ["14px", { lineHeight: "22px" }],
        lg: ["16px", { lineHeight: "24px" }],
        xl: ["20px", { lineHeight: "26px", letterSpacing: "-0.01em" }],
        "2xl": ["28px", { lineHeight: "32px", letterSpacing: "-0.02em" }],
        "3xl": ["40px", { lineHeight: "44px", letterSpacing: "-0.03em" }],
      },
      borderRadius: { card: "12px", pill: "999px" },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
} satisfies Config;
