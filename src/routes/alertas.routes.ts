import { Router } from "express";
import * as ctrl from "../controllers/alertas.controller.js";
import { asyncHandler } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", asyncHandler(ctrl.resumen));

export default router;
