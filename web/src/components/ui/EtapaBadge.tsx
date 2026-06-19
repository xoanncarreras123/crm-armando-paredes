import type { EtapaPipeline } from "@/api/types";

// Etiqueta de etapa del pipeline con color por familia.
const META: Record<EtapaPipeline, { label: string; hex: string }> = {
  NUEVO: { label: "Nuevo", hex: "#9BA1AD" },
  CONTACTADO: { label: "Contactado", hex: "#9BA1AD" },
  CALIFICADO: { label: "Calificado", hex: "#5B8EF0" },
  VISITA_AGENDADA: { label: "Visita agendada", hex: "#5B8EF0" },
  PROPUESTA: { label: "Propuesta", hex: "#E8C547" },
  NEGOCIACION: { label: "Negociación", hex: "#E8C547" },
  RESERVA: { label: "Reserva", hex: "#3EC898" },
  CERRADO_GANADO: { label: "Ganado", hex: "#3EC898" },
  CERRADO_PERDIDO: { label: "Perdido", hex: "#E86060" },
};

export function EtapaBadge({ etapa }: { etapa: EtapaPipeline }) {
  const m = META[etapa];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-pill px-2 py-0.5 text-2xs font-semibold"
      style={{ color: m.hex, background: `${m.hex}1a` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.hex }} />
      {m.label}
    </span>
  );
}
