import { Router } from "express";
import * as bannerController from "../controllers/banner.controller";
import { authenticate, authorize } from "../middleware/auth";
import { MARKETING_ROLES } from "../utils/roles";

const router = Router();

router.use(authenticate, authorize(...MARKETING_ROLES));

router.get("/", bannerController.listBanners);
router.get("/:id", bannerController.getBanner);
router.post("/", bannerController.createBanner);
router.put("/:id", bannerController.updateBanner);
router.delete("/:id", bannerController.deleteBanner);

export default router;
