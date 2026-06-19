"use client";
import { useRouter } from "next/navigation";
import type { Alerta, TipoAlerta } from "@/domain/entities/Alerta";
import { IconAlertas, IconBolt, IconClock } from "@/presentation/components/ui/icons";
import { ScoreBadge } from "@/presentation/components/ui/ScoreBadge";

const MOCK_ALERTAS: Alerta[] = [
  { id:"al1", tipo:"SENAL_CIERRE", prospectoId:"p3", titulo:"Andrés Cáceres preguntó por escrituras", detalle:'"¿Qué documentos necesito para firmar?" — vía WhatsApp', score:41, proyecto:"Torre Basadre", hace:"hace 14 h" },
  { id:"al2", tipo:"CHURN",        prospectoId:"p2", titulo:"Patricia Zegarra en riesgo de fuga",     detalle:"30 días sin actividad en un deal de US$540K", score:64, proyecto:"Malecón 28",    hace:"hace 30 días" },
  { id:"al3", tipo:"RENOVACION",   prospectoId:"p1", titulo:"Separación de Gonzalo por vencer",       detalle:"La hipoteca pre-aprobada vence el jueves",     score:87, proyecto:"Torre Basadre", hace:"vence en 2 días" },
];

const META: Record<TipoAlerta, { label: string; hex: string; Icon: typeof IconBolt }> = {
  SENAL_CIERRE: { label: "Señales de cierre", hex: "#D4A574", Icon: IconBolt },
  CHURN:        { label: "Riesgo de fuga",    hex: "#E07856", Icon: IconAlertas },
  RENOVACION:   { label: "Por vencer",        hex: "#7C9CC6", Icon: IconClock },
  INACTIVIDAD:  { label: "Inactividad",       hex: "#9B8AC9", Icon: IconClock },
};
const ORDEN: TipoAlerta[] = ["SENAL_CIERRE", "CHURN", "RENOVACION"];

export default function AlertasPage() {
  const router = useRouter();
  const alertas = MOCK_ALERTAS;

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      <header>
        <h1 className="text-2xl font-bold" style={{ fontFamily:"var(--font-syne, Syne)" }}>Alertas inteligentes</h1>
        <p className="text-sm" style={{ color:"rgb(var(--ink-muted-rgb))" }}>Lo que el sistema detectó y requiere tu atención hoy</p>
      </header>
      {ORDEN.map((tipo) => {
        const items = alertas.filter((a) => a.tipo === tipo);
        if (!items.length) return null;
        const m = META[tipo];
        return (
          <section key={tipo}>
            <div className="mb-2 flex items-center gap-2">
              <m.Icon width={15} height={15} style={{ color: m.hex }} />
              <h2 className="text-sm font-semibold" style={{ color: m.hex }}>{m.label}</h2>
              <span className="text-[11px]" style={{ color:"rgb(var(--ink-faint-rgb))" }}>({items.length})</span>
            </div>
            <div className="space-y-2.5">
              {items.map((a, i) => (
                <button key={a.id} onClick={() => router.push(`/prospectos/${a.prospectoId}`)}
                  className="flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors"
                  style={{
                    animationDelay:`${i*40}ms`,
                    background: a.tipo==="SENAL_CIERRE" ? "rgba(212,165,116,0.06)" : undefined,
                    borderColor: a.tipo==="SENAL_CIERRE" ? "rgba(212,165,116,0.3)" : "var(--border)",
                  }}>
                  <ScoreBadge score={a.score} size="lg" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold" style={{ color:"rgb(var(--ink-rgb))" }}>{a.titulo}</div>
                    <div className="text-sm" style={{ color:"rgb(var(--ink-muted-rgb))" }}>{a.detalle}</div>
                  </div>
                  <div className="hidden text-right text-[11px] sm:block" style={{ color:"rgb(var(--ink-faint-rgb))" }}>
                    <div>{a.proyecto}</div><div>{a.hace}</div>
                  </div>
                  <span style={{ color:"rgb(var(--ink-faint-rgb))" }}>→</span>
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
