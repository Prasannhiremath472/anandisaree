import { Router } from "express";
import * as newsletterController from "../controllers/newsletter.controller";
import { authenticate, authorize } from "../middleware/auth";
import { MARKETING_ROLES } from "../utils/roles";

const router = Router();

router.use(authenticate, authorize(...MARKETING_ROLES));

router.get("/", newsletterController.listSubscribers);
router.get("/export", newsletterController.exportSubscribers);
router.delete("/:id", newsletterController.deleteSubscriber);

export default router;
