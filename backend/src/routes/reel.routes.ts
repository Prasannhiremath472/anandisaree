import { Router } from "express";
import * as reelController from "../controllers/reel.controller";
import { authenticate, authorize } from "../middleware/auth";
import { MARKETING_ROLES } from "../utils/roles";

const router = Router();

router.use(authenticate, authorize(...MARKETING_ROLES));

router.get("/", reelController.listReels);
router.get("/:id", reelController.getReel);
router.post("/", reelController.createReel);
router.put("/:id", reelController.updateReel);
router.delete("/:id", reelController.deleteReel);

export default router;
