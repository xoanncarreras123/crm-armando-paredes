import { Router } from "express";
import * as ctrl from "../controllers/unidades.controller.js";
import { asyncHandler } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { reservarBody, idParam } from "../validators/schemas.js";

const router = Router();
router.use(requireAuth);

router.post(
  "/:id/reservar",
  validate({ params: idParam, body: reservarBody }),
  asyncHandler(ctrl.reservar),
);

export default router;
