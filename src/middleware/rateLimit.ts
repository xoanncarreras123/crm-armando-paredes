import rateLimit from "express-rate-limit";
import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";
import { Unauthorized } from "../lib/errors.js";

// Rate limit estricto para webhooks: endpoints públicos, blanco de abuso.
export const webhookLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  limit: 120, // 120 req/min por IP
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: { code: "RATE_LIMITED", message: "Demasiadas solicitudes" } },
});

// Rate limit general para la API autenticada.
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

/** Valida el secreto compartido del webhook (header x-webhook-secret). */
export function verifyWebhookSecret(req: Request, _res: Response, next: NextFunction) {
  const secret = req.headers["x-webhook-secret"];
  if (secret !== env.WEBHOOK_SECRET) return next(Unauthorized("Secreto de webhook inválido"));
  next();
}
