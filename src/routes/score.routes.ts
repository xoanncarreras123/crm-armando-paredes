import { Router } from "express";
import * as ctrl from "../controllers/score.controller.js";
import { asyncHandler } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { scoreEventoBody, interaccionBody } from "../validators/schemas.js";

const router = Router();
router.use(requireAuth);

router.post("/evento", validate({ body: scoreEventoBody }), asyncHandler(ctrl.registrarEvento));
router.post("/interaccion", validate({ body: interaccionBody }), asyncHandler(ctrl.registrarInteraccion));

export default router;
