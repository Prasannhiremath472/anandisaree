import { Router } from "express";
import * as couponClaimController from "../controllers/couponClaim.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.post("/claim", couponClaimController.claimCoupon);
router.get("/mine", couponClaimController.listMyCoupons);

export default router;
