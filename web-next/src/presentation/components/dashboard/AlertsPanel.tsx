import type { Alerta, TipoAlerta } from "@/domain/entities/Alerta";

const MOCK_ALERTAS: Alerta[] = [
  { id:"al1", tipo:"SENAL_CIERRE", prospectoId:"p3", titulo:"Andrés Cáceres preguntó por escrituras", detalle:'"¿Qué documentos necesito para firmar?" — vía WhatsApp', score:41, proyecto:"Torre Basadre", hace:"hace 14 h" },
  { id:"al2", tipo:"CHURN",        prospectoId:"p2", titulo:"Patricia Zegarra en riesgo de fuga",     detalle:"30 días sin actividad en un deal de US$540K", score:64, proyecto:"Malecón 28",    hace:"hace 30 días" },
  { id:"al3", tipo:"RENOVACION",   prospectoId:"p1", titulo:"Separación de Gonzalo por vencer",       detalle:"La hipoteca pre-aprobada vence el jueves",     score:87, proyecto:"Torre Basadre", hace:"vence en 2 días" },
];
import { ScoreBadge } from "@/presentation/components/ui/ScoreBadge";
import { IconAlertas, IconBolt, IconClock } from "@/presentation/components/ui/icons";

const META: Record<
  TipoAlerta,
  { label: string; color: string; bg: string; Icon: typeof IconBolt }
> = {
  SENAL_CIERRE: { label: "Señal de cierre", color: "#D4A574", bg: "rgba(212,165,116,0.08)", Icon: IconBolt },
  CHURN: { label: "Riesgo de fuga", color: "#E07856", bg: "transparent", Icon: IconAlertas },
  RENOVACION:   { label: "Por vencer",   color: "#7C9CC6", bg: "transparent", Icon: IconClock },
  INACTIVIDAD:  { label: "Inactividad",  color: "#9B8AC9", bg: "transparent", Icon: IconClock },
};

export function AlertsPanel() {
  const data = MOCK_ALERTAS;
  const isLoading = false;

  return (
    <section className="flex h-full flex-col rounded-card border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="font-display text-lg font-bold">Alertas inteligentes</h2>
        <span className="rounded-pill bg-red-soft px-2 py-0.5 text-2xs font-semibold text-red">
          {data?.length ?? 0} activas
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-[84px] rounded-lg" />
            ))
          : data!.map((a, i) => <AlertItem key={a.id} alerta={a} index={i} />)}
      </div>
    </section>
  );
}

function AlertItem({ alerta, index }: { alerta: Alerta; index: number }) {
  const m = META[alerta.tipo];
  const esCierre = alerta.tipo === "SENAL_CIERRE";
  return (
    <article
      className="animate-fade-up rounded-lg border p-3 transition-colors hover:border-border-strong"
      style={{
        animationDelay: `${index * 50}ms`,
        background: m.bg,
        borderColor: esCierre ? "rgba(212,165,116,0.35)" : "var(--border)",
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 text-2xs font-semibold uppercase"
          style={{ color: m.color }}
        >
          <m.Icon width={13} height={13} />
          {m.label}
        </span>
        <ScoreBadge score={alerta.score} />
      </div>
      <div className="mt-1.5 text-sm font-semibold text-ink">{alerta.titulo}</div>
      <div className="text-xs text-ink-muted">{alerta.detalle}</div>
      <div className="mt-1.5 flex items-center gap-2 text-2xs text-ink-faint">
        <span>{alerta.proyecto}</span>
        <span className="h-1 w-1 rounded-full bg-ink-faint/50" />
        <span>{alerta.hace}</span>
      </div>
    </article>
  );
}
