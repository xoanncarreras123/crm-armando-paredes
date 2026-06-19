import { prisma } from "../lib/prisma.js";
import { aplicarEventoIdempotente } from "../services/score.service.js";

// ============================================================================
// JOB: detectar inactividad y penalizar el score.
// Corre cada día 8am. Idempotente: no penaliza el mismo deal dos veces
// mientras siga inactivo (la penalización no refresca ultimaActividad).
// ============================================================================

function hace(dias: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d;
}

export async function detectarInactividad() {
  const muertas = ["CERRADO_GANADO", "CERRADO_PERDIDO"] as const;

  // >30 días: penalización fuerte (-15). Prevalece sobre la de 14d.
  const inact30 = await prisma.oportunidad.findMany({
    where: { etapa: { notIn: [...muertas] }, ultimaActividad: { lt: hace(30) } },
    select: { id: true },
  });
  // 14–30 días: penalización leve (-10).
  const inact14 = await prisma.oportunidad.findMany({
    where: {
      etapa: { notIn: [...muertas] },
      ultimaActividad: { lt: hace(14), gte: hace(30) },
    },
    select: { id: true },
  });

  let aplicados = 0;
  for (const o of inact30) {
    const r = await aplicarEventoIdempotente({ oportunidadId: o.id, regla: "SIN_RESPUESTA_30D", contexto: { dias: 30 } });
    if (r) aplicados++;
  }
  for (const o of inact14) {
    const r = await aplicarEventoIdempotente({ oportunidadId: o.id, regla: "SIN_RESPUESTA_14D", contexto: { dias: 14 } });
    if (r) aplicados++;
  }

  console.log(`[job:inactividad] revisadas=${inact30.length + inact14.length} penalizadas=${aplicados}`);
  return { revisadas: inact30.length + inact14.length, penalizadas: aplicados };
}
