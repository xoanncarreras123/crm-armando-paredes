import cron from "node-cron";
import { detectarInactividad } from "./inactividad.job.js";
import { detectarHipotecasPorVencer } from "./hipotecas.job.js";
import { generarReporteSemanal } from "./reporteSemanal.job.js";
import { procesarColaMensajes } from "./colaWhatsapp.job.js";

// Zona horaria de Perú para que el "8am" sea local.
const TZ = "America/Lima";

// Envuelve un job para capturar errores y no tumbar el scheduler.
function safe(nombre: string, fn: () => Promise<unknown>) {
  return async () => {
    try {
      await fn();
    } catch (e) {
      console.error(`[job:${nombre}] error`, e);
    }
  };
}

/** Registra todos los cron jobs. Llamar una vez al arrancar el server. */
export function registrarJobs() {
  // Cada día 8:00am: inactividad (14d / 30d)
  cron.schedule("0 8 * * *", safe("inactividad", detectarInactividad), { timezone: TZ });

  // Cada día 8:05am: hipotecas por vencer
  cron.schedule("5 8 * * *", safe("hipotecas", detectarHipotecasPorVencer), { timezone: TZ });

  // Lunes 8:10am: reporte semanal por asesor
  cron.schedule("10 8 * * 1", safe("reporteSemanal", generarReporteSemanal), { timezone: TZ });

  // Cada hora en punto: procesar cola de mensajes entrantes
  cron.schedule("0 * * * *", safe("colaWhatsapp", procesarColaMensajes), { timezone: TZ });

  console.log(`[jobs] 4 cron jobs registrados (TZ=${TZ})`);
}
