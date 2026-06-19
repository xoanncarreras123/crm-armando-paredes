import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ============================================================================
// Las 5 queries centrales del CRM
// ============================================================================

/**
 * 1) PIPELINE POR ETAPA
 * Tablero comercial: cuántas oportunidades y qué valor hay en cada etapa.
 * Útil para el dashboard del gerente y para el forecast de ventas.
 */
export async function pipelinePorEtapa(proyectoId?: string) {
  return prisma.oportunidad.groupBy({
    by: ["etapa"],
    where: {
      ...(proyectoId ? { proyectoId } : {}),
      etapa: { notIn: ["CERRADO_GANADO", "CERRADO_PERDIDO"] }, // solo deals vivos
    },
    _count: { _all: true },
    _sum: { valorEstimado: true },
    orderBy: { etapa: "asc" },
  });
}

/**
 * 2) PROSPECTOS POR SCORE
 * Cola priorizada para los asesores: los deals más calientes primero.
 * Trae el prospecto, su proyecto y la última actividad.
 */
export async function prospectosPorScore(scoreMinimo = 50, limit = 20) {
  return prisma.oportunidad.findMany({
    where: {
      score: { gte: scoreMinimo },
      etapa: { notIn: ["CERRADO_GANADO", "CERRADO_PERDIDO"] },
    },
    orderBy: [{ score: "desc" }, { ultimaActividad: "desc" }],
    take: limit,
    select: {
      id: true,
      etapa: true,
      score: true,
      ultimaActividad: true,
      prospecto: { select: { nombre: true, telefono: true, tipoCompra: true } },
      proyecto: { select: { nombre: true, distrito: true } },
      asesor: { select: { nombre: true } },
    },
  });
}

/**
 * 3) UNIDADES DISPONIBLES POR PROYECTO
 * Inventario vendible, ordenado por precio. Base del catálogo y matching.
 */
export async function unidadesDisponibles(proyectoId: string) {
  return prisma.unidad.findMany({
    where: { proyectoId, estado: "DISPONIBLE" },
    orderBy: { precio: "asc" },
    select: {
      id: true,
      numero: true,
      piso: true,
      area: true,
      dormitorios: true,
      precio: true,
      vista: true,
      tieneTerraza: true,
      estacionamientos: true,
    },
  });
}

/**
 * 4) ALERTAS DE INACTIVIDAD
 * Deals vivos sin ninguna actividad en los últimos N días → requieren follow-up.
 * Se apoya en el índice de `ultimaActividad`.
 */
export async function alertasInactividad(dias = 14) {
  const corte = new Date();
  corte.setDate(corte.getDate() - dias);

  return prisma.oportunidad.findMany({
    where: {
      ultimaActividad: { lt: corte },
      etapa: { notIn: ["CERRADO_GANADO", "CERRADO_PERDIDO"] },
    },
    orderBy: { ultimaActividad: "asc" }, // los más abandonados primero
    select: {
      id: true,
      etapa: true,
      score: true,
      ultimaActividad: true,
      prospecto: { select: { nombre: true, telefono: true } },
      proyecto: { select: { nombre: true } },
      asesor: { select: { nombre: true, email: true } },
    },
  });
}

/**
 * 5) DEALS EN RIESGO
 * Oportunidades de alto valor, etapa avanzada, pero estancadas (sin actividad
 * en >dias) o con score cayendo. Lo que el gerente debe rescatar esta semana.
 */
export async function dealsEnRiesgo(dias = 21, valorMinimo = 300000) {
  const corte = new Date();
  corte.setDate(corte.getDate() - dias);

  return prisma.oportunidad.findMany({
    where: {
      etapa: { in: ["PROPUESTA", "NEGOCIACION", "RESERVA"] }, // ya hubo inversión comercial
      valorEstimado: { gte: valorMinimo },
      ultimaActividad: { lt: corte },
    },
    orderBy: [{ valorEstimado: "desc" }, { ultimaActividad: "asc" }],
    select: {
      id: true,
      etapa: true,
      score: true,
      valorEstimado: true,
      ultimaActividad: true,
      prospecto: { select: { nombre: true, telefono: true } },
      proyecto: { select: { nombre: true, distrito: true } },
      asesor: { select: { nombre: true } },
      // último evento de score para entender por qué se enfrió
      scoreEventos: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { accion: true, puntos: true, explicacion: true, createdAt: true },
      },
    },
  });
}

// Demo rápida (ejecuta con: tsx src/queries.ts)
if (process.argv[1]?.includes("queries")) {
  (async () => {
    console.dir(await pipelinePorEtapa(), { depth: null });
    console.dir(await prospectosPorScore(), { depth: null });
    await prisma.$disconnect();
  })();
}
