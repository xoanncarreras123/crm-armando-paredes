import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { Unauthorized } from "../lib/errors.js";

// ============================================================================
// AUTH — login de asesores y emisión de JWT
// ============================================================================

export type JwtPayload = { sub: string; email: string; nombre: string };

export async function login(email: string, password: string) {
  const asesor = await prisma.asesor.findUnique({ where: { email } });
  if (!asesor || !asesor.activo || !asesor.passwordHash) throw Unauthorized("Credenciales inválidas");

  const ok = await bcrypt.compare(password, asesor.passwordHash);
  if (!ok) throw Unauthorized("Credenciales inválidas");

  const payload: JwtPayload = { sub: asesor.id, email: asesor.email, nombre: asesor.nombre };
  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] });

  return { token, asesor: payload };
}

/** Helper para crear/actualizar la contraseña de un asesor (seed/admin). */
export async function setPassword(asesorId: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.asesor.update({ where: { id: asesorId }, data: { passwordHash } });
}

export function verificarToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch {
    throw Unauthorized("Token inválido o expirado");
  }
}
