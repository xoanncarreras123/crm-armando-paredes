import { Router } from "express";
import auth from "./auth.routes.js";
import prospectos from "./prospectos.routes.js";
import score from "./score.routes.js";
import unidades from "./unidades.routes.js";
import proyectos from "./proyectos.routes.js";
import alertas from "./alertas.routes.js";
import webhooks from "./webhooks.routes.js";

// Monta todas las rutas bajo /api (excepto webhooks, máquina-a-máquina).
const api = Router();

api.get("/health", (_req, res) => res.json({ status: "ok", ts: new Date().toISOString() }));
api.use("/auth", auth);
api.use("/prospectos", prospectos);
api.use("/score", score);
api.use("/unidades", unidades);
api.use("/proyectos", proyectos);
api.use("/alertas", alertas);

export { api, webhooks };
