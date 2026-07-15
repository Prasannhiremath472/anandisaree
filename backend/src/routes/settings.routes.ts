import { Router } from "express";
import * as settingsController from "../controllers/settings.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.use(authenticate, authorize("SUPER_ADMIN", "ADMIN"));

router.get("/", settingsController.listSettings);
router.put("/", settingsController.upsertSettings);

export default router;
