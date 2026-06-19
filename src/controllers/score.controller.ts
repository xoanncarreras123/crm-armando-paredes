import type { Request, Response } from "express";
import * as score from "../services/score.service.js";

/** POST /score/evento — aplica una regla y recalcula el score (atómico). */
export async function registrarEvento(req: Request, res: Response) {
  const result = await score.aplicarEvento(req.body);
  res.status(201).json(result);
}

/** GET /prospectos/:id/score — score actual + historial + explicaciones. */
export async function scoreDeProspecto(req: Request, res: Response) {
  const result = await score.getScore360(req.params.id);
  res.json(result);
}

/** POST /interacciones — registra interacción + scoring en una transacción. */
export async function registrarInteraccion(req: Request, res: Response) {
  const result = await score.registrarInteraccion(req.body);
  res.status(201).json(result);
}
