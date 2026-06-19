import "dotenv/config";

// Validación y tipado de variables de entorno. Falla rápido al arrancar
// si falta algo crítico, en vez de explotar en runtime más tarde.
function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Falta la variable de entorno requerida: ${name}`);
  return v;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 3000),
  DATABASE_URL: required("DATABASE_URL"),
  JWT_SECRET: process.env.JWT_SECRET ?? "dev-secret-cambiar-en-produccion",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "12h",
  // Secreto compartido para validar webhooks entrantes (n8n / Urbania).
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET ?? "dev-webhook-secret",
} as const;
