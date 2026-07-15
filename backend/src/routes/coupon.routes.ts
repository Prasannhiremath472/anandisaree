import { Router } from "express";
import * as couponController from "../controllers/coupon.controller";
import { authenticate, authorize } from "../middleware/auth";
import { MARKETING_ROLES } from "../utils/roles";

const router = Router();

router.use(authenticate, authorize(...MARKETING_ROLES));

router.get("/", couponController.listCoupons);
router.get("/:id", couponController.getCoupon);
router.post("/", couponController.createCoupon);
router.put("/:id", couponController.updateCoupon);
router.delete("/:id", couponController.deleteCoupon);

export default router;
