import { prisma } from "../lib/prisma.js";

// ============================================================================
// ALERTAS — el sistema nervioso del CRM
// Tres familias: inactividad, deals en riesgo e hipotecas por vencer.
// Cada función devuelve filas listas para el dashboard / notificaciones.
// ============================================================================

const ETAPAS_MUERTAS = ["CERRADO_GANADO", "CERRADO_PERDIDO"] as const;

function hace(dias: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d;
}

function enDias(dias: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d;
}

/**
 * Oportunidades vivas sin actividad desde hace `dias`.
 * Se usa para los buckets de 14d y 30d.
 */
export async function inactividad(dias: number) {
  return prisma.oportunidad.findMany({
    where: {
      ultimaActividad: { lt: hace(dias) },
      etapa: { notIn: [...ETAPAS_MUERTAS] },
    },
    orderBy: { ultimaActividad: "asc" },
    select: {
      id: true,
      etapa: true,
      score: true,
      ultimaActividad: true,
      prospecto: { select: { id: true, nombre: true, telefono: true } },
      proyecto: { select: { nombre: true } },
      asesor: { select: { id: true, nombre: true, email: true } },
    },
  });
}

/**
 * Deals en riesgo: alto valor + etapa avanzada + estancados.
 * Lo que el gerente debe rescatar esta semana. Incluye el último evento de
 * score para entender por qué se enfrió.
 */
export async function dealsEnRiesgo(opts: { dias?: number; valorMinimo?: number } = {}) {
  const { dias = 21, valorMinimo = 300000 } = opts;
  return prisma.oportunidad.findMany({
    where: {
      etapa: { in: ["PROPUESTA", "NEGOCIACION", "RESERVA"] },
      valorEstimado: { gte: valorMinimo },
      ultimaActividad: { lt: hace(dias) },
    },
    orderBy: [{ valorEstimado: "desc" }, { ultimaActividad: "asc" }],
    select: {
      id: true,
      etapa: true,
      score: true,
      valorEstimado: true,
      ultimaActividad: true,
      prospecto: { select: { id: true, nombre: true, telefono: true } },
      proyecto: { select: { nombre: true, distrito: true } },
      asesor: { select: { id: true, nombre: true } },
      scoreEventos: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { accion: true, puntos: true, explicacion: true, createdAt: true },
      },
    },
  });
}

/**
 * Prospectos con hipoteca pre-aprobada que vence en los próximos `dias`.
 * Ventana de cierre cerrándose: prioridad alta.
 */
export async function hipotecasPorVencer(dias = 15) {
  return prisma.prospecto.findMany({
    where: {
      hipotecaPreAprobada: true,
      hipotecaVenceEl: { not: null, lte: enDias(dias), gte: new Date() },
    },
    orderBy: { hipotecaVenceEl: "asc" },
    select: {
      id: true,
      nombre: true,
      telefono: true,
      hipotecaVenceEl: true,
      oportunidades: {
        where: { etapa: { notIn: [...ETAPAS_MUERTAS] } },
        select: {
          id: true,
          etapa: true,
          score: true,
          proyecto: { select: { nombre: true } },
          asesor: { select: { id: true, nombre: true } },
        },
      },
    },
  });
}

/** Resumen consolidado para GET /alertas. */
export async function resumenAlertas() {
  const [inact14, inact30, enRiesgo, hipotecas] = await Promise.all([
    inactividad(14),
    inactividad(30),
    dealsEnRiesgo(),
    hipotecasPorVencer(15),
  ]);

  return {
    generadoEn: new Date().toISOString(),
    inactividad: {
      // 30d es subconjunto de 14d; lo separamos para el front.
      mas14dias: inact14.filter((o) => !inact30.find((x) => x.id === o.id)),
      mas30dias: inact30,
    },
    dealsEnRiesgo: enRiesgo,
    hipotecasPorVencer: hipotecas,
    totales: {
      inactividad14: inact14.length,
      inactividad30: inact30.length,
      enRiesgo: enRiesgo.length,
      hipotecasPorVencer: hipotecas.length,
    },
  };
}
