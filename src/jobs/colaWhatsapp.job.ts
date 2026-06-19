import { procesarCola } from "../services/webhooks.service.js";

// ============================================================================
// JOB: procesar la cola de mensajes entrantes (WhatsApp/formularios).
// Corre cada hora. Desacopla recepción de procesamiento.
// ============================================================================

export async function procesarColaMensajes() {
  const r = await procesarCola(100);
  console.log(`[job:colaWhatsapp] procesados=${r.procesados} ok=${r.ok} err=${r.err}`);
  return r;
}
