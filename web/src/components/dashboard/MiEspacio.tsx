import type { ReactNode } from "react";
import { useMoney } from "@/lib/prefs";
import { Avatar } from "@/components/ui/Avatar";
import { IconCalendar, IconCoin, IconMessage } from "@/components/ui/icons";

// "Mi espacio": widgets personales del asesor. Mock local; en prod vendrían
// de /agenda, /comisiones y /mensajes. Comisión en USD base (convierte con la moneda).

const AGENDA = [
  { hora: "10:30", evento: "Visita Gonzalo Ferreyros · 1201", donde: "Torre Basadre · Sala de ventas" },
  { hora: "14:00", evento: "Llamada Patricia Zegarra", donde: "Reactivación · Malecón 28" },
  { hora: "17:30", evento: "Comité semanal", donde: "Virtual · forecast del mes" },
];

const COMISION = { actual: 18_420, meta: 28_800 };

const MENSAJES = [
  { nombre: "Lucía Mendiola", preview: "Buenos días Camila, queríamos consultarte por la…", canal: "WSP" },
  { nombre: "Andrés Cáceres", preview: "Recibí la cotización, tengo unas dudas sobre el…", canal: "Mail" },
  { nombre: "Gonzalo Ferreyros", preview: "Confirmo la firma de separación para el jueves a…", canal: "WSP" },
];

export function MiEspacio() {
  const money = useMoney();
  const pctMeta = Math.round((COMISION.actual / COMISION.meta) * 100);

  return (
    <section>
      <div className="mb-3">
        <h2 className="font-display text-xl font-bold">Mi espacio</h2>
        <p className="text-sm text-ink-muted">Tu día, tus comisiones y lo que está esperando respuesta</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Agenda */}
        <article className="card animate-fade-up p-5">
          <Header icon={<IconCalendar width={14} height={14} />} title="Agenda · hoy" />
          <div className="mt-1">
            {AGENDA.map((a, i) => (
              <div key={i} className="flex gap-3 border-b border-border py-2.5 last:border-0">
                <span className="font-display text-xs font-bold text-gold tabular-nums">{a.hora}</span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-ink">{a.evento}</div>
                  <div className="truncate text-xs text-ink-faint">{a.donde}</div>
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* Comisión proyectada */}
        <article className="card animate-fade-up p-5" style={{ animationDelay: "60ms" }}>
          <Header icon={<IconCoin width={14} height={14} />} title="Comisión proyectada · mes" />
          <div className="mt-2 font-display text-2xl font-extrabold tabular-nums">{money.short(COMISION.actual)}</div>
          <div className="mt-3 h-2 overflow-hidden rounded-pill bg-raised">
            <div
              className="h-full rounded-pill"
              style={{ width: `${pctMeta}%`, background: "linear-gradient(90deg, #6FB8A8, #D4A574)" }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-2xs text-ink-faint tabular-nums">
            <span>{pctMeta}% de meta</span>
            <span>Meta: {money.short(COMISION.meta)}</span>
          </div>
          <p className="mt-3 text-xs text-ink-muted">
            Cierra <b className="text-green">2 deals</b> en negociación para llegar a la meta.
          </p>
        </article>

        {/* Mensajes pendientes */}
        <article className="card animate-fade-up p-5" style={{ animationDelay: "120ms" }}>
          <Header icon={<IconMessage width={14} height={14} />} title="Mensajes pendientes" />
          <div className="mt-1">
            {MENSAJES.map((m, i) => (
              <div key={i} className="flex items-center gap-2.5 border-b border-border py-2.5 last:border-0">
                <Avatar nombre={m.nombre} size={28} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold text-ink">{m.nombre}</div>
                  <div className="truncate text-xs text-ink-faint">{m.preview}</div>
                </div>
                <span className="shrink-0 text-2xs font-semibold uppercase tracking-normal text-ink-faint">{m.canal}</span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

const Header = ({ icon, title }: { icon: ReactNode; title: string }) => (
  <div className="flex items-center gap-2 text-ink-muted">
    <span className="text-gold">{icon}</span>
    <span className="text-2xs font-semibold uppercase tracking-normal text-ink-faint">{title}</span>
  </div>
);
