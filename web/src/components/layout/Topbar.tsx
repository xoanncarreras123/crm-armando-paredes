import { IconMoon, IconPlus, IconSearch, IconSun } from "@/components/ui/icons";
import { usePrefs, type Currency } from "@/lib/prefs";

export function Topbar({ onNuevo }: { onNuevo?: () => void }) {
  const { theme, toggleTheme, currency, setCurrency, fx } = usePrefs();

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-bg/80 px-6 backdrop-blur">
      {/* Búsqueda global */}
      <label className="group flex h-9 w-full max-w-md items-center gap-2.5 rounded-lg border border-border bg-surface px-3 transition-colors focus-within:border-border-strong">
        <IconSearch className="text-ink-faint" width={16} height={16} />
        <input
          placeholder="Buscar prospecto, proyecto o unidad…"
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
        />
        <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-2xs text-ink-faint sm:block">
          ⌘K
        </kbd>
      </label>

      <div className="ml-auto flex items-center gap-2.5">
        {/* Tipo de cambio en vivo */}
        <div
          className="hidden items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 sm:flex"
          title="Tipo de cambio USD/PEN en vivo"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green" />
          </span>
          <span className="text-2xs font-medium tracking-normal text-ink-faint">USD/PEN</span>
          <span className="font-display text-xs font-bold tabular-nums text-ink">{fx.toFixed(3)}</span>
        </div>

        {/* Selector de moneda */}
        <div className="flex items-center gap-0.5 rounded-lg border border-border bg-surface p-0.5">
          {(["PEN", "USD"] as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                currency === c ? "bg-gold text-bg" : "text-ink-muted hover:text-ink"
              }`}
            >
              {c === "PEN" ? "S/" : "$"}
            </button>
          ))}
        </div>

        {/* Tema claro / oscuro */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface text-ink-muted transition-colors hover:bg-raised hover:text-ink"
        >
          {theme === "dark" ? <IconSun width={17} height={17} /> : <IconMoon width={17} height={17} />}
        </button>

        <button
          onClick={onNuevo}
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-3.5 py-2 text-sm font-semibold text-bg transition-transform hover:-translate-y-px active:translate-y-0"
        >
          <IconPlus width={16} height={16} />
          <span className="hidden md:inline">Nuevo prospecto</span>
        </button>
      </div>
    </header>
  );
}
