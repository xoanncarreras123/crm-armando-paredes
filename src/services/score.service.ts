import { Prisma, type TipoInteraccion } from "@prisma/client";
import { prisma, type Db } from "../lib/prisma.js";
import { NotFound } from "../lib/errors.js";

// ============================================================================
// SCORE ENGINE — el corazón del CRM
// Score normalizado a [0, 100]. Cada cambio se persiste en ScoreEvento con
// una explicación en lenguaje natural, de forma atómica con el update del score.
// ============================================================================

const SCORE_MIN = 0;
const SCORE_MAX = 100;
const clamp = (n: number) => Math.max(SCORE_MIN, Math.min(SCORE_MAX, n));

// --- Catálogo de reglas (puntos exactos del negocio) ---
type ContextoRegla = {
  dias?: number;
  detalle?: string;
  montoAnterior?: number;
  montoNuevo?: number;
};

type Regla = { puntos: number; etiqueta: string; explicar: (c: ContextoRegla) => string };

export const REGLAS_SCORE = {
  ABRIO_BROCHURE: {
    puntos: 5,
    etiqueta: "Abrió brochure PDF",
    explicar: () => "Abrió el brochure enviado: engagement inicial con el material.",
  },
  RESPUESTA_RAPIDA: {
    puntos: 8,
    etiqueta: "Respondió en menos de 1 hora",
    explicar: () => "Respondió en menos de 1 hora: alta disposición y atención al deal.",
  },
  PIDIO_FINANCIAMIENTO: {
    puntos: 10,
    etiqueta: "Pidió información de financiamiento",
    explicar: () => "Solicitó información de financiamiento: evalúa cómo pagar, intención real.",
  },
  PREGUNTO_PAGO_ESCRITURA: {
    puntos: 15,
    etiqueta: "Preguntó por formas de pago / escrituras",
    explicar: () =>
      "Preguntó por formas de pago o escrituras: señales de etapa avanzada de decisión.",
  },
  PRIMERA_VISITA: {
    puntos: 20,
    etiqueta: "Visitó el proyecto (1ra vez)",
    explicar: () => "Realizó su primera visita presencial: hito clave del embudo.",
  },
  SEGUNDA_VISITA: {
    puntos: 15,
    etiqueta: "Segunda visita",
    explicar: () => "Volvió a visitar: madura la decisión, involucra a más personas.",
  },
  CODECISOR_CONTACTO: {
    puntos: 25,
    etiqueta: "Cónyuge/familiar también contactó",
    explicar: (c) =>
      `Un co-decisor${c.detalle ? ` (${c.detalle})` : ""} también se contactó: compra consensuada.`,
  },
  HIPOTECA_PREAPROBADA: {
    puntos: 30,
    etiqueta: "Tiene hipoteca pre-aprobada",
    explicar: () => "Cuenta con hipoteca pre-aprobada: financiamiento resuelto, cierre ágil.",
  },
  MUDANZA_PROXIMA: {
    puntos: 20,
    etiqueta: "Mudanza en menos de 6 meses",
    explicar: () => "Planea mudarse en menos de 6 meses: urgencia real de compra.",
  },
  SIN_RESPUESTA_14D: {
    puntos: -10,
    etiqueta: "Sin respuesta por 14 días",
    explicar: (c) => `Sin respuesta hace ${c.dias ?? 14} días: el interés se enfría.`,
  },
  SIN_RESPUESTA_30D: {
    puntos: -15,
    etiqueta: "Sin respuesta por 30 días",
    explicar: (c) => `Sin respuesta hace ${c.dias ?? 30} días: deal en riesgo serio de pérdida.`,
  },
  HIPOTECA_POR_VENCER: {
    puntos: -20,
    etiqueta: "Hipoteca pre-aprobada por vencer",
    explicar: (c) =>
      `La pre-aprobación vence en ${c.dias ?? "menos de 15"} días: ventana de cierre cerrándose.`,
  },
  PIDIO_BAJAR_PRECIO: {
    puntos: -5,
    etiqueta: "Pidió bajar el precio",
    explicar: () => "Pidió rebaja de precio: posible resistencia o tope de presupuesto.",
  },
} satisfies Record<string, Regla>;

