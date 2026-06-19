// Páginas aún no construidas (Pipeline, Prospectos, Proyectos, Inventario,
// Alertas, Automatizaciones). El perfil 360°, inventario y generador IA vienen
// en la siguiente entrega.
export function Placeholder({ titulo }: { titulo: string }) {
  return (
    <div className="mx-auto max-w-[1600px] p-6">
      <div className="grid h-[60vh] place-items-center rounded-card border border-dashed border-border bg-surface">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-ink">{titulo}</h1>
          <p className="mt-1 text-sm text-ink-muted">Pantalla en construcción.</p>
        </div>
      </div>
    </div>
  );
}
