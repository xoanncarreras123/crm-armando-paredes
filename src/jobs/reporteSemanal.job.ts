import { reporteSemanalPorAsesor } from "../services/reportes.service.js";

// ============================================================================
// JOB: reporte semanal por asesor. Corre los lunes 8am.
// Aquí se genera el reporte; el envío (email/Slack) se conecta donde
// corresponda. Por ahora lo dejamos en log estructurado.
// ============================================================================

export async function generarReporteSemanal() {
  const reporte = await reporteSemanalPorAsesor();
  console.log("[job:reporteSemanal] generado", JSON.stringify(reporte, null, 2));
  // TODO: enviar por email/Slack a la gerencia comercial.
  return reporte;
}
