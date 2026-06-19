import { IconPlus, IconSearch } from "@/components/ui/icons";

export function Topbar({ onNuevo }: { onNuevo?: () => void }) {
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

      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={onNuevo}
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-3.5 py-2 text-sm font-semibold text-bg transition-transform hover:-translate-y-px active:translate-y-0"
        >
          <IconPlus width={16} height={16} />
          Nuevo prospecto
        </button>
      </div>
    </header>
  );
}
