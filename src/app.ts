import express from "express";
import { api, webhooks } from "./routes/index.js";
import { requestLogger } from "./middleware/logger.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import { notFoundHandler, errorHandler } from "./middleware/error.js";

// Construye la app Express (sin escuchar). Facilita los tests.
export function createApp() {
  const app = express();

  app.use(express.json({ limit: "1mb" }));
  app.use(requestLogger);

  // Webhooks: rate limit propio (definido en el router), sin JWT.
  app.use("/webhook", webhooks);

  // API autenticada bajo /api.
  app.use("/api", apiLimiter, api);

  // 404 + manejo central de errores (siempre al final).
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
