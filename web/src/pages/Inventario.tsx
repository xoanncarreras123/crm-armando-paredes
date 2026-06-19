import { useMemo, useState, type ReactNode } from "react";
import { useProyectos, useUnidades } from "@/api/hooks";
import type { EstadoUnidad, Unidad, VistaUnidad } from "@/api/types";
import { usdShort } from "@/lib/format";

const ESTADO_COLOR: Record<EstadoUnidad, string> = {
  DISPONIBLE: "#3EC898",
  RESERVADA: "#E8C547",
  VENDIDA: "#5C6373",
};
const VISTAS: (VistaUnidad | "TODAS")[] = ["TODAS", "MAR", "PARQUE", "CIUDAD", "INTERIOR"];

export function Inventario() {
  const { data: proyectos } = useProyectos();
  const [proyectoId, setProyectoId] = useState("pr1");
  const { data: unidades, isLoading } = useUnidades(proyectoId);

  const [dorm, setDorm] = useState(0); // 0 = todos
  const [vista, setVista] = useState<(typeof VISTAS)[number]>("TODAS");
  const [precioMax, setPrecioMax] = useState(900);
  const [sel, setSel] = useState<Unidad | null>(null);

  const pasa = useMemo(
    () => (u: Unidad) =>
      (dorm === 0 || u.dormitorios === dorm) &&
      (vista === "TODAS" || u.vista === vista) &&
      u.precio <= precioMax * 1000,
    [dorm, vista, precioMax],
  );

  const pisos = useMemo(
    () => [...new Set((unidades ?? []).map((u) => u.piso))].sort((a, b) => b - a),
    [unidades],
  );

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 p-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Inventario</h1>
          <p className="text-sm text-ink-muted">Planta del edificio · click en una unidad para ver detalle</p>
        </div>
        <div className="flex gap-1.5">
          {(proyectos ?? []).map((pr) => (
            <button
              key={pr.id}
              onClick={() => {
                setProyectoId(pr.id);
                setSel(null);
              }}
              className={`rounded-pill px-3 py-1.5 text-xs font-medium transition-colors ${
                proyectoId === pr.id
                  ? "bg-gold text-bg"
                  : "border border-border bg-surface text-ink-muted hover:text-ink"
              }`}
            >
              {pr.nombre}
            </button>
          ))}
        </div>
      </header>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4 rounded-card border border-border bg-surface px-5 py-3">
        <Filtro label="Dormitorios">
          {[0, 1, 2, 3].map((d) => (
            <Chip key={d} active={dorm === d} onClick={() => setDorm(d)}>
              {d === 0 ? "Todos" : `${d} dorm`}
            </Chip>
          ))}
        </Filtro>
        <Filtro label="Orientación">
          {VISTAS.map((v) => (
            <Chip key={v} active={vista === v} onClick={() => setVista(v)}>
              {v === "TODAS" ? "Todas" : v.charAt(0) + v.slice(1).toLowerCase()}
            </Chip>
          ))}
        </Filtro>
        <Filtro label={`Precio máx · ${usdShort(precioMax * 1000)}`}>
          <input
            type="range"
            min={250}
            max={900}
            step={10}
            value={precioMax}
            onChange={(e) => setPrecioMax(Number(e.target.value))}
            className="w-40 accent-gold"
          />
        </Filtro>
        <div className="ml-auto flex items-center gap-3 text-2xs">
          {(["DISPONIBLE", "RESERVADA", "VENDIDA"] as EstadoUnidad[]).map((e) => (
            <span key={e} className="flex items-center gap-1.5 text-ink-faint">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: ESTADO_COLOR[e] }} />
              {e.charAt(0) + e.slice(1).toLowerCase()}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Planta SVG */}
        <section className="card overflow-x-auto p-6">
          {isLoading ? (
            <div className="skeleton h-[460px] rounded" />
          ) : (
            <BuildingPlan pisos={pisos} unidades={unidades ?? []} pasa={pasa} sel={sel} onSelect={setSel} />
          )}
        </section>

        {/* Panel de detalle */}
        <UnitPanel unidad={sel} />
      </div>
    </div>
  );
}

