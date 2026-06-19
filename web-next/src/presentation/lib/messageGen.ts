// Generador de mensajes. En mock devuelve 2 versiones (formal/casual).
// En producción esto llamaría a POST /agente/mensaje (Claude opus-4-8).

export type ObjetivoMensaje =
  | "PRIMER_CONTACTO"
  | "SEGUIMIENTO"
  | "REACTIVACION"
  | "INVITACION_VISITA"
  | "PROPUESTA_CIERRE";

export const OBJETIVOS: { key: ObjetivoMensaje; label: string }[] = [
  { key: "PRIMER_CONTACTO", label: "Primer contacto" },
  { key: "SEGUIMIENTO", label: "Seguimiento" },
  { key: "REACTIVACION", label: "Reactivación" },
  { key: "INVITACION_VISITA", label: "Invitación a visita" },
  { key: "PROPUESTA_CIERRE", label: "Propuesta de cierre" },
];

interface Ctx {
  nombre: string;
  proyecto: string;
}

const PRIMER = (n: string) => n.split(" ")[0];

const PLANTILLAS: Record<ObjetivoMensaje, (c: Ctx) => { formal: string; casual: string }> = {
  PRIMER_CONTACTO: ({ nombre, proyecto }) => ({
    formal: `Estimado/a ${PRIMER(nombre)}, le saluda Camila de Armando Paredes. Gracias por su interés en ${proyecto}. ¿Le gustaría que coordinemos una llamada para mostrarle las opciones disponibles?`,
    casual: `Hola ${PRIMER(nombre)} 🙂 Soy Camila de Armando Paredes. Vi tu interés en ${proyecto}, ¿te animas a que te muestre lo que tenemos? Cuando quieras coordinamos.`,
  }),
  SEGUIMIENTO: ({ nombre, proyecto }) => ({
    formal: `Estimado/a ${PRIMER(nombre)}, quería retomar nuestra conversación sobre ${proyecto}. ¿Pudo revisar la información que le envié? Quedo atenta a sus comentarios.`,
    casual: `Hola ${PRIMER(nombre)}, ¿pudiste ver la info de ${proyecto}? Cualquier duda por acá estoy 🙂`,
  }),
  REACTIVACION: ({ nombre, proyecto }) => ({
    formal: `Estimado/a ${PRIMER(nombre)}, han pasado algunas semanas desde nuestro último contacto. En ${proyecto} se liberaron unidades con la tipología que buscaba. ¿Le interesaría retomarlo?`,
    casual: `Hola ${PRIMER(nombre)}, tiempo sin saber de ti 🙂 En ${proyecto} quedan pocas unidades de lo que buscabas, ¿le damos una vuelta?`,
  }),
  INVITACION_VISITA: ({ nombre, proyecto }) => ({
    formal: `Estimado/a ${PRIMER(nombre)}, me encantaría mostrarle ${proyecto} en persona. ¿Tiene disponibilidad esta semana para una visita al proyecto?`,
    casual: `${PRIMER(nombre)}, ¿te gustaría ver ${proyecto} en vivo? Tengo cupos esta semana, dime qué día te queda 🙂`,
  }),
  PROPUESTA_CIERRE: ({ nombre, proyecto }) => ({
    formal: `Estimado/a ${PRIMER(nombre)}, preparé la propuesta para su unidad en ${proyecto} con la forma de pago conversada. ¿Coordinamos una llamada para revisar los detalles y avanzar con la separación?`,
    casual: `${PRIMER(nombre)}, ya tengo lista tu propuesta para ${proyecto} 🙌 ¿Te llamo hoy para verla y avanzamos con la separación?`,
  }),
};

export function generarMensaje(
  objetivo: ObjetivoMensaje,
  ctx: Ctx,
): Promise<{ formal: string; casual: string }> {
  return new Promise((r) => setTimeout(() => r(PLANTILLAS[objetivo](ctx)), 900));
}
