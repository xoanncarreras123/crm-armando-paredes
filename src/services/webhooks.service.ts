import { Prisma, type CanalMensaje } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { registrarInteraccion } from "./score.service.js";

// ============================================================================
// WEBHOOKS — recepción desacoplada
// El endpoint solo ENCOLA (rápido, idempotente). Un job procesa la cola cada
// hora: así un pico de tráfico o un fallo de DB no pierde leads/mensajes.
// ============================================================================

export type MensajeCrudo = {
  canal: CanalMensaje;
  telefono?: string;
  email?: string;
  nombre?: string;
  contenido?: string;
  externalId?: string;
  payload: unknown;
};

/** Encola un mensaje entrante. Idempotente por (canal, externalId). */
export async function encolarMensaje(m: MensajeCrudo) {
  try {
    return await prisma.mensajeEntrante.create({
      data: {
        canal: m.canal,
        telefono: m.telefono,
        email: m.email,
        nombre: m.nombre,
        contenido: m.contenido,
        externalId: m.externalId,
        payload: (m.payload ?? {}) as Prisma.InputJsonValue,
      },
    });
  } catch (e) {
    // Violación de unicidad => ya recibimos este evento; lo ignoramos.
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return prisma.mensajeEntrante.findFirst({
        where: { canal: m.canal, externalId: m.externalId },
      });
    }
    throw e;
  }
}

// --- Procesamiento de la cola (lo llama el job horario) ---

const MAX_INTENTOS = 5;

/** Procesa hasta `lote` mensajes pendientes. Devuelve el conteo por resultado. */
export async function procesarCola(lote = 50) {
  const pendientes = await prisma.mensajeEntrante.findMany({
    where: { estado: "PENDIENTE", intentos: { lt: MAX_INTENTOS } },
    orderBy: { createdAt: "asc" },
    take: lote,
  });

  let ok = 0;
  let err = 0;
  for (const msg of pendientes) {
    try {
      if (msg.canal === "WHATSAPP") await procesarWhatsApp(msg);
      else await procesarFormulario(msg); // FORMULARIO_WEB | URBANIA
      await prisma.mensajeEntrante.update({
        where: { id: msg.id },
        data: { estado: "PROCESADO", procesadoEn: new Date() },
      });
      ok++;
    } catch (e) {
      err++;
      await prisma.mensajeEntrante.update({
        where: { id: msg.id },
        data: {
          intentos: { increment: 1 },
          error: e instanceof Error ? e.message : String(e),
          estado: msg.intentos + 1 >= MAX_INTENTOS ? "ERROR" : "PENDIENTE",
        },
      });
    }
  }
  return { procesados: pendientes.length, ok, err };
}

/** Mensaje de WhatsApp: ubica/crea prospecto por teléfono y registra interacción. */
async function procesarWhatsApp(msg: { telefono: string | null; nombre: string | null; contenido: string | null }) {
  if (!msg.telefono) throw new Error("WhatsApp sin teléfono");

  let prospecto = await prisma.prospecto.findFirst({ where: { telefono: msg.telefono } });
  if (!prospecto) {
    prospecto = await prisma.prospecto.create({
      data: { nombre: msg.nombre ?? `WhatsApp ${msg.telefono}`, telefono: msg.telefono, fuente: "WHATSAPP" },
    });
  }

  const oppActiva = await prisma.oportunidad.findFirst({
    where: { prospectoId: prospecto.id, etapa: { notIn: ["CERRADO_GANADO", "CERRADO_PERDIDO"] } },
    orderBy: { score: "desc" },
    select: { id: true },
  });

  await registrarInteraccion({
    prospectoId: prospecto.id,
    oportunidadId: oppActiva?.id,
    tipo: "WHATSAPP",
    resumen: msg.contenido?.slice(0, 500) ?? "(mensaje sin texto)",
  });
}

/** Lead de formulario web / Urbania: crea prospecto si no existe (dedupe por email/tel). */
async function procesarFormulario(msg: {
  canal: CanalMensaje;
  telefono: string | null;
  email: string | null;
  nombre: string | null;
  contenido: string | null;
}) {
  const existente = await prisma.prospecto.findFirst({
    where: {
      OR: [
        ...(msg.email ? [{ email: msg.email }] : []),
        ...(msg.telefono ? [{ telefono: msg.telefono }] : []),
      ],
    },
  });
  if (existente) {
    await registrarInteraccion({
      prospectoId: existente.id,
      tipo: "EMAIL",
      resumen: `Nuevo contacto vía ${msg.canal}: ${msg.contenido ?? ""}`.slice(0, 500),
    });
    return;
  }

  await prisma.prospecto.create({
    data: {
      nombre: msg.nombre ?? "Lead web",
      email: msg.email,
      telefono: msg.telefono ?? "",
      fuente: msg.canal === "URBANIA" ? "URBANIA" : "WEB",
    },
  });
}
