import { useState, type ReactNode } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProspecto } from "@/api/hooks";
import type { InteraccionItem, ProspectoDetalle, TipoInteraccion } from "@/api/types";
import { Avatar } from "@/components/ui/Avatar";
import { EtapaBadge } from "@/components/ui/EtapaBadge";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { Sparkline } from "@/components/dashboard/Sparkline";
import { GenerarMensajeModal } from "@/components/ai/GenerarMensajeModal";
import {
  IconBolt,
  IconCall,
  IconCotizador,
  IconMail,
  IconPlus,
  IconVisit,
  IconWhatsapp,
} from "@/components/ui/icons";
import { fecha, relativeTime, usdShort } from "@/lib/format";
import { scoreTone, TONE_HEX } from "@/lib/score";

const CANAL: Record<TipoInteraccion, { Icon: typeof IconWhatsapp; hex: string }> = {
  WHATSAPP: { Icon: IconWhatsapp, hex: "#3EC898" },
  EMAIL: { Icon: IconMail, hex: "#5B8EF0" },
  VISITA: { Icon: IconVisit, hex: "#E8C547" },
  LLAMADA: { Icon: IconCall, hex: "#9BA1AD" },
};

export function ProspectoDetalle() {
  const { id = "" } = useParams();
  const { data, isLoading } = useProspecto(id);
  const [modal, setModal] = useState(false);

  if (isLoading || !data) {
    return (
      <div className="mx-auto max-w-[1500px] p-6">
        <div className="skeleton h-[70vh] rounded-card" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-4 p-6">
      <Link to="/prospectos" className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
        ← Prospectos
      </Link>

      {/* Split 40/60 */}
      <div className="grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Izquierda p={data} onGenerar={() => setModal(true)} />
        </div>
        <div className="lg:col-span-3">
          <Timeline interacciones={data.interacciones} />
        </div>
      </div>

      {modal && <GenerarMensajeModal prospecto={data} onClose={() => setModal(false)} />}
    </div>
  );
}

/* ------------------------------ Columna izquierda ------------------------------ */
function Izquierda({ p, onGenerar }: { p: ProspectoDetalle; onGenerar: () => void }) {
  const cal = p.calificacion;
  const nav = useNavigate();
  return (
    <div className="space-y-4">
      {/* Identidad */}
      <section className="card animate-fade-up p-5">
        <div className="flex items-start gap-4">
          <Avatar nombre={p.nombre} size={56} />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-xl font-bold leading-tight">{p.nombre}</h1>
            <div className="mt-1.5"><EtapaBadge etapa={p.etapa} /></div>
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Dato label="Teléfono" valor={p.telefono} />
          <Dato label="Email" valor={p.email ?? "—"} />
          <Dato label="Fuente" valor={p.fuente} />
          <Dato label="Proyecto" valor={p.proyecto.nombre} />
        </dl>
      </section>

      {/* Score */}
      <section className="card animate-fade-up p-5" style={{ animationDelay: "40ms" }}>
        <div className="label mb-3">Score del prospecto</div>
        <div className="flex items-center gap-5">
          <ScoreGauge score={p.score} />
          <div className="min-w-0 flex-1">
            <div className="label mb-1.5 normal-case tracking-normal text-ink-faint">
              Historial
            </div>
            <Sparkline data={p.scoreHistorial} color={TONE_HEX[scoreTone(p.score)]} />
          </div>
        </div>
        {/* Explicación en lenguaje natural (de la API) */}
        <div className="mt-4 flex gap-2.5 rounded-lg border-l-2 border-gold bg-gold-soft p-3">
          <IconBolt className="mt-px shrink-0 text-gold" width={14} height={14} />
          <p className="text-sm leading-relaxed text-ink">{p.scoreExplicacion}</p>
        </div>
      </section>

      {/* Calificación */}
      <section className="card animate-fade-up p-5" style={{ animationDelay: "80ms" }}>
        <div className="label mb-3">Calificación</div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Dato label="Tipo de compra" valor={cal.tipoCompra === "VIVIENDA" ? "Vivienda" : "Inversión"} />
          <Dato label="Presupuesto" valor={usdShort(cal.presupuesto)} />
          <Dato
            label="Hipoteca"
            valor={cal.hipotecaPreAprobada ? "Pre-aprobada" : "Sin aprobar"}
            tono={cal.hipotecaPreAprobada ? "green" : undefined}
          />
          <Dato label="Urgencia" valor={cal.urgencia} tono={cal.urgencia === "ALTA" ? "red" : undefined} />
          {cal.hipotecaVenceEl && (
            <Dato label="Hipoteca vence" valor={fecha(cal.hipotecaVenceEl)} tono="red" />
          )}
          {cal.fechaMudanzaEst && <Dato label="Mudanza estimada" valor={fecha(cal.fechaMudanzaEst)} />}
        </dl>
      </section>

      {/* Contactos adicionales */}
      {p.contactos.length > 0 && (
        <section className="card animate-fade-up p-5" style={{ animationDelay: "120ms" }}>
          <div className="label mb-3">Contactos adicionales</div>
          <div className="space-y-2">
            {p.contactos.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-lg border border-border bg-bg/40 p-2.5">
                <Avatar nombre={c.nombre} size={32} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{c.nombre}</div>
                  <div className="text-xs text-ink-faint capitalize">{c.relacion.toLowerCase()}</div>
                </div>
                {c.telefono && <span className="ml-auto text-xs text-ink-muted">{c.telefono}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Unidades de interés */}
      <section className="card animate-fade-up p-5" style={{ animationDelay: "160ms" }}>
        <div className="label mb-3">Unidades de interés</div>
        <div className="space-y-2">
          {p.unidadesInteres.map((u) => (
            <div key={u.id} className="flex items-center gap-3 rounded-lg border border-border bg-bg/40 p-3">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-raised font-display text-sm font-bold">
                {u.numero}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">
                  Piso {u.piso} · {u.area} m² · vista {u.vista.toLowerCase()}
                </div>
                <div className="text-xs text-ink-faint capitalize">{u.estado.toLowerCase()}</div>
              </div>
              <span className="font-display text-sm font-bold tabular-nums">{usdShort(u.precio)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Acciones */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onGenerar}
          className="flex flex-col items-center gap-1.5 rounded-lg bg-gold px-2 py-3 text-xs font-semibold text-bg transition-transform hover:-translate-y-px"
        >
          <IconBolt width={16} height={16} />
          Mensaje IA
        </button>
        <button
          onClick={() => nav(`/cotizador?prospecto=${p.id}`)}
          className="flex flex-col items-center gap-1.5 rounded-lg border border-gold/50 bg-gold-soft px-2 py-3 text-xs font-semibold text-gold transition-colors hover:bg-gold/20"
        >
          <IconCotizador width={16} height={16} />
          Cotizar
        </button>
        <ActionBtn icon={<IconPlus width={15} height={15} />} label="Interacción" />
        <ActionBtn icon={<IconVisit width={15} height={15} />} label="Agendar visita" />
      </div>
    </div>
  );
}

function Dato({ label, valor, tono }: { label: string; valor: string; tono?: "green" | "red" }) {
  const hex = tono === "green" ? "#3EC898" : tono === "red" ? "#E86060" : undefined;
  return (
    <div>
      <dt className="text-2xs uppercase tracking-wide text-ink-faint">{label}</dt>
      <dd className="mt-0.5 truncate font-medium" style={{ color: hex }}>{valor}</dd>
    </div>
  );
}

function ActionBtn({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-surface px-2 py-3 text-xs font-medium text-ink-muted transition-colors hover:border-border-strong hover:text-ink">
      {icon}
      {label}
    </button>
  );
}

/* ------------------------------ Timeline derecha ------------------------------ */
function Timeline({ interacciones }: { interacciones: InteraccionItem[] }) {
  const [nota, setNota] = useState("");
  return (
    <section className="card flex h-full flex-col">
      <div className="border-b border-border px-5 py-4">
        <h2 className="font-display text-lg font-bold">Timeline de interacciones</h2>
        <p className="text-sm text-ink-muted">{interacciones.length} registradas · más reciente arriba</p>
      </div>

      {/* Nota rápida */}
      <div className="flex items-center gap-2 border-b border-border p-3">
        <input
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          placeholder="Agregar una nota rápida…"
          className="h-9 flex-1 rounded-lg border border-border bg-bg/50 px-3 text-sm placeholder:text-ink-faint focus:border-border-strong focus:outline-none"
        />
        <button
          disabled={!nota.trim()}
          onClick={() => setNota("")}
          className="rounded-lg bg-gold px-3 py-2 text-sm font-semibold text-bg disabled:opacity-40"
        >
          Guardar
        </button>
      </div>

      {/* Feed */}
      <div className="flex-1 space-y-1 overflow-y-auto p-4">
        {interacciones.map((it, i) => {
          const { Icon, hex } = CANAL[it.tipo];
          return (
            <article
              key={it.id}
              className="animate-fade-up flex gap-3"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Riel con ícono de canal */}
              <div className="flex flex-col items-center">
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
                  style={{ background: `${hex}1f`, color: hex }}
                >
                  <Icon width={15} height={15} />
                </span>
                {i < interacciones.length - 1 && <span className="my-1 w-px flex-1 bg-border" />}
              </div>

              <div
                className={`mb-3 min-w-0 flex-1 rounded-lg border p-3 ${
                  it.senalCierre ? "border-gold/40 bg-gold-soft" : "border-border bg-bg/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold capitalize text-ink">{it.tipo.toLowerCase()}</span>
                  {it.senalCierre && (
                    <span className="inline-flex items-center gap-1 rounded-pill bg-gold/20 px-1.5 py-0.5 text-2xs font-bold uppercase text-gold">
                      <IconBolt width={10} height={10} /> Señal de cierre
                    </span>
                  )}
                  <span className="ml-auto text-2xs text-ink-faint">{relativeTime(it.fecha)}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{it.resumen}</p>
                <div className="mt-1.5 text-2xs text-ink-faint">
                  {fecha(it.fecha)} · atendió {it.asesor}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
