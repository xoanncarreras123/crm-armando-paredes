"use client";
import { IconMoon, IconPlus, IconSearch, IconSun } from "@/presentation/components/ui/icons";
import { usePrefs, type Currency } from "@/presentation/providers/PrefsProvider";

export function Topbar({ onNuevo }: { onNuevo?: () => void }) {
  const { theme, toggleTheme, currency, setCurrency, fx } = usePrefs();

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 px-6 backdrop-blur"
      style={{ borderBottom:"1px solid var(--border)", backgroundColor:"rgb(var(--bg-rgb)/0.8)" }}>
      <label className="group flex h-9 w-full max-w-md items-center gap-2.5 rounded-lg px-3 transition-colors"
        style={{ border:"1px solid var(--border)", background:"rgb(var(--surface-rgb))" }}>
        <IconSearch style={{ color:"rgb(var(--ink-faint-rgb))" }} width={16} height={16} />
        <input placeholder="Buscar prospecto, proyecto o unidad…"
          className="w-full bg-transparent text-sm focus:outline-none"
          style={{ color:"rgb(var(--ink-rgb))" }} />
        <kbd className="hidden rounded px-1.5 py-0.5 text-[11px] sm:block"
          style={{ border:"1px solid var(--border)", color:"rgb(var(--ink-faint-rgb))" }}>⌘K</kbd>
      </label>

      <div className="ml-auto flex items-center gap-2.5">
        <div className="hidden items-center gap-2 rounded-lg px-3 py-2 sm:flex"
          style={{ border:"1px solid var(--border)", background:"rgb(var(--surface-rgb))" }}
          title="Tipo de cambio USD/PEN en vivo">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background:"rgb(var(--green-rgb))" }} />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background:"rgb(var(--green-rgb))" }} />
          </span>
          <span className="text-[11px] font-medium" style={{ color:"rgb(var(--ink-faint-rgb))" }}>USD/PEN</span>
          <span className="text-xs font-bold tabular-nums" style={{ color:"rgb(var(--ink-rgb))" }}>{fx.toFixed(3)}</span>
        </div>

        <div className="flex items-center gap-0.5 rounded-lg p-0.5" style={{ border:"1px solid var(--border)", background:"rgb(var(--surface-rgb))" }}>
          {(["PEN","USD"] as Currency[]).map((c) => (
            <button key={c} onClick={() => setCurrency(c)}
              className="rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
              style={currency===c ? { background:"rgb(var(--gold-rgb))", color:"rgb(var(--bg-rgb))" } : { color:"rgb(var(--ink-muted-rgb))" }}>
              {c === "PEN" ? "S/" : "$"}
            </button>
          ))}
        </div>

        <button onClick={toggleTheme} title={theme==="dark"?"Modo claro":"Modo oscuro"}
          className="grid h-9 w-9 place-items-center rounded-lg transition-colors"
          style={{ border:"1px solid var(--border)", background:"rgb(var(--surface-rgb))", color:"rgb(var(--ink-muted-rgb))" }}>
          {theme==="dark" ? <IconSun width={17} height={17} /> : <IconMoon width={17} height={17} />}
        </button>

        <button onClick={onNuevo}
          className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-transform hover:-translate-y-px active:translate-y-0"
          style={{ background:"rgb(var(--gold-rgb))", color:"rgb(var(--bg-rgb))" }}>
          <IconPlus width={16} height={16} />
          <span className="hidden md:inline">Nuevo prospecto</span>
        </button>
      </div>
    </header>
  );
}
