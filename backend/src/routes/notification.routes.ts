import { Router } from "express";
import * as notificationController from "../controllers/notification.controller";
import { authenticate, authorize } from "../middleware/auth";
import { ADMIN_ROLES } from "../utils/roles";

const router = Router();

router.use(authenticate, authorize(...ADMIN_ROLES));

router.get("/", notificationController.listNotifications);
router.patch("/read-all", notificationController.markAllRead);
router.patch("/:id/read", notificationController.markRead);

export default router;
