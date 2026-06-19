import type { EtapaPipeline } from "@/api/types";

// Etiqueta de etapa del pipeline con color por familia.
const META: Record<EtapaPipeline, { label: string; hex: string }> = {
  NUEVO: { label: "Nuevo", hex: "#9CA0A8" },
  CONTACTADO: { label: "Contactado", hex: "#9CA0A8" },
  CALIFICADO: { label: "Calificado", hex: "#7C9CC6" },
  VISITA_AGENDADA: { label: "Visita agendada", hex: "#7C9CC6" },
  PROPUESTA: { label: "Propuesta", hex: "#D4A574" },
  NEGOCIACION: { label: "Negociación", hex: "#D4A574" },
  RESERVA: { label: "Reserva", hex: "#6FB8A8" },
  CERRADO_GANADO: { label: "Ganado", hex: "#6FB8A8" },
  CERRADO_PERDIDO: { label: "Perdido", hex: "#E07856" },
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