function BuildingPlan({
  pisos,
  unidades,
  pasa,
  sel,
  onSelect,
}: {
  pisos: number[];
  unidades: Unidad[];
  pasa: (u: Unidad) => boolean;
  sel: Unidad | null;
  onSelect: (u: Unidad) => void;
}) {
  const UW = 96, UH = 48, GX = 12, GY = 12, LBL = 48;
  const cols = 3;
  const width = LBL + cols * UW + (cols - 1) * GX;
  const height = pisos.length * (UH + GY);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto w-full max-w-[420px]">
      {pisos.map((piso, row) => {
        const y = row * (UH + GY);
        const ofPiso = unidades.filter((u) => u.piso === piso).sort((a, b) => a.numero.localeCompare(b.numero));
        return (
          <g key={piso}>
            <text x={0} y={y + UH / 2 + 4} className="fill-ink-faint" style={{ fontSize: 12, fontWeight: 600 }}>
              P{piso}
            </text>
            {ofPiso.map((u, col) => {
              const x = LBL + col * (UW + GX);
              const hex = ESTADO_COLOR[u.estado];
              const dim = !pasa(u);
              const selected = sel?.id === u.id;
              return (
                <g
                  key={u.id}
                  transform={`translate(${x},${y})`}
                  onClick={() => onSelect(u)}
                  style={{ cursor: "pointer", opacity: dim ? 0.22 : 1, transition: "opacity .2s" }}
                >
                  <rect
                    width={UW}
                    height={UH}
                    rx={7}
                    fill={`${hex}26`}
                    stroke={selected ? "#EDEFF3" : hex}
                    strokeWidth={selected ? 2 : 1.2}
                  />
                  <text x={10} y={20} style={{ fontSize: 13, fontWeight: 700 }} fill={hex}>
                    {u.numero}
                  </text>
                  <text x={10} y={37} className="fill-ink-muted" style={{ fontSize: 10 }}>
                    {u.dormitorios}d · {u.area}m²
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

function UnitPanel({ unidad }: { unidad: Unidad | null }) {
  if (!unidad) {
    return (
      <aside className="card grid place-items-center p-6 text-center text-sm text-ink-faint">
        Selecciona una unidad en la planta para ver su detalle.
      </aside>
    );
  }
  const hex = ESTADO_COLOR[unidad.estado];
  return (
    <aside className="card animate-fade-up h-fit p-5">
      <div className="flex items-center justify-between">
        <span className="font-display text-2xl font-extrabold">{unidad.numero}</span>
        <span
          className="rounded-pill px-2 py-0.5 text-2xs font-bold uppercase"
          style={{ color: hex, background: `${hex}22` }}
        >
          {unidad.estado.toLowerCase()}
        </span>
      </div>
      <div className="mt-1 font-display text-xl font-bold text-gold">{usdShort(unidad.precio)}</div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Item label="Área" v={`${unidad.area} m²`} />
        <Item label="Piso" v={`${unidad.piso}`} />
        <Item label="Dormitorios" v={`${unidad.dormitorios}`} />
        <Item label="Baños" v={`${unidad.banos}`} />
        <Item label="Vista" v={unidad.vista.toLowerCase()} />
        <Item label="Estacion." v={`${unidad.estacionamientos}`} />
        <Item label="Terraza" v={unidad.tieneTerraza ? "Sí" : "No"} />
      </dl>

      <div className="mt-4 rounded-lg border border-border bg-bg/40 p-3">
        <div className="text-2xs uppercase tracking-wide text-ink-faint">Prospectos interesados</div>
        <div className="mt-0.5 font-display text-lg font-bold">
          {unidad.interesados}
          <span className="ml-1 text-xs font-normal text-ink-muted">
            {unidad.interesados === 1 ? "prospecto" : "prospectos"}
          </span>
        </div>
      </div>
    </aside>
  );
}

const Item = ({ label, v }: { label: string; v: string }) => (
  <div>
    <dt className="text-2xs uppercase tracking-wide text-ink-faint">{label}</dt>
    <dd className="mt-0.5 font-medium capitalize">{v}</dd>
  </div>
);

const Filtro = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex items-center gap-2">
    <span className="text-2xs font-semibold uppercase text-ink-faint">{label}</span>
    <div className="flex flex-wrap gap-1">{children}</div>
  </div>
);

const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) => (
  <button
    onClick={onClick}
    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
      active ? "bg-raised text-ink" : "text-ink-faint hover:text-ink"
    }`}
  >
    {children}
  </button>
);
