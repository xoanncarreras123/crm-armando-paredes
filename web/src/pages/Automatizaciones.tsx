import { IconAuto, IconBolt, IconClock, IconWhatsapp } from "@/components/ui/icons";

// Estado de los flujos n8n + jobs (el agente "Sofía", nurturing y scoring).
type Flujo = {
  nombre: string;
  desc: string;
  activo: boolean;
  cadencia: string;
  ultimaCorrida: string;
  metrica: string;
  Icon: typeof IconBolt;
  color: string;
};

const FLUJOS: Flujo[] = [
  {
    nombre: "Agente WhatsApp · Sofía",
    desc: "Califica, responde y escala leads entrantes en tiempo real.",
    activo: true,
    cadencia: "Tiempo real",
    ultimaCorrida: "hace 6 min",
    metrica: "42 mensajes hoy · 3 escalados",
    Icon: IconWhatsapp,
    color: "#6FB8A8",
  },
  {
    nombre: "Nurturing automatizado",
    desc: "Secuencia Día 7 / 14 / 21 / 30 para prospectos sin respuesta.",
    activo: true,
    cadencia: "Diario · 9:00 a.m.",
    ultimaCorrida: "hoy 9:00 a.m.",
    metrica: "18 mensajes enviados esta semana",
    Icon: IconClock,
    color: "#7C9CC6",
  },
  {
    nombre: "Detección de inactividad",
    desc: "Penaliza score de deals sin actividad (14d / 30d).",
    activo: true,
    cadencia: "Diario · 8:00 a.m.",
    ultimaCorrida: "hoy 8:00 a.m.",
    metrica: "2 deals penalizados hoy",
    Icon: IconBolt,
    color: "#D4A574",
  },
  {
    nombre: "Reporte semanal por asesor",
    desc: "Resumen de pipeline y actividad enviado a la gerencia.",
    activo: false,
    cadencia: "Lunes · 8:10 a.m.",
    ultimaCorrida: "hace 4 días",
    metrica: "Pausado",
    Icon: IconAuto,
    color: "#9CA0A8",
  },
];

export function Automatizaciones() {
  return (
    <div className="mx-auto max-w-[1100px] space-y-5 p-6">
      <header>
        <h1 className="font-display text-2xl font-bold">Automatizaciones</h1>
        <p className="text-sm text-ink-muted">Flujos n8n + jobs conectados al CRM</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {FLUJOS.map((f, i) => (
          <article
            key={f.nombre}
            className="card animate-fade-up p-5"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-start gap-3">
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg"
                style={{ background: `${f.color}1f`, color: f.color }}
              >
                <f.Icon width={18} height={18} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-base font-bold">{f.nombre}</h2>
                  <span
                    className={`ml-auto inline-flex items-center gap-1.5 rounded-pill px-2 py-0.5 text-2xs font-semibold ${
                      f.activo ? "bg-green-soft text-green" : "bg-raised text-ink-faint"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${f.activo ? "bg-green" : "bg-ink-faint"}`} />
                    {f.activo ? "Activo" : "Pausado"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-muted">{f.desc}</p>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3 text-sm">
              <div>
                <dt className="text-2xs uppercase tracking-wide text-ink-faint">Cadencia</dt>
                <dd className="mt-0.5 font-medium">{f.cadencia}</dd>
              </div>
              <div>
                <dt className="text-2xs uppercase tracking-wide text-ink-faint">Última corrida</dt>
                <dd className="mt-0.5 font-medium">{f.ultimaCorrida}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-2xs uppercase tracking-wide text-ink-faint">Actividad</dt>
                <dd className="mt-0.5 font-medium" style={{ color: f.activo ? f.color : undefined }}>
                  {f.metrica}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