export type ReglaKey = keyof typeof REGLAS_SCORE;

// --- Núcleo: aplica una regla SIN abrir transacción (componible) ---
async function aplicarEventoCore(
  db: Db,
  args: { oportunidadId: string; regla: ReglaKey; contexto?: ContextoRegla; fecha?: Date },
) {
  const opp = await db.oportunidad.findUnique({
    where: { id: args.oportunidadId },
    select: { id: true, score: true, prospectoId: true },
  });
  if (!opp) throw NotFound("Oportunidad");

  const regla = REGLAS_SCORE[args.regla];
  const nuevoScore = clamp(opp.score + regla.puntos);
  // Delta efectivo tras el clamp => Σ(puntos) siempre == scoreResultante.
  const puntosEfectivos = nuevoScore - opp.score;
  const cuando = args.fecha ?? new Date();

  const evento = await db.scoreEvento.create({
    data: {
      prospectoId: opp.prospectoId,
      oportunidadId: opp.id,
      accion: regla.etiqueta,
      puntos: puntosEfectivos,
      scoreResultante: nuevoScore,
      explicacion: regla.explicar(args.contexto ?? {}),
    },
  });

  const oportunidad = await db.oportunidad.update({
    where: { id: opp.id },
    data: { score: nuevoScore, ultimaActividad: cuando },
  });

  return { evento, oportunidad };
}

/** Aplica una regla de score de forma atómica (transacción propia). */
export function aplicarEvento(args: {
  oportunidadId: string;
  regla: ReglaKey;
  contexto?: ContextoRegla;
  fecha?: Date;
}) {
  return prisma.$transaction((tx) => aplicarEventoCore(tx, args));
}

/** Evento ad-hoc cuando ninguna regla del catálogo aplica. */
export function aplicarEventoCustom(args: {
  oportunidadId: string;
  accion: string;
  puntos: number;
  explicacion: string;
  fecha?: Date;
}) {
  return prisma.$transaction(async (tx) => {
    const opp = await tx.oportunidad.findUnique({
      where: { id: args.oportunidadId },
      select: { id: true, score: true, prospectoId: true },
    });
    if (!opp) throw NotFound("Oportunidad");
    const nuevoScore = clamp(opp.score + args.puntos);
    const puntosEfectivos = nuevoScore - opp.score;

    const evento = await tx.scoreEvento.create({
      data: {
        prospectoId: opp.prospectoId,
        oportunidadId: opp.id,
        accion: args.accion,
        puntos: puntosEfectivos,
        scoreResultante: nuevoScore,
        explicacion: args.explicacion,
      },
    });
    const oportunidad = await tx.oportunidad.update({
      where: { id: opp.id },
      data: { score: nuevoScore, ultimaActividad: args.fecha ?? new Date() },
    });
    return { evento, oportunidad };
  });
}

/**
 * Registra una interacción y (opcional) aplica su regla de score en la MISMA
 * transacción. Sin regla, igual refresca ultimaActividad.
 */
export function registrarInteraccion(args: {
  prospectoId: string;
  oportunidadId?: string;
  asesorId?: string;
  tipo: TipoInteraccion;
  resumen: string;
  fecha?: Date;
  regla?: ReglaKey;
  contexto?: ContextoRegla;
}) {
  const cuando = args.fecha ?? new Date();
  return prisma.$transaction(async (tx) => {
    const interaccion = await tx.interaccion.create({
      data: {
        prospectoId: args.prospectoId,
        oportunidadId: args.oportunidadId,
        asesorId: args.asesorId,
        tipo: args.tipo,
        resumen: args.resumen,
        fecha: cuando,
      },
    });

    let score: Awaited<ReturnType<typeof aplicarEventoCore>> | null = null;
    if (args.oportunidadId) {
      if (args.regla) {
        score = await aplicarEventoCore(tx, {
          oportunidadId: args.oportunidadId,
          regla: args.regla,
          contexto: args.contexto,
          fecha: cuando,
        });
      } else {
        await tx.oportunidad.update({
          where: { id: args.oportunidadId },
          data: { ultimaActividad: cuando },
        });
      }
    }
    return { interaccion, score };
  });
}

