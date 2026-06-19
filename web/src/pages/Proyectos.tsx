import { useNavigate } from "react-router-dom";
import { useProyectos } from "@/api/hooks";
import type { EstadoProyecto, Proyecto } from "@/api/types";
import { usdShort } from "@/lib/format";

const ESTADO: Record<EstadoProyecto, { label: string; hex: string }> = {
  EN_VENTA: { label: "En venta", hex: "#3EC898" },
  EN_CONSTRUCCION: { label: "En construcción", hex: "#E8C547" },
  ENTREGADO: { label: "Entregado", hex: "#5B8EF0" },
};

export function Proyectos() {
  const { data, isLoading } = useProyectos();
  const nav = useNavigate();

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 p-6">
      <header>
        <h1 className="font-display text-2xl font-bold">Proyectos</h1>
        <p className="text-sm text-ink-muted">{data?.length ?? "—"} proyectos en cartera</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-56 rounded-card" />)
          : data!.map((pr, i) => <ProyectoCard key={pr.id} pr={pr} index={i} onClick={() => nav("/inventario")} />)}
      </div>
    </div>
  );
}

function ProyectoCard({ pr, index, onClick }: { pr: Proyecto; index: number; onClick: () => void }) {
  const e = ESTADO[pr.estado];
  const pctVendido = Math.round((pr.vendidas / pr.totalUnidades) * 100);
  return (
    <button
      onClick={onClick}
      className="card card-hover animate-fade-up p-5 text-left"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-lg font-bold">{pr.nombre}</h2>
          <p className="text-xs text-ink-faint">{pr.distrito}</p>
        </div>
        <span
          className="rounded-pill px-2 py-0.5 text-2xs font-semibold"
          style={{ color: e.hex, background: `${e.hex}1a` }}
        >
          {e.label}
        </span>
      </div>

      {/* Avance de obra */}
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-2xs text-ink-faint">
          <span>Avance de obra</span>
          <span className="tabular-nums">{pr.avanceObra}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-pill bg-raised">
          <div className="h-full rounded-pill bg-gold" style={{ width: `${pr.avanceObra}%` }} />
        </div>
      </div>

      {/* Mix de unidades — barra segmentada, no solo números */}
      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-2xs text-ink-faint">
          <span>{pr.totalUnidades} unidades</span>
          <span>{pctVendido}% vendido</span>
        </div>
        <div className="flex h-2 overflow-hidden rounded-pill">
          <span style={{ flex: pr.vendidas, background: "#5C6373" }} />
          <span style={{ flex: pr.reservadas, background: "#E8C547" }} />
          <span style={{ flex: pr.disponibles, background: "#3EC898" }} />
        </div>
        <div className="mt-2 flex gap-3 text-2xs text-ink-faint">
          <span><b className="text-green">{pr.disponibles}</b> disp.</span>
          <span><b className="text-gold">{pr.reservadas}</b> reserv.</span>
          <span><b className="text-ink-muted">{pr.vendidas}</b> vend.</span>
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-3 text-sm">
        <span className="text-ink-faint">Desde </span>
        <span className="font-display font-bold text-gold">{usdShort(pr.ticketDesde)}</span>
      </div>
    </button>
  );
}
