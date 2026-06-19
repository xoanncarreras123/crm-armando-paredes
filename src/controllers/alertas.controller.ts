import type { Request, Response } from "express";
import * as service from "../services/alertas.service.js";

/** GET /alertas — resumen consolidado: inactividad, riesgo e hipotecas. */
export async function resumen(_req: Request, res: Response) {
  const data = await service.resumenAlertas();
  res.json(data);
}
