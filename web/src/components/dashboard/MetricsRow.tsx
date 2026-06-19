import type { ReactNode } from "react";
import { useMetrics } from "@/api/hooks";
import { pct } from "@/lib/format";
import { useMoney } from "@/lib/prefs";
import { IconArrowDown, IconArrowUp, IconClock } from "@/components/ui/icons";
import { Sparkline } from "./Sparkline";

// Series cortas solo para dar forma a la tendencia (en prod vendrían de la API).
const SERIES = {
  pipeline: [3.9, 4.0, 4.2, 4.1, 4.5, 4.6, 4.82],
  cierre: [0.19, 0.2, 0.22, 0.21, 0.23, 0.24, 0.24],
  tiempo: [46, 45, 44, 42, 41, 39, 38],
};

type Delta = { value: string; good: boolean };

function Metric({
  label,
  value,
  delta,
  spark,
  accent = false,
  context,
}: {
  label: string;
  value: ReactNode;
  delta?: Delta;
  spark?: { data: number[]; color: string };
  accent?: boolean;
  context: string;
}) {
  return (
    <div
      className={`animate-fade-up rounded-card border bg-surface p-5 ${
        accent ? "border-red/30" : "border-border"
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="label">{label}</span>
        {delta && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-pill px-1.5 py-0.5 text-2xs font-semibold ${
              delta.good ? "bg-green-soft text-green" : "bg-red-soft text-red"
            }`}
          >
            {delta.good ? (
              <IconArrowUp width={11} height={11} />
            ) : (
              <IconArrowDown width={11} height={11} />
            )}
            {delta.value}
          </span>
        )}
      </div>

      <div
        className={`mt-2 font-display text-3xl font-bold tabular-nums ${
          accent ? "text-red" : "text-ink"
        }`}
      >
        {value}
      </div>

      <div className="mt-1 text-xs text-ink-faint">{context}</div>

      {spark && (
        <div className="-mb-1 mt-2">
          <Sparkline data={spark.data} color={spark.color} />
        </div>
      )}
    </div>
  );
}

export function MetricsRow() {
  const { data, isLoading } = useMetrics();
  const money = useMoney();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-[148px] rounded-card" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Metric
        label="Pipeline total"
        value={money.short(data.pipelineTotal)}
        delta={{ value: pct(data.pipelineDeltaPct), good: data.pipelineDeltaPct >= 0 }}
        context="Valor de deals activos · vs. mes anterior"
        spark={{ data: SERIES.pipeline, color: "#D4A574" }}
      />
      <Metric
        label="Tasa de cierre"
        value={pct(data.tasaCierre)}
        delta={{ value: pct(data.tasaCierreDeltaPct, true), good: data.tasaCierreDeltaPct >= 0 }}
        context="Ganados / total cerrados · últimos 90 días"
        spark={{ data: SERIES.cierre, color: "#6FB8A8" }}
      />
      <Metric
        label="Tiempo promedio"
        value={
          <span className="inline-flex items-center gap-1.5">
            <IconClock className="text-ink-faint" width={20} height={20} />
            {data.tiempoPromedioDias}d
          </span>
        }
        delta={{
          value: `${Math.abs(data.tiempoPromedioDeltaDias)}d`,
          good: data.tiempoPromedioDeltaDias <= 0,
        }}
        context="De primer contacto a cierre"
        spark={{ data: SERIES.tiempo, color: "#7C9CC6" }}
      />
      <Metric
        label="Prospectos en riesgo"
        value={data.enRiesgo}
        accent
        context="Deals de alto valor estancados · requieren acción hoy"
      />
    </div>
  );
}
