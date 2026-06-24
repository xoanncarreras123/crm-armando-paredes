"use client";
import { useParams, useRouter } from "next/navigation";
import { useProspecto } from "@/application/prospectos/useProspectos";
import { useMoney } from "@/presentation/providers/PrefsProvider";
import { ScoreBadge } from "@/presentation/components/ui/ScoreBadge";
import { EtapaBadge } from "@/presentation/components/ui/EtapaBadge";

export default function ProspectoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { prospecto, loading } = useProspecto(id);
  const money = useMoney();

  if (loading) {
    return (
      <div className="mx-auto max-w-[1100px] space-y-5 p-6">
        <div className="skeleton h-8 w-48 rounded" />
        <div className="skeleton h-64 rounded-card" />
        <div className="skeleton h-48 rounded-card" />
      </div>
    );
  }

  if (!prospecto) {
    return (
      <div className="mx-auto max-w-[1100px] p-6 text-center text-sm text-ink-faint">
        Prospecto no encontrado.
        <button onClick={() => router.back()} className="ml-2 underline">Volver</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-5 p-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-sm text-ink-faint hover:text-ink"
        >
          ← Volver
        </button>
        <h1 className="font-display text-2xl font-bold">{prospecto.nombre}</h1>
        <EtapaBadge etapa={prospecto.etapa} />
        <ScoreBadge score={prospecto.score} size="lg" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Info principal */}
        <section className="card space-y-4 p-5 lg:col-span-2">
          <h2 className="font-display text-lg font-bold">Calificación</h2>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="label">Tipo de compra</dt>
              <dd className="mt-0.5 font-medium">{prospecto.calificacion.tipoCompra === "VIVIENDA" ? "Vivienda" : "Inversión"}</dd>
            </div>
            <div>
              <dt className="label">Presupuesto</dt>
              <dd className="mt-0.5 font-medium">{money.short(prospecto.calificacion.presupuesto)}</dd>
            </div>
            <div>
              <dt className="label">Hipoteca</dt>
              <dd className="mt-0.5 font-medium">{prospecto.calificacion.hipotecaPreAprobada ? "Pre-aprobada" : "Sin aprobar"}</dd>
            </div>
            <div>
              <dt className="label">Urgencia</dt>
              <dd className="mt-0.5 font-medium">{prospecto.calificacion.urgencia}</dd>
            </div>
          </dl>

          <h2 className="font-display text-lg font-bold pt-2">Interacciones</h2>
          <div className="space-y-2">
            {prospecto.interacciones.map((it) => (
              <div key={it.id} className="flex gap-3 rounded-lg border border-border p-3 text-sm">
                <span className="shrink-0 text-xs text-ink-faint">{it.fecha}</span>
                <div className="min-w-0">
                  <span className="font-medium">{it.tipo}</span>
                  {it.resumen && <p className="mt-0.5 text-ink-muted">{it.resumen}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sidebar info */}
        <section className="space-y-4">
          <div className="card p-5">
            <h2 className="font-display text-base font-bold mb-3">Contacto</h2>
            <dl className="space-y-2 text-sm">
              <div><dt className="label">Teléfono</dt><dd>{prospecto.telefono}</dd></div>
              <div><dt className="label">Email</dt><dd className="truncate">{prospecto.email}</dd></div>
              <div><dt className="label">Fuente</dt><dd>{prospecto.fuente}</dd></div>
            </dl>
          </div>
          <div className="card p-5">
            <h2 className="font-display text-base font-bold mb-3">Proyecto</h2>
            <dl className="space-y-2 text-sm">
              <div><dt className="label">Nombre</dt><dd>{prospecto.proyecto.nombre}</dd></div>
              <div><dt className="label">Distrito</dt><dd>{prospecto.proyecto.distrito}</dd></div>
              <div><dt className="label">Asesor</dt><dd>{prospecto.asesor.nombre}</dd></div>
            </dl>
          </div>
        </section>
      </div>
    </div>
  );
}
