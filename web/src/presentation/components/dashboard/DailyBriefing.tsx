"use client";
import { IconBolt } from "@/presentation/components/ui/icons";

const MOCK = {
  saludo: "Buenos días, Camila",
  resumen: "Tienes 3 señales de cierre pendientes y 1 separación que vence este jueves. Rodrigo tiene 2 visitas confirmadas para hoy.",
  prioridades: [
    { titulo: "Cerrar con Andrés Cáceres", razon: "Preguntó por escrituras — señal de compra" },
    { titulo: "Renovar separación de Gonzalo", razon: "La hipoteca vence el jueves" },
    { titulo: "Reactivar a Patricia Zegarra", razon: "30 días sin actividad en deal de US$540K" },
  ],
};

export function DailyBriefing() {
  const data = MOCK;
  const isLoading = false;

  return (
    <section className="animate-fade-up overflow-hidden rounded-card border border-border bg-surface">
      <div className="flex flex-col gap-6 border-l-2 border-gold p-6 md:flex-row md:p-7">
        {/* Resumen */}
        <div className="md:w-[46%]">
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center rounded bg-gold-soft text-gold">
              <IconBolt width={13} height={13} />
            </span>
            <span className="label">Briefing del día · generado por IA</span>
          </div>

          {isLoading ? (
            <BriefingSkeleton />
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold text-ink">{data!.saludo}</h1>
              <p className="mt-2 text-base text-ink-muted">{data!.resumen}</p>
            </>
          )}
        </div>

        {/* Prioridades */}
        <div className="flex-1 md:border-l md:border-border md:pl-7">
          <div className="label mb-3">Tus 3 prioridades</div>
          <ol className="flex flex-col gap-2.5">
            {(isLoading ? Array.from({ length: 3 }) : data!.prioridades).map((p, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-lg border border-border bg-bg/40 p-3 card-hover"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-gold-soft font-display text-sm font-bold text-gold">
                  {i + 1}
                </span>
                {isLoading ? (
                  <div className="flex-1 space-y-2 py-0.5">
                    <div className="skeleton h-3.5 w-3/4 rounded" />
                    <div className="skeleton h-3 w-full rounded" />
                  </div>
                ) : (
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-ink">
                      {(p as { titulo: string }).titulo}
                    </div>
                    <div className="text-sm text-ink-muted">
                      {(p as { razon: string }).razon}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export { DailyBriefing as DailyBriefingCard };

function BriefingSkeleton() {
  return (
    <div className="space-y-3">
      <div className="skeleton h-7 w-48 rounded" />
      <div className="space-y-2">
        <div className="skeleton h-3.5 w-full rounded" />
        <div className="skeleton h-3.5 w-11/12 rounded" />
        <div className="skeleton h-3.5 w-2/3 rounded" />
      </div>
    </div>
  );
}

