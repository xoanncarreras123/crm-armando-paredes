import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fmtCompact, fmtFull } from "./format";

// ============================================================
// Preferencias globales del CRM: tema, moneda + tipo de cambio, rol.
// Todo se persiste en localStorage y se refleja en <html data-theme>
// y <body data-role> para que el CSS reaccione sin props.
// Moneda base de los datos = USD; PEN se deriva multiplicando por fx.
// ============================================================

export type ThemeMode = "dark" | "light";
export type Currency = "USD" | "PEN";
export type Role = "seller" | "admin";

const FX_BASE = 3.752; // S/ por US$ (referencial; en prod: API SBS/SUNAT)

interface Prefs {
  theme: ThemeMode;
  toggleTheme: () => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  fx: number;
  role: Role;
  setRole: (r: Role) => void;
}

const PrefsContext = createContext<Prefs | null>(null);

function read<T extends string>(key: string, fallback: T): T {
  if (typeof localStorage === "undefined") return fallback;
  return (localStorage.getItem(key) as T) || fallback;
}

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(() => read("ap.theme", "dark"));
  const [currency, setCurrencyState] = useState<Currency>(() => read("ap.currency", "USD"));
  const [role, setRoleState] = useState<Role>(() => read("ap.role", "seller"));
  const [fx, setFx] = useState(FX_BASE);

  // Reflejar tema en <html> y persistir
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ap.theme", theme);
  }, [theme]);

  // Reflejar rol en <body> (controla controles de backoffice vía CSS) y persistir
  useEffect(() => {
    document.body.setAttribute("data-role", role);
    localStorage.setItem("ap.role", role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem("ap.currency", currency);
  }, [currency]);

  // Tipo de cambio "en vivo": deriva suave alrededor de la base.
  useEffect(() => {
    const id = setInterval(() => {
      setFx(+(FX_BASE + (Math.random() - 0.5) * 0.012).toFixed(3));
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const value = useMemo<Prefs>(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      currency,
      setCurrency: setCurrencyState,
      fx,
      role,
      setRole: setRoleState,
    }),
    [theme, currency, fx, role],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs(): Prefs {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs debe usarse dentro de <PrefsProvider>");
  return ctx;
}

/** Formateador de dinero sensible a la moneda activa. Entrada SIEMPRE en USD. */
export function useMoney() {
  const { currency, fx } = usePrefs();
  return useMemo(() => {
    const sym = currency === "USD" ? "US$" : "S/";
    const conv = (usd: number | null) => (usd == null ? null : currency === "USD" ? usd : usd * fx);
    return {
      currency,
      fx,
      symbol: sym,
      /** Compacto: US$ 685K · S/ 2.57M */
      short: (usd: number | null) => fmtCompact(conv(usd), sym),
      /** Completo con separador de miles: US$ 685,000 · S/ 2,568,750 */
      full: (usd: number | null) => fmtFull(conv(usd), sym),
    };
  }, [currency, fx]);
}
