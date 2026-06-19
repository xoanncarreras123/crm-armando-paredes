import { Router } from "express";
import * as ctrl from "../controllers/prospectos.controller.js";
import * as scoreCtrl from "../controllers/score.controller.js";
import { asyncHandler } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  crearProspectoBody,
  listarProspectosQuery,
  moverEtapaBody,
  idParam,
} from "../validators/schemas.js";

const router = Router();
router.use(requireAuth);

router.post("/", validate({ body: crearProspectoBody }), asyncHandler(ctrl.crear));
router.get("/", validate({ query: listarProspectosQuery }), asyncHandler(ctrl.listar));
router.get("/:id", validate({ params: idParam }), asyncHandler(ctrl.detalle));
router.patch(
  "/:id/etapa",
  validate({ params: idParam, body: moverEtapaBody }),
  asyncHandler(ctrl.cambiarEtapa),
);

// Score del prospecto (perfil de score + historial + explicaciones).
router.get("/:id/score", validate({ params: idParam }), asyncHandler(scoreCtrl.scoreDeProspecto));

export default router;
