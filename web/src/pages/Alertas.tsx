import { useNavigate } from "react-router-dom";
import { useAlertas } from "@/api/hooks";
import type { Alerta, TipoAlerta } from "@/api/types";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { IconAlertas, IconBolt, IconClock } from "@/components/ui/icons";

const META: Record<TipoAlerta, { label: string; hex: string; Icon: typeof IconBolt }> = {
  SENAL_CIERRE: { label: "Señales de cierre", hex: "#E8C547", Icon: IconBolt },
  CHURN: { label: "Riesgo de fuga", hex: "#E86060", Icon: IconAlertas },
  RENOVACION: { label: "Por vencer", hex: "#5B8EF0", Icon: IconClock },
};
const ORDEN: TipoAlerta[] = ["SENAL_CIERRE", "CHURN", "RENOVACION"];

export function Alertas() {
  const { data, isLoading } = useAlertas();
  const nav = useNavigate();

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 p-6">
      <header>
        <h1 className="font-display text-2xl font-bold">Alertas inteligentes</h1>
        <p className="text-sm text-ink-muted">
          Lo que el sistema detectó y requiere tu atención hoy
        </p>
      </header>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-card" />)}
        </div>
      ) : (
        ORDEN.map((tipo) => {
          const items = data!.filter((a) => a.tipo === tipo);
          if (!items.length) return null;
          const m = META[tipo];
          return (
            <section key={tipo}>
              <div className="mb-2 flex items-center gap-2">
                <m.Icon width={15} height={15} style={{ color: m.hex }} />
                <h2 className="text-sm font-semibold" style={{ color: m.hex }}>{m.label}</h2>
                <span className="text-2xs text-ink-faint">({items.length})</span>
              </div>
              <div className="space-y-2.5">
                {items.map((a, i) => (
                  <AlertRow key={a.id} a={a} index={i} onClick={() => nav(`/prospectos/${a.prospectoId}`)} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}

function AlertRow({ a, index, onClick }: { a: Alerta; index: number; onClick: () => void }) {
  const esCierre = a.tipo === "SENAL_CIERRE";
  return (
    <button
      onClick={onClick}
      className="animate-fade-up flex w-full items-center gap-4 rounded-card border p-4 text-left transition-colors hover:border-border-strong"
      style={{
        animationDelay: `${index * 40}ms`,
        background: esCierre ? "rgba(232,197,71,0.06)" : undefined,
        borderColor: esCierre ? "rgba(232,197,71,0.3)" : "rgba(255,255,255,0.07)",
      }}
    >
      <ScoreBadge score={a.score} size="lg" />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-ink">{a.titulo}</div>
        <div className="text-sm text-ink-muted">{a.detalle}</div>
      </div>
      <div className="hidden text-right text-2xs text-ink-faint sm:block">
        <div>{a.proyecto}</div>
        <div>{a.hace}</div>
      </div>
      <span className="text-ink-faint">→</span>
    </button>
  );
}
