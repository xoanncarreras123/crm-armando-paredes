import { z } from "zod";

// Enums replicados como tuplas para Zod (deben coincidir con el schema Prisma).
const Fuente = z.enum(["INSTAGRAM", "URBANIA", "WHATSAPP", "REFERIDO", "FERIA", "WEB"]);
const TipoCompra = z.enum(["VIVIENDA", "INVERSION"]);
const Etapa = z.enum([
  "NUEVO",
  "CONTACTADO",
  "CALIFICADO",
  "VISITA_AGENDADA",
  "PROPUESTA",
  "NEGOCIACION",
  "RESERVA",
  "CERRADO_GANADO",
  "CERRADO_PERDIDO",
]);
const TipoInteraccion = z.enum(["WHATSAPP", "EMAIL", "VISITA", "LLAMADA"]);
const ReglaScore = z.enum([
  "ABRIO_BROCHURE",
  "RESPUESTA_RAPIDA",
  "PIDIO_FINANCIAMIENTO",
  "PREGUNTO_PAGO_ESCRITURA",
  "PRIMERA_VISITA",
  "SEGUNDA_VISITA",
  "CODECISOR_CONTACTO",
  "HIPOTECA_PREAPROBADA",
  "MUDANZA_PROXIMA",
  "SIN_RESPUESTA_14D",
  "SIN_RESPUESTA_30D",
  "HIPOTECA_POR_VENCER",
  "PIDIO_BAJAR_PRECIO",
]);

const isoDate = z.coerce.date();
const idParam = z.object({ id: z.string().min(1) });

// --- Prospectos ---
export const crearProspectoBody = z.object({
  nombre: z.string().min(2),
  email: z.string().email().optional(),
  telefono: z.string().min(6),
  fuente: Fuente,
  tipoCompra: TipoCompra.optional(),
  presupuesto: z.number().positive().optional(),
  hipotecaPreAprobada: z.boolean().optional(),
  hipotecaVenceEl: isoDate.optional(),
  fechaMudanzaEst: isoDate.optional(),
  proyectoId: z.string().optional(),
  asesorId: z.string().optional(),
});

export const listarProspectosQuery = z.object({
  etapa: Etapa.optional(),
  scoreMin: z.coerce.number().int().min(0).max(100).optional(),
  asesorId: z.string().optional(),
  proyectoId: z.string().optional(),
  fuente: Fuente.optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
});

export const moverEtapaBody = z.object({
  oportunidadId: z.string().min(1),
  etapa: Etapa,
  motivoPerdida: z.string().optional(),
});

// --- Score ---
export const scoreEventoBody = z.object({
  oportunidadId: z.string().min(1),
  regla: ReglaScore,
  contexto: z
    .object({
      dias: z.number().optional(),
      detalle: z.string().optional(),
      montoAnterior: z.number().optional(),
      montoNuevo: z.number().optional(),
    })
    .optional(),
});

// --- Unidades ---
export const inventarioQuery = z.object({
  estado: z.enum(["DISPONIBLE", "RESERVADA", "VENDIDA"]).optional(),
  precioMin: z.coerce.number().optional(),
  precioMax: z.coerce.number().optional(),
  areaMin: z.coerce.number().optional(),
  areaMax: z.coerce.number().optional(),
  pisoMin: z.coerce.number().int().optional(),
  dormitorios: z.coerce.number().int().optional(),
});

export const reservarBody = z.object({
  oportunidadId: z.string().min(1),
  montoSeparacion: z.number().positive(),
  vencimiento: isoDate.optional(),
});

// --- Auth ---
export const loginBody = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// --- Webhooks ---
export const webhookWhatsappBody = z.object({
  from: z.string().min(6), // teléfono
  name: z.string().optional(),
  message: z.string().optional(),
  messageId: z.string().optional(),
});

export const webhookFormularioBody = z.object({
  source: z.enum(["URBANIA", "WEB"]).default("WEB"),
  nombre: z.string().optional(),
  email: z.string().email().optional(),
  telefono: z.string().optional(),
  mensaje: z.string().optional(),
  externalId: z.string().optional(),
});

// --- Interacción (usada por score.controller para registrar + scorear) ---
export const interaccionBody = z.object({
  prospectoId: z.string().min(1),
  oportunidadId: z.string().optional(),
  asesorId: z.string().optional(),
  tipo: TipoInteraccion,
  resumen: z.string().min(1),
  regla: ReglaScore.optional(),
});

export { idParam, Etapa, ReglaScore };
