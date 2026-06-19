import type { Request, Response } from "express";
import * as service from "../services/prospectos.service.js";

export async function crear(req: Request, res: Response) {
  const prospecto = await service.crearProspecto(req.body);
  res.status(201).json(prospecto);
}

export async function listar(req: Request, res: Response) {
  const result = await service.listarProspectos(req.query as service.ListarFiltros);
  res.json(result);
}

export async function detalle(req: Request, res: Response) {
  const prospecto = await service.perfil360(req.params.id);
  res.json(prospecto);
}

export async function cambiarEtapa(req: Request, res: Response) {
  const oportunidad = await service.moverEtapa(req.params.id, req.body);
  res.json(oportunidad);
}
