import type { Request, Response } from "express";
import * as service from "../services/unidades.service.js";

/** GET /proyectos/:id/unidades — inventario filtrable. */
export async function inventario(req: Request, res: Response) {
  const unidades = await service.inventarioProyecto(req.params.id, req.query as service.FiltrosInventario);
  res.json({ proyectoId: req.params.id, total: unidades.length, unidades });
}

/** POST /unidades/:id/reservar — reserva la unidad (atómico). */
export async function reservar(req: Request, res: Response) {
  const reserva = await service.reservarUnidad({ unidadId: req.params.id, ...req.body });
  res.status(201).json(reserva);
}
