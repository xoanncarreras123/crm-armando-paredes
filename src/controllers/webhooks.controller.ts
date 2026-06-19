import type { Request, Response } from "express";
import * as service from "../services/webhooks.service.js";

/**
 * POST /webhook/whatsapp — entrada desde n8n.
 * Solo encola (respuesta inmediata 202); el job horario procesa.
 */
export async function whatsapp(req: Request, res: Response) {
  const b = req.body as { from: string; name?: string; message?: string; messageId?: string };
  await service.encolarMensaje({
    canal: "WHATSAPP",
    telefono: b.from,
    nombre: b.name,
    contenido: b.message,
    externalId: b.messageId,
    payload: req.body,
  });
  res.status(202).json({ status: "encolado" });
}

/** POST /webhook/formulario — lead desde Urbania / web propia. */
export async function formulario(req: Request, res: Response) {
  const b = req.body as {
    source: "URBANIA" | "WEB";
    nombre?: string;
    email?: string;
    telefono?: string;
    mensaje?: string;
    externalId?: string;
  };
  await service.encolarMensaje({
    canal: b.source === "URBANIA" ? "URBANIA" : "FORMULARIO_WEB",
    nombre: b.nombre,
    email: b.email,
    telefono: b.telefono,
    contenido: b.mensaje,
    externalId: b.externalId,
    payload: req.body,
  });
  res.status(202).json({ status: "encolado" });
}
