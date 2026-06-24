"use client";
import { usePipeline } from "@/application/pipeline/usePipeline";
import type { EtapaPipeline } from "@/domain/entities/Prospecto";
import type { Oportunidad } from "@/domain/entities/Oportunidad";
import { useMoney } from "@/presentation/providers/PrefsProvider";
import { Avatar } from "@/presentation/components/ui/Avatar";
import { ScoreBadge } from "@/presentation/components/ui/ScoreBadge";
import { IconBolt, IconClock } from "@/presentation/components/ui/icons";

// 5 columnas comerciales. Agrupamos las 9 etapas del backend en estas 5.
const COLUMNAS: { key: string; titulo: string; etapas: EtapaPipeline[] }[] = [
  { key: "nuevo", titulo: "Nuevo", etapas: ["NUEVO", "CONTACTADO"] },
  { key: "calificado", titulo: "Calificado", etapas: ["CALIFICADO", "VISITA_AGENDADA"] },
  { key: "propuesta", titulo: "Propuesta", etapas: ["PROPUESTA"] },
  { key: "negociacion", titulo: "Negociación", etapas: ["NEGOCIACION"] },
  { key: "reserva", titulo: "Reserva", etapas: ["RESERVA"] },
];

export function PipelineKanban() {
  const { deals: data, loading: isLoading } = usePipeline();
  const money = useMoney();

  return (
    <section>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">Pipeline</h2>
          <p className="text-sm text-ink-muted">Arrastra para mover de etapa · 7 deals activos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {COLUMNAS.map((col) => {
          const deals = (data ?? []).filter((d) => col.etapas.includes(d.etapa));
          const suma = deals.reduce((s, d) => s + (d.valorEstimado ?? 0), 0);
          return (
            <div key={col.key} className="flex min-w-0 flex-col">
              {/* Cabecera de columna con conteo y suma — contexto, no solo título */}
              <div className="mb-2 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink">{col.titulo}</span>
                  <span className="rounded-pill bg-surface px-1.5 text-2xs font-semibold text-ink-faint">
                    {deals.length}
                  </span>
                </div>
                <span className="text-2xs font-medium text-ink-faint">{money.short(suma)}</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {isLoading
                  ? Array.from({ length: col.key === "nuevo" ? 2 : 1 }).map((_, i) => (
                      <div key={i} className="skeleton h-[136px] rounded-card" />
                    ))
                  : deals.map((d, i) => <DealCard key={d.id} deal={d} index={i} />)}
                {!isLoading && deals.length === 0 && (
                  <div className="rounded-card border border-dashed border-border py-6 text-center text-2xs text-ink-faint">
                    Sin deals
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DealCard({ deal, index }: { deal: Oportunidad; index: number }) {
  const money = useMoney();
  const estancado = deal.diasEnEtapa >= 21;
  return (
    <article
      className="animate-fade-up cursor-pointer rounded-card border border-border bg-surface p-3.5 card-hover"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start gap-2.5">
        <Avatar nombre={deal.prospecto.nombre} size={32} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-ink">{deal.prospecto.nombre}</div>
          <div className="truncate text-xs text-ink-muted">{deal.proyecto.nombre}</div>
        </div>
        <ScoreBadge score={deal.score} />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="font-display text-base font-bold tabular-nums text-ink">
          {money.short(deal.valorEstimado)}
        </span>
        <span
          className={`inline-flex items-center gap-1 text-2xs font-medium ${
            estancado ? "text-red" : "text-ink-faint"
          }`}
        >
          <IconClock width={11} height={11} />
          {deal.diasEnEtapa}d en etapa
        </span>
      </div>

      {/* Siguiente acción recomendada — el dato que vuelve accionable la card */}
      <div className="mt-2.5 flex items-start gap-1.5 rounded-md bg-bg/50 px-2 py-1.5">
        <IconBolt className="mt-px shrink-0 text-gold" width={12} height={12} />
        <span className="text-xs leading-snug text-ink-muted">{deal.siguienteAccion}</span>
      </div>
    </article>
  );
}
