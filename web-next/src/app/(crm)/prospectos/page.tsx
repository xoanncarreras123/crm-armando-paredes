"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useProspectos } from "@/application/prospectos/useProspectos";
import type { ProspectoListItem, EtapaPipeline, FuenteProspecto } from "@/domain/entities/Prospecto";
import { ScoreBadge } from "@/presentation/components/ui/ScoreBadge";
import { EtapaBadge } from "@/presentation/components/ui/EtapaBadge";
import { useMoney } from "@/presentation/providers/PrefsProvider";
import { Avatar } from "@/presentation/components/ui/Avatar";
import { relativeTime } from "@/presentation/lib/format";

const FILTROS: { key: "TODOS" | EtapaPipeline; label: string }[] = [
  { key: "TODOS", label: "Todos" },
  { key: "NUEVO", label: "Nuevos" },
  { key: "CALIFICADO", label: "Calificados" },
  { key: "PROPUESTA", label: "Propuesta" },
  { key: "NEGOCIACION", label: "Negociación" },
  { key: "RESERVA", label: "Reserva" },
];

export default function Prospectos() {
  const { prospectos: data, loading: isLoading } = useProspectos();
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]["key"]>("TODOS");
  const nav = useRouter();
  const money = useMoney();

  const rows = useMemo(
    () => (data ?? []).filter((p: ProspectoListItem) => filtro === "TODOS" || p.etapa === filtro),
    [data, filtro],
  );

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 p-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Prospectos</h1>
          <p className="text-sm text-ink-muted">
            {data?.length ?? "—"} prospectos · ordenados por actividad reciente
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTROS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={`rounded-pill px-3 py-1.5 text-xs font-medium transition-colors ${
                filtro === f.key
                  ? "bg-gold text-bg"
                  : "border border-border bg-surface text-ink-muted hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {/* Cabecera de tabla */}
        <div className="grid grid-cols-[2fr_1fr_auto_1.2fr_1fr_auto] gap-4 border-b border-border px-5 py-3">
          {["Prospecto", "Etapa", "Score", "Proyecto", "Valor est.", "Actividad"].map((h) => (
            <span key={h} className="label">{h}</span>
          ))}
        </div>

        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton mx-5 my-3 h-10 rounded" />
            ))
          : rows.map((p, i) => (
              <button
                key={p.id}
                onClick={() => nav.push(`/prospectos/${p.id}`)}
                className="grid w-full grid-cols-[2fr_1fr_auto_1.2fr_1fr_auto] items-center gap-4 border-b border-border px-5 py-3 text-left transition-colors last:border-0 hover:bg-raised animate-fade-up"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-center gap-3">
                  <Avatar nombre={p.nombre} size={34} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-ink">{p.nombre}</div>
                    <div className="truncate text-xs text-ink-faint">{p.telefono}</div>
                  </div>
                </div>
                <div><EtapaBadge etapa={p.etapa} /></div>
                <div><ScoreBadge score={p.score} /></div>
                <div className="min-w-0">
                  <div className="truncate text-sm text-ink">{p.proyecto}</div>
                  <div className="truncate text-xs text-ink-faint">{p.asesor}</div>
                </div>
                <div className="font-display text-sm font-bold tabular-nums text-ink">
                  {money.short(p.valorEstimado)}
                </div>
                <div className="text-xs text-ink-faint">{relativeTime(p.ultimaActividad)}</div>
              </button>
            ))}
      </div>
    </div>
  );
}
