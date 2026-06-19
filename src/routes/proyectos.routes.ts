import { Router } from "express";
import * as unidadesCtrl from "../controllers/unidades.controller.js";
import { asyncHandler } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { inventarioQuery, idParam } from "../validators/schemas.js";

const router = Router();
router.use(requireAuth);

// Inventario de unidades de un proyecto.
router.get(
  "/:id/unidades",
  validate({ params: idParam, query: inventarioQuery }),
  asyncHandler(unidadesCtrl.inventario),
);

export default router;
