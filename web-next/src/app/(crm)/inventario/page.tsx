"use client";
import { useState, useCallback, useMemo, useEffect, type ReactNode } from "react";
import { useProyectos, useUnidades } from "@/application/inventario/useInventario";
import { useMoney, usePrefs } from "@/presentation/providers/PrefsProvider";
import type { Unidad, EstadoUnidad } from "@/domain/entities/Unidad";
import type { Proyecto } from "@/domain/entities/Proyecto";
import {
  IconClose, IconDownload, IconEdit, IconGrid,
  IconImage, IconList, IconUpload,
} from "@/presentation/components/ui/icons";

// Catálogo de estados de unidad — un solo lugar de verdad para color + label.
const ESTADO: Record<EstadoUnidad, { label: string; hex: string }> = {
  DISPONIBLE: { label: "Disponible", hex: "#6FB8A8" },
  NEGOCIACION: { label: "En negociación", hex: "#D4A574" },
  BLOQUEADO: { label: "Bloqueado", hex: "#9B8AC9" },
  ENTREGA: { label: "En entrega", hex: "#7C9CC6" },
  VENDIDA: { label: "Vendido", hex: "#6B6F78" },
};
const ESTADOS = Object.keys(ESTADO) as EstadoUnidad[];

type Vista = "mapa" | "listado";