/**
 * Score 360° de un prospecto: oportunidades con su score actual + historial
 * completo de eventos con explicación (la "explicación IA" del front).
 */
export async function getScore360(prospectoId: string) {
  const prospecto = await prisma.prospecto.findUnique({
    where: { id: prospectoId },
    select: {
      id: true,
      nombre: true,
      oportunidades: {
        select: {
          id: true,
          etapa: true,
          score: true,
          ultimaActividad: true,
          proyecto: { select: { nombre: true } },
        },
        orderBy: { score: "desc" },
      },
    },
  });
  if (!prospecto) throw NotFound("Prospecto");

  const historial = await prisma.scoreEvento.findMany({
    where: { prospectoId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      accion: true,
      puntos: true,
      scoreResultante: true,
      explicacion: true,
      createdAt: true,
      oportunidadId: true,
    },
  });

  const scoreActual = prospecto.oportunidades.reduce((max, o) => Math.max(max, o.score), 0);

  return { prospecto, scoreActual, oportunidades: prospecto.oportunidades, historial };
}

/**
 * Aplica una regla SOLO si no se aplicó ya desde la última actividad del deal.
 * Evita que los jobs diarios penalicen el mismo deal repetidamente.
 * Devuelve el resultado, o null si se omitió.
 */
export async function aplicarEventoIdempotente(args: {
  oportunidadId: string;
  regla: ReglaKey;
  contexto?: ContextoRegla;
}) {
  const etiqueta = REGLAS_SCORE[args.regla].etiqueta;
  const opp = await prisma.oportunidad.findUnique({
    where: { id: args.oportunidadId },
    select: { ultimaActividad: true },
  });
  if (!opp) throw NotFound("Oportunidad");

  const yaAplicado = await prisma.scoreEvento.findFirst({
    where: {
      oportunidadId: args.oportunidadId,
      accion: etiqueta,
      createdAt: { gte: opp.ultimaActividad },
    },
    select: { id: true },
  });
  if (yaAplicado) return null;

  // Importante: NO refrescar ultimaActividad (es una penalización por inactividad).
  return prisma.$transaction(async (tx) => {
    const o = await tx.oportunidad.findUniqueOrThrow({
      where: { id: args.oportunidadId },
      select: { id: true, score: true, prospectoId: true },
    });
    const regla = REGLAS_SCORE[args.regla];
    const nuevoScore = clamp(o.score + regla.puntos);
    const puntosEfectivos = nuevoScore - o.score;
    const evento = await tx.scoreEvento.create({
      data: {
        prospectoId: o.prospectoId,
        oportunidadId: o.id,
        accion: regla.etiqueta,
        puntos: puntosEfectivos,
        scoreResultante: nuevoScore,
        explicacion: regla.explicar(args.contexto ?? {}),
      },
    });
    const oportunidad = await tx.oportunidad.update({
      where: { id: o.id },
      data: { score: nuevoScore }, // sin tocar ultimaActividad
    });
    return { evento, oportunidad };
  });
}

/** Reparación: recomputa el score sumando todos los eventos. */
export async function recomputarScore(oportunidadId: string) {
  const agg = await prisma.scoreEvento.aggregate({
    where: { oportunidadId },
    _sum: { puntos: true },
  });
  return prisma.oportunidad.update({
    where: { id: oportunidadId },
    data: { score: clamp(agg._sum.puntos ?? 0) },
  });
}

// Re-export para evitar el "unused" en builds estrictos.
export type { Prisma };
