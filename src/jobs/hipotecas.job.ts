import { prisma } from "../lib/prisma.js";
import { aplicarEventoIdempotente } from "../services/score.service.js";

// ============================================================================
// JOB: hipotecas pre-aprobadas por vencer (<15 días).
// Corre cada día 8am. Penaliza (-20) cada oportunidad viva del prospecto.
// ============================================================================

function enDias(dias: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d;
}

export async function detectarHipotecasPorVencer() {
  const prospectos = await prisma.prospecto.findMany({
    where: {
      hipotecaPreAprobada: true,
      hipotecaVenceEl: { not: null, gte: new Date(), lte: enDias(15) },
    },
    select: {
      id: true,
      hipotecaVenceEl: true,
      oportunidades: {
        where: { etapa: { notIn: ["CERRADO_GANADO", "CERRADO_PERDIDO"] } },
        select: { id: true },
      },
    },
  });

  let aplicados = 0;
  for (const p of prospectos) {
    const dias = p.hipotecaVenceEl
      ? Math.max(0, Math.ceil((p.hipotecaVenceEl.getTime() - Date.now()) / 86_400_000))
      : undefined;
    for (const o of p.oportunidades) {
      const r = await aplicarEventoIdempotente({
        oportunidadId: o.id,
        regla: "HIPOTECA_POR_VENCER",
        contexto: { dias },
      });
      if (r) aplicados++;
    }
  }

  console.log(`[job:hipotecas] prospectos=${prospectos.length} penalizadas=${aplicados}`);
  return { prospectos: prospectos.length, penalizadas: aplicados };
}