export default function Inventario() {
  const { proyectos } = useProyectos();
  const { role } = usePrefs();
  const isAdmin = role === "admin";

  const [proyectoId, setProyectoId] = useState("pr1");
  const { unidades: unidadesApi, loading } = useUnidades(proyectoId);

  // Overlays locales: ediciones de backoffice y planos subidos en la sesión.
  const [overrides, setOverrides] = useState<Record<string, Partial<Unidad>>>({});
  const [planos, setPlanos] = useState<Record<string, string>>({});

  const [vista, setVista] = useState<Vista>("mapa");
  const [fEstado, setFEstado] = useState<EstadoUnidad | "all">("all");
  const [fTipo, setFTipo] = useState<string>("all");
  const [selId, setSelId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Merge data API + ediciones locales
  const unidades = useMemo(
    () => (unidadesApi ?? []).map((u) => ({ ...u, ...overrides[u.id] })),
    [unidadesApi, overrides],
  );

  const tipologias = useMemo(
    () => [...new Set(unidades.map((u) => u.tipologia))].sort(),
    [unidades],
  );

  const pasa = useMemo(
    () => (u: Unidad) =>
      (fEstado === "all" || u.estado === fEstado) && (fTipo === "all" || u.tipologia === fTipo),
    [fEstado, fTipo],
  );

  const filtradas = useMemo(() => unidades.filter(pasa), [unidades, pasa]);

  const conteos = useMemo(() => {
    const c: Record<string, number> = { TOTAL: unidades.length };
    for (const e of ESTADOS) c[e] = 0;
    for (const u of unidades) c[u.estado]++;
    return c;
  }, [unidades]);

  const sel = unidades.find((u) => u.id === selId) ?? null;

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2400);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Cambiar de proyecto limpia selección
  function cambiarProyecto(id: string) {
    setProyectoId(id);
    setSelId(null);
  }

  function guardarEdicion(id: string, patch: Partial<Unidad>) {
    setOverrides((o) => ({ ...o, [id]: { ...o[id], ...patch } }));
    setEditId(null);
    setToast("Unidad actualizada");
  }

  function subirPlano(id: string, file: File) {
    const url = URL.createObjectURL(file);
    setPlanos((p) => ({ ...p, [id]: url }));
    setOverrides((o) => ({ ...o, [id]: { ...o[id], tienePlano: true } }));
    setToast("Plano cargado");
  }

  function descargarCSV() {
    const cols = ["numero", "piso", "tipologia", "dormitorios", "area", "precio_usd", "vista", "estado", "propietario"];
    const filas = unidades.map((u) =>
      [u.numero, u.piso, u.tipologia, u.dormitorios, u.area, u.precio, u.vista, ESTADO[u.estado].label, u.propietario ?? ""]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [cols.join(","), ...filas].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `inventario_${proyectoId}.csv`;
    a.click();
    setToast(`Base descargada · ${unidades.length} unidades`);
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 p-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2.5 font-display text-2xl font-bold">
            Inventario
            {isAdmin && (
              <span className="rounded-md bg-violet/15 px-2 py-0.5 text-2xs font-bold uppercase text-violet">
                Modo edición
              </span>
            )}
          </h1>
          <p className="text-sm text-ink-muted">
            Disponibilidad en tiempo real · clic en una unidad para ver su detalle y plano
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(proyectos ?? []).map((pr) => (
            <button
              key={pr.id}
              onClick={() => cambiarProyecto(pr.id)}
              className={`rounded-pill px-3 py-1.5 text-xs font-medium transition-colors ${
                proyectoId === pr.id
                  ? "bg-gold text-bg"
                  : "border border-border bg-surface text-ink-muted hover:text-ink"
              }`}
            >
              {pr.nombre}
              <span className="ml-1.5 tabular-nums opacity-70">{pr.totalUnidades}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Stats por estado */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Total unidades" valor={conteos.TOTAL} hex="#D4A574" />
        {ESTADOS.map((e) => (
          <Stat key={e} label={ESTADO[e].label} valor={conteos[e]} hex={ESTADO[e].hex} />
        ))}
      </div>

      {/* Barra de vista + filtros + acciones backoffice */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-0.5 rounded-lg border border-border bg-surface p-0.5">
          <ViewTab active={vista === "mapa"} onClick={() => setVista("mapa")} icon={<IconGrid width={15} height={15} />}>
            Mapa
          </ViewTab>
          <ViewTab active={vista === "listado"} onClick={() => setVista("listado")} icon={<IconList width={15} height={15} />}>
            Listado
          </ViewTab>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <>
              <button
                onClick={descargarCSV}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-raised"
              >
                <IconDownload width={14} height={14} />
                Descargar base
              </button>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-violet/90 px-3 py-2 text-xs font-semibold text-bg transition-colors hover:bg-violet">
                <IconUpload width={14} height={14} />
                Cargar listado
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setToast(`Listado "${f.name}" recibido · validando filas…`);
                    e.target.value = "";
                  }}
                />
              </label>
            </>
          )}
          <select
            value={fEstado}
            onChange={(e) => setFEstado(e.target.value as EstadoUnidad | "all")}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-border-strong focus:outline-none"
          >
            <option value="all">Todos los estados</option>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>{ESTADO[e].label}</option>
            ))}
          </select>
          <select
            value={fTipo}
            onChange={(e) => setFTipo(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-border-strong focus:outline-none"
          >
            <option value="all">Todas las tipologías</option>
            {tipologias.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* Vista principal */}
        <section className="card overflow-x-auto p-5">
          {loading ? (
            <div className="skeleton h-[480px] rounded" />
          ) : vista === "mapa" ? (
            <BuildingMap unidades={unidades} pasa={pasa} selId={selId} onSelect={setSelId} />
          ) : (
            <UnitTable unidades={filtradas} isAdmin={isAdmin} onSelect={(id) => { setSelId(id); setVista("mapa"); }} />
          )}
        </section>

        {/* Panel de detalle */}
        <UnitPanel
          unidad={sel}
          isAdmin={isAdmin}
          planoUrl={sel ? planos[sel.id] : undefined}
          onEdit={() => sel && setEditId(sel.id)}
          onPlano={(f) => sel && subirPlano(sel.id, f)}
          onLightbox={() => sel && (planos[sel.id] || sel.tienePlano) && setLightbox(sel.id)}
        />
      </div>

      {/* Modal de edición (backoffice) */}
      {editId && (
        <EditModal
          unidad={unidades.find((u) => u.id === editId)!}
          onClose={() => setEditId(null)}
          onSave={(patch) => guardarEdicion(editId, patch)}
        />
      )}

      {/* Lightbox del plano */}
      {lightbox && (
        <Lightbox onClose={() => setLightbox(null)}>
          {planos[lightbox] ? (
            <img src={planos[lightbox]} alt="Plano" className="max-h-[85vh] max-w-[90vw] rounded-lg bg-white" />
          ) : (
            <PlanoSchematic unidad={unidades.find((u) => u.id === lightbox)!} large />
          )}
        </Lightbox>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-green px-5 py-3 text-sm font-semibold text-bg shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ------------------------------- Stats ------------------------------- */
function Stat({ label, valor, hex }: { label: string; valor: number; hex: string }) {
  return (
    <div className="card p-3.5">
      <div className="font-display text-2xl font-bold tabular-nums">{valor}</div>
      <div className="mt-1 flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-normal text-ink-faint">
        <span className="h-1.5 w-1.5 rounded-sm" style={{ background: hex }} />
        {label}
      </div>
    </div>
  );
}

/* ----------------------------- Mapa edificio ----------------------------- */
function BuildingMap({
  unidades,
  pasa,
  selId,
  onSelect,
}: {
  unidades: Unidad[];
  pasa: (u: Unidad) => boolean;
  selId: string | null;
  onSelect: (id: string) => void;
}) {
  const pisos = useMemo(
    () => [...new Set(unidades.map((u) => u.piso))].sort((a, b) => b - a),
    [unidades],
  );

  return (
    <div>
      <div className="flex flex-col gap-1.5">
        {pisos.map((piso) => {
          const ofPiso = unidades.filter((u) => u.piso === piso).sort((a, b) => a.numero.localeCompare(b.numero));
          return (
            <div key={piso} className="flex items-center gap-3">
              <span className="w-12 shrink-0 text-right font-display text-xs font-bold text-ink-faint tabular-nums">
                P{piso}
              </span>
              <div className="flex flex-1 gap-1.5">
                {ofPiso.map((u) => {
                  const c = ESTADO[u.estado];
                  const dim = !pasa(u);
                  const selected = u.id === selId;
                  return (
                    <button
                      key={u.id}
                      onClick={() => onSelect(u.id)}
                      title={`${u.numero} · ${c.label} · ${u.area} m²`}
                      style={{
                        background: c.hex,
                        opacity: dim ? 0.15 : u.estado === "VENDIDA" ? 0.55 : 1,
                        boxShadow: selected ? "0 0 0 2px rgb(var(--gold-rgb))" : undefined,
                      }}
                      className="relative grid aspect-[1.5] min-w-0 flex-1 place-items-center rounded-md text-white transition-transform hover:z-10 hover:-translate-y-0.5 hover:scale-[1.04]"
                    >
                      <span className="font-display text-xs font-bold leading-none">{u.numero}</span>
                      <span className="mt-0.5 text-[8.5px] leading-none opacity-90 tabular-nums">{u.area} m²</span>
                      {u.tienePlano && <span className="absolute right-1 top-1 h-1 w-1 rounded-full bg-white/80" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 h-2 rounded-b-md bg-border-strong" />
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-2xs text-ink-faint">
        {ESTADOS.map((e) => (
          <span key={e} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: ESTADO[e].hex }} />
            {ESTADO[e].label}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-ink-faint" /> tiene plano
        </span>
      </div>
    </div>
  );
}

/* ------------------------------- Listado ------------------------------- */
function UnitTable({
  unidades,
  isAdmin,
  onSelect,
}: {
  unidades: Unidad[];
  isAdmin: boolean;
  onSelect: (id: string) => void;
}) {
  const money = useMoney();
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            {["Unidad", "Piso", "Tipología", "Dorm.", "Área", "Vista", "Precio", "Estado", isAdmin ? "Propietario" : ""].map(
              (h, i) =>
                h ? (
                  <th key={i} className="px-3 py-2.5 text-2xs font-semibold uppercase tracking-normal text-ink-faint">
                    {h}
                  </th>
                ) : null,
            )}
          </tr>
        </thead>
        <tbody>
          {unidades.map((u) => (
            <tr
              key={u.id}
              onClick={() => onSelect(u.id)}
              className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-raised"
            >
              <td className="px-3 py-2.5 font-display font-bold tabular-nums">{u.numero}</td>
              <td className="px-3 py-2.5 tabular-nums text-ink-muted">{u.piso}</td>
              <td className="px-3 py-2.5 text-ink-muted">{u.tipologia}</td>
              <td className="px-3 py-2.5 tabular-nums text-ink-muted">{u.dormitorios}</td>
              <td className="px-3 py-2.5 tabular-nums text-ink-muted">{u.area} m²</td>
              <td className="px-3 py-2.5 capitalize text-ink-muted">{u.vista.toLowerCase()}</td>
              <td className="px-3 py-2.5 font-display font-bold tabular-nums">{money.short(u.precio)}</td>
              <td className="px-3 py-2.5">
                <EstadoPill estado={u.estado} />
              </td>
              {isAdmin && <td className="px-3 py-2.5 text-xs text-ink-faint">{u.propietario ?? "—"}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EstadoPill({ estado }: { estado: EstadoUnidad }) {
  const c = ESTADO[estado];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-pill px-2 py-0.5 text-2xs font-semibold"
      style={{ color: c.hex, background: `${c.hex}1f` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.hex }} />
      {c.label}
    </span>
  );
}

/* ----------------------------- Panel detalle ----------------------------- */
function UnitPanel({
  unidad,
  isAdmin,
  planoUrl,
  onEdit,
  onPlano,
  onLightbox,
}: {
  unidad: Unidad | null;
  isAdmin: boolean;
  planoUrl?: string;
  onEdit: () => void;
  onPlano: (f: File) => void;
  onLightbox: () => void;
}) {
  const money = useMoney();
  if (!unidad) {
    return (
      <aside className="card grid h-fit place-items-center p-8 text-center text-sm text-ink-faint">
        <div>
          <IconImage className="mx-auto mb-3 opacity-40" width={34} height={34} />
          Selecciona una unidad en el mapa
          <br />
          para ver su detalle y plano
        </div>
      </aside>
    );
  }
  const precioM2 = Math.round(unidad.precio / unidad.area);
  return (
    <aside className="card animate-fade-up h-fit p-5">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="font-display text-2xl font-extrabold tabular-nums">{unidad.numero}</span>
        <EstadoPill estado={unidad.estado} />
      </div>

      {/* Plano (subido o esquema) */}
      <div className="mt-4">
        {planoUrl ? (
          <img
            src={planoUrl}
            alt="Plano"
            onClick={onLightbox}
            className="w-full cursor-zoom-in rounded-lg border border-border bg-white"
          />
        ) : (
          <button
            onClick={onLightbox}
            className="block w-full cursor-zoom-in overflow-hidden rounded-lg border border-border bg-white"
            title="Clic para ampliar"
          >
            <PlanoSchematic unidad={unidad} />
          </button>
        )}
      </div>

      <div className="mt-4 font-display text-2xl font-extrabold text-gold tabular-nums">
        {money.short(unidad.precio)}
      </div>
      <div className="text-2xs text-ink-faint tabular-nums">{money.full(precioM2)} / m²</div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Item label="Tipología" v={unidad.tipologia} />
        <Item label="Área" v={`${unidad.area} m²`} />
        <Item label="Dormitorios" v={`${unidad.dormitorios}`} />
        <Item label="Baños" v={`${unidad.banos}`} />
        <Item label="Vista" v={unidad.vista.toLowerCase()} />
        <Item label="Estacion." v={`${unidad.estacionamientos}`} />
        <Item label="Terraza" v={unidad.tieneTerraza ? "Sí" : "No"} />
        <Item label="Piso" v={`${unidad.piso}`} />
        {isAdmin && <Item label="Propietario" v={unidad.propietario ?? "—"} />}
      </dl>

      <div className="mt-4 rounded-lg border border-border bg-bg/40 p-3">
        <div className="text-2xs uppercase tracking-normal text-ink-faint">Prospectos interesados</div>
        <div className="mt-0.5 font-display text-lg font-bold tabular-nums">
          {unidad.interesados}
          <span className="ml-1 text-xs font-normal text-ink-muted">
            {unidad.interesados === 1 ? "prospecto" : "prospectos"}
          </span>
        </div>
      </div>

      {isAdmin && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={onEdit}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-violet bg-violet/15 px-3 py-2 text-xs font-semibold text-violet transition-colors hover:bg-violet/25"
          >
            <IconEdit width={14} height={14} />
            Editar unidad
          </button>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-raised">
            <IconUpload width={14} height={14} />
            Plano
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onPlano(f);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      )}
    </aside>
  );
}

const Item = ({ label, v }: { label: string; v: string }) => (
  <div>
    <dt className="text-2xs uppercase tracking-normal text-ink-faint">{label}</dt>
    <dd className="mt-0.5 font-medium capitalize">{v}</dd>
  </div>
);

/* ------------------------- Esquema de plano (SVG) ------------------------- */
// Diagrama esquemático generado de las dimensiones — NO es un plano real,
// es una representación visual del distribuido según dormitorios.
function PlanoSchematic({ unidad, large = false }: { unidad: Unidad; large?: boolean }) {
  const W = 320, H = 220;
  const rooms: { x: number; y: number; w: number; h: number; label: string }[] = [];
  const dorm = unidad.dormitorios;
  // Sala-comedor + cocina abajo; dormitorios arriba.
  rooms.push({ x: 8, y: 120, w: 180, h: 92, label: "Sala / Comedor" });
  rooms.push({ x: 192, y: 120, w: 120, h: 92, label: "Cocina" });
  const dormW = (304) / Math.max(dorm, 1);
  for (let i = 0; i < dorm; i++) {
    rooms.push({ x: 8 + i * dormW, y: 8, w: dormW - 4, h: 104, label: i === 0 ? "Dorm. principal" : `Dorm. ${i + 1}` });
  }
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={large ? "max-h-[80vh] w-auto rounded-lg bg-white" : "w-full"}
      style={large ? { width: "min(80vw, 720px)" } : undefined}
    >
      <rect x="2" y="2" width={W - 4} height={H - 4} fill="#FBFAF7" stroke="#1A1B1E" strokeWidth="2" />
      {rooms.map((r, i) => (
        <g key={i}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h} fill="none" stroke="#8A6B4A" strokeWidth="1.4" />
          <text x={r.x + r.w / 2} y={r.y + r.h / 2} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#5A5E66" fontFamily="sans-serif">
            {r.label}
          </text>
        </g>
      ))}
      <text x={W - 10} y={H - 10} textAnchor="end" fontSize="9" fill="#92959C" fontFamily="sans-serif">
        {unidad.numero} · {unidad.area} m² · esquemático
      </text>
    </svg>
  );
}

/* --------------------------------- Modales --------------------------------- */
function Lightbox({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] grid cursor-zoom-out place-items-center bg-black/85 p-10 backdrop-blur-sm"
    >
      <button className="absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-lg bg-white/10 text-white">
        <IconClose width={22} height={22} />
      </button>
      {children}
    </div>
  );
}

function EditModal({
  unidad,
  onClose,
  onSave,
}: {
  unidad: Unidad;
  onClose: () => void;
  onSave: (patch: Partial<Unidad>) => void;
}) {
  const [d, setD] = useState<Unidad>(unidad);
  const set = <K extends keyof Unidad>(k: K, v: Unidad[K]) => setD((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-6 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-card border border-border-strong bg-surface shadow-2xl"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-surface px-5 py-4">
          <h3 className="font-display text-lg font-bold">
            Editar unidad · <span className="tabular-nums text-gold">{unidad.numero}</span>
          </h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md border border-border text-ink-muted hover:bg-raised">
            <IconClose width={16} height={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 p-5">
          <Field label="N° Departamento">
            <input className="inp" value={d.numero} onChange={(e) => set("numero", e.target.value)} />
          </Field>
          <Field label="Tipología">
            <input className="inp" value={d.tipologia} onChange={(e) => set("tipologia", e.target.value)} />
          </Field>
          <Field label="Dormitorios">
            <input type="number" className="inp" value={d.dormitorios} onChange={(e) => set("dormitorios", Number(e.target.value))} />
          </Field>
          <Field label="Baños">
            <input type="number" className="inp" value={d.banos} onChange={(e) => set("banos", Number(e.target.value))} />
          </Field>
          <Field label="Área (m²)">
            <input type="number" className="inp" value={d.area} onChange={(e) => set("area", Number(e.target.value))} />
          </Field>
          <Field label="Precio lista (US$)">
            <input type="number" className="inp" value={d.precio} onChange={(e) => set("precio", Number(e.target.value))} />
          </Field>
          <Field label="Vista">
            <select className="inp" value={d.vista} onChange={(e) => set("vista", e.target.value as Unidad["vista"])}>
              {["MAR", "PARQUE", "CIUDAD", "INTERIOR"].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </Field>
          <Field label="Estado">
            <select className="inp" value={d.estado} onChange={(e) => set("estado", e.target.value as EstadoUnidad)}>
              {ESTADOS.map((e) => (
                <option key={e} value={e}>{ESTADO[e].label}</option>
              ))}
            </select>
          </Field>
          <Field label="Propietario" full>
            <input className="inp" value={d.propietario ?? ""} onChange={(e) => set("propietario", e.target.value)} />
          </Field>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-2.5 border-t border-border bg-surface px-5 py-4">
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-raised">
            Cancelar
          </button>
          <button
            onClick={() =>
              onSave({
                numero: d.numero,
                tipologia: d.tipologia,
                dormitorios: d.dormitorios,
                banos: d.banos,
                area: d.area,
                precio: d.precio,
                vista: d.vista,
                estado: d.estado,
                propietario: d.propietario,
              })
            }
            className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-bg transition-transform hover:-translate-y-px"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

const Field = ({ label, full, children }: { label: string; full?: boolean; children: ReactNode }) => (
  <div className={`flex flex-col gap-1.5 ${full ? "col-span-2" : ""}`}>
    <label className="text-2xs font-semibold uppercase tracking-normal text-ink-faint">{label}</label>
    {children}
  </div>
);

const ViewTab = ({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: ReactNode; children: ReactNode }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2 rounded-md px-3.5 py-1.5 text-sm font-semibold transition-colors ${
      active ? "bg-gold text-bg" : "text-ink-muted hover:text-ink"
    }`}
  >
    {icon}
    {children}
  </button>
);
