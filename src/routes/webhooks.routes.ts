import { Router } from "express";
import * as ctrl from "../controllers/webhooks.controller.js";
import { asyncHandler } from "../middleware/error.js";
import { validate } from "../middleware/validate.js";
import { webhookLimiter, verifyWebhookSecret } from "../middleware/rateLimit.js";
import { webhookWhatsappBody, webhookFormularioBody } from "../validators/schemas.js";

const router = Router();

// Webhooks: rate-limited + secreto compartido (no JWT, son máquina-a-máquina).
router.use(webhookLimiter, verifyWebhookSecret);

router.post("/whatsapp", validate({ body: webhookWhatsappBody }), asyncHandler(ctrl.whatsapp));
router.post("/formulario", validate({ body: webhookFormularioBody }), asyncHandler(ctrl.formulario));

export default router;
