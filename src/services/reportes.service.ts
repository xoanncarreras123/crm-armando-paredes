import { prisma } from "../lib/prisma.js";

// ============================================================================
// REPORTES — métricas de gestión (lo consume el job de los lunes)
// ============================================================================

function hace(dias: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d;
}

/**
 * Reporte semanal por asesor: actividad y pipeline de los últimos 7 días.
 * Devuelve una fila por asesor activo.
 */
export async function reporteSemanalPorAsesor() {
  const desde = hace(7);
  const asesores = await prisma.asesor.findMany({
    where: { activo: true },
    select: { id: true, nombre: true, email: true },
  });

  const filas = await Promise.all(
    asesores.map(async (a) => {
      const [interacciones, oppsActivas, reservas, ventas, pipeline] = await Promise.all([
        prisma.interaccion.count({ where: { asesorId: a.id, fecha: { gte: desde } } }),
        prisma.oportunidad.count({
          where: { asesorId: a.id, etapa: { notIn: ["CERRADO_GANADO", "CERRADO_PERDIDO"] } },
        }),
        prisma.reserva.count({
          where: { oportunidad: { asesorId: a.id }, createdAt: { gte: desde } },
        }),
        prisma.venta.count({
          where: { reserva: { oportunidad: { asesorId: a.id } }, createdAt: { gte: desde } },
        }),
        prisma.oportunidad.aggregate({
          where: { asesorId: a.id, etapa: { notIn: ["CERRADO_GANADO", "CERRADO_PERDIDO"] } },
          _sum: { valorEstimado: true },
          _avg: { score: true },
        }),
      ]);

      return {
        asesor: a,
        semana: { desde: desde.toISOString(), interacciones, reservasNuevas: reservas, ventasNuevas: ventas },
        pipeline: {
          oportunidadesActivas: oppsActivas,
          valorEstimado: pipeline._sum.valorEstimado ?? 0,
          scorePromedio: Math.round(pipeline._avg.score ?? 0),
        },
      };
    }),
  );

  return { generadoEn: new Date().toISOString(), asesores: filas };
}
