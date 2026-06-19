import type { Request, Response, NextFunction } from "express";
import { verificarToken, type JwtPayload } from "../services/auth.service.js";
import { Unauthorized } from "../lib/errors.js";

// Extiende Request con el asesor autenticado.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      asesor?: JwtPayload;
    }
  }
}

/** Exige un Bearer token válido; adjunta req.asesor. */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next(Unauthorized("Falta el header Authorization"));
  req.asesor = verificarToken(header.slice(7));
  next();
}
