import type { Config } from "tailwindcss";

// Sistema de diseño — Armando Paredes CRM.
// Dark premium (Linear/Vercel). Acento dorado usado con avaricia.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0D11",
        surface: "#13161D",
        raised: "#1A1E27", // superficie elevada (hover, popovers)
        border: "rgba(255,255,255,0.07)",
        "border-strong": "rgba(255,255,255,0.12)",
        ink: {
          DEFAULT: "#EDEFF3", // texto primario
          muted: "#9BA1AD", // texto secundario
          faint: "#5C6373", // texto terciario / labels
        },
        gold: { DEFAULT: "#E8C547", soft: "rgba(232,197,71,0.12)" },
        green: { DEFAULT: "#3EC898", soft: "rgba(62,200,152,0.12)" },
        red: { DEFAULT: "#E86060", soft: "rgba(232,96,96,0.12)" },
        blue: { DEFAULT: "#5B8EF0", soft: "rgba(91,142,240,0.12)" },
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
