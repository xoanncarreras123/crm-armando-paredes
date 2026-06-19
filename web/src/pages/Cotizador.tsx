import { useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { useProspecto, useProspectos, useUnidades } from "@/api/hooks";
import type { Unidad } from "@/api/types";
import { EtapaBadge } from "@/components/ui/EtapaBadge";
import { IconBolt, IconCopy, IconCotizador, IconWhatsapp } from "@/components/ui/icons";
import { useMoney } from "@/lib/prefs";
import { PARAMS_DEFAULT, type ParamsFinanciamiento } from "@/lib/cotizador";
import { generarCotizacionIA, resumenTexto, type Cotizacion } from "@/lib/cotizadorIA";
import { descargarCotizacionPDF } from "@/lib/cotizacionPdf";

const INICIAL_PCT = [0.1, 0.15, 0.2, 0.3];
const PLAZOS = [5, 10, 15, 20];

export function Cotizador() {
  const { data: lista } = useProspectos();
  const [searchParams] = useSearchParams();
  const [prospectoId, setProspectoId] = useState(searchParams.get("prospecto") ?? "p1");
  const { data: prospecto } = useProspecto(prospectoId);
  const { data: unidades } = useUnidades(prospecto?.proyecto.id ?? "");

  const [params, setParams] = useState<ParamsFinanciamiento>(PARAMS_DEFAULT);
  const [loading, setLoading] = useState(false);
  const [cot, setCot] = useState<Cotizacion | null>(null);
  const [vacio, setVacio] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const money = useMoney();

  async function generar() {
    if (!prospecto || !unidades) return;
    setLoading(true);
    setCot(null);
    setVacio(false);
    const c = await generarCotizacionIA({
      nombre: prospecto.nombre,
      presupuesto: prospecto.calificacion.presupuesto,
      tipoCompra: prospecto.calificacion.tipoCompra,
      hipotecaPreAprobada: prospecto.calificacion.hipotecaPreAprobada,
      urgencia: prospecto.calificacion.urgencia,
      proyecto: prospecto.proyecto.nombre,
      unidades,
      params,
    });
    setLoading(false);
    if (c) setCot(c);
    else setVacio(true);
  }

  function copiar() {
    if (!cot || !prospecto) return;
    navigator.clipboard?.writeText(resumenTexto(cot, prospecto.proyecto.nombre));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  }

  async function descargarPdf() {
    if (!cot || !prospecto) return;
    await descargarCotizacionPDF(cot, {
      nombre: prospecto.nombre,
      telefono: prospecto.telefono,
      proyecto: prospecto.proyecto.nombre,
      distrito: prospecto.proyecto.distrito,
      asesor: prospecto.asesor.nombre,
    });
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 p-6">
      <header className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold-soft text-gold">
          <IconCotizador width={18} height={18} />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold">Cotizador IA</h1>
          <p className="text-sm text-ink-muted">
            Lee el perfil del prospecto y el inventario en vivo, y arma la cotización al instante
          </p>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Configuración */}
        <section className="card h-fit space-y-5 p-5">
          <div>
            <div className="label mb-2">Prospecto</div>
            <select
              value={prospectoId}
              onChange={(e) => {
                setProspectoId(e.target.value);
                setCot(null);
                setVacio(false);
              }}
              className="w-full rounded-lg border border-border bg-bg/50 px-3 py-2 text-sm text-ink focus:border-border-strong focus:outline-none"
            >
              {(lista ?? []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} · {p.proyecto}
                </option>
              ))}
            </select>
          </div>

          {/* Lo que la IA "lee" del CRM */}
          {prospecto && (
            <div className="space-y-2 rounded-lg border border-border bg-bg/40 p-3 text-sm">
              <div className="label mb-1">Contexto leído</div>
              <Row k="Etapa" v={<EtapaBadge etapa={prospecto.etapa} />} />
              <Row k="Tipo de compra" v={prospecto.calificacion.tipoCompra === "VIVIENDA" ? "Vivienda" : "Inversión"} />
              <Row k="Presupuesto" v={money.short(prospecto.calificacion.presupuesto)} />
              <Row
                k="Hipoteca"
                v={prospecto.calificacion.hipotecaPreAprobada ? "Pre-aprobada" : "Sin aprobar"}
              />
              <Row k="Urgencia" v={prospecto.calificacion.urgencia} />
            </div>
          )}

          {/* Parámetros de financiamiento */}
          <div>
            <div className="label mb-2">Cuota inicial</div>
            <div className="flex gap-1.5">
              {INICIAL_PCT.map((v) => (
                <Chip key={v} active={params.cuotaInicialPct === v} onClick={() => setParams((p) => ({ ...p, cuotaInicialPct: v }))}>
                  {Math.round(v * 100)}%
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <div className="label mb-2">Plazo</div>
            <div className="flex gap-1.5">
              {PLAZOS.map((v) => (
                <Chip key={v} active={params.plazoAnios === v} onClick={() => setParams((p) => ({ ...p, plazoAnios: v }))}>
                  {v} años
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <div className="label mb-2">TCEA anual (%)</div>
            <input
              type="number"
              step={0.1}
              value={params.tceaPct}
              onChange={(e) => setParams((p) => ({ ...p, tceaPct: Number(e.target.value) }))}
              className="w-28 rounded-lg border border-border bg-bg/50 px-3 py-2 text-sm tabular-nums focus:border-border-strong focus:outline-none"
            />
          </div>

          <button
            onClick={generar}
            disabled={loading || !prospecto}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-bg transition-transform hover:-translate-y-px disabled:opacity-60"
          >
            <IconBolt width={16} height={16} />
            {loading ? "Cotizando…" : "Generar cotización con IA"}
          </button>
        </section>

        {/* Resultado */}
        <section className="lg:col-span-2">
          {loading && <ResultadoSkeleton />}
          {vacio && !loading && (
            <div className="card grid h-64 place-items-center p-6 text-center text-sm text-ink-faint">
              No hay unidades disponibles que calcen en este proyecto.
            </div>
          )}
          {!loading && !vacio && !cot && (
            <div className="card grid h-64 place-items-center p-6 text-center text-sm text-ink-faint">
              Configura los parámetros y genera una cotización instantánea.
            </div>
          )}
          {cot && prospecto && !loading && (
            <Resultado
              cot={cot}
              proyecto={prospecto.proyecto.nombre}
              telefono={prospecto.telefono}
              onCopiar={copiar}
              onPdf={descargarPdf}
              copiado={copiado}
            />
          )}
        </section>
      </div>
    </div>
  );
}

/* ------------------------------- Resultado ------------------------------- */
function Resultado({
  cot,
  proyecto,
  telefono,
  onCopiar,
  onPdf,
  copiado,
}: {
  cot: Cotizacion;
  proyecto: string;
  telefono: string;
  onCopiar: () => void;
  onPdf: () => void;
  copiado: boolean;
}) {
  const f = cot.finanzas;
  const money = useMoney();
  return (
    <div className="animate-fade-up space-y-4">
      {/* Unidad recomendada + rationale */}
      <div className="card p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="label mb-1">Unidad recomendada por IA</div>
            <div className="font-display text-2xl font-extrabold">
              {cot.unidad.numero}
              <span className="ml-2 text-base font-medium text-ink-muted">
                Piso {cot.unidad.piso} · {cot.unidad.area} m² · {cot.unidad.dormitorios} dorm · vista{" "}
                {cot.unidad.vista.toLowerCase()}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-2xl font-extrabold text-gold">{money.short(f.precio)}</div>
            <div className="text-2xs text-ink-faint">precio de lista</div>
          </div>
        </div>
        <div className="mt-4 flex gap-2.5 rounded-lg border-l-2 border-gold bg-gold-soft p-3">
          <IconBolt className="mt-px shrink-0 text-gold" width={14} height={14} />
          <p className="text-sm leading-relaxed text-ink">{cot.rationale}</p>
        </div>
      </div>

      {/* Desglose financiero */}
      <div className="card p-5">
        <div className="label mb-3">Plan de pago</div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Cifra label="Separación" valor={money.short(f.separacion)} />
          <Cifra label={`Cuota inicial · ${Math.round(f.cuotaInicialPct * 100)}%`} valor={money.short(f.cuotaInicial)} />
          <Cifra label="A financiar" valor={money.short(f.montoFinanciar)} />
          <Cifra label="Cuota mensual" valor={money.short(f.cuotaMensual)} destacar />
        </div>

        {/* Cronograma */}
        <div className="mt-5 space-y-2">
          {[
            { t: "Separación", m: money.short(f.separacion), c: "Hoy · reserva la unidad" },
            { t: "Cuota inicial (resto)", m: money.short(f.cuotaInicial - f.separacion), c: "A la firma de minuta" },
            { t: `${f.meses} cuotas mensuales`, m: `${money.short(f.cuotaMensual)}/mes`, c: `${f.meses / 12} años · TCEA ${f.tceaPct}%` },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-bg/40 p-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-raised font-display text-xs font-bold text-ink-muted">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{s.t}</div>
                <div className="text-xs text-ink-faint">{s.c}</div>
              </div>
              <span className="font-display text-sm font-bold tabular-nums">{s.m}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notas IA */}
      {cot.notas.length > 0 && (
        <div className="card p-5">
          <div className="label mb-2">Notas</div>
          <ul className="space-y-1.5">
            {cot.notas.map((n, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink-muted">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                {n}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Alternativas */}
      {cot.alternativas.length > 0 && (
        <div className="card p-5">
          <div className="label mb-3">Alternativas</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {cot.alternativas.map((u) => (
              <Alt key={u.id} u={u} />
            ))}
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-3">
        <button
          onClick={onCopiar}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-raised"
        >
          <IconCopy width={15} height={15} />
          {copiado ? "¡Copiado!" : "Copiar resumen"}
        </button>
        <button
          onClick={onPdf}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-raised"
        >
          <IconCotizador width={15} height={15} />
          Descargar PDF
        </button>
        <a
          href={`https://wa.me/${telefono.replace(/\D/g, "")}?text=${encodeURIComponent(resumenTexto(cot, proyecto))}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-green px-4 py-2 text-sm font-semibold text-bg transition-transform hover:-translate-y-px"
        >
          <IconWhatsapp width={16} height={16} />
          Enviar por WhatsApp
        </a>
      </div>
    </div>
  );
}

const Row = ({ k, v }: { k: string; v: ReactNode }) => (
  <div className="flex items-center justify-between">
    <span className="text-ink-faint">{k}</span>
    <span className="font-medium text-ink">{v}</span>
  </div>
);

function Cifra({ label, valor, destacar }: { label: string; valor: string; destacar?: boolean }) {
  return (
    <div>
      <div className="text-2xs uppercase tracking-wide text-ink-faint">{label}</div>
      <div className={`mt-0.5 font-display font-bold tabular-nums ${destacar ? "text-xl text-gold" : "text-base text-ink"}`}>
        {valor}
      </div>
    </div>
  );
}

const Alt = ({ u }: { u: Unidad }) => {
  const money = useMoney();
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-bg/40 p-3">
      <div className="grid h-9 w-9 place-items-center rounded-md bg-raised font-display text-sm font-bold">{u.numero}</div>
      <div className="min-w-0 flex-1 text-sm">
        <div className="font-medium">{u.dormitorios} dorm · {u.area} m²</div>
        <div className="text-xs text-ink-faint capitalize">vista {u.vista.toLowerCase()}</div>
      </div>
      <span className="font-display text-sm font-bold tabular-nums">{money.short(u.precio)}</span>
    </div>
  );
};

const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) => (
  <button
    onClick={onClick}
    className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
      active ? "bg-gold text-bg" : "border border-border bg-surface text-ink-muted hover:text-ink"
    }`}
  >
    {children}
  </button>
);

const ResultadoSkeleton = () => (
  <div className="space-y-4">
    <div className="skeleton h-32 rounded-card" />
    <div className="skeleton h-44 rounded-card" />
  </div>
);
