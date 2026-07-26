import { Router } from "express";
import * as checkoutController from "../controllers/checkout.controller";
import { authenticate } from "../middleware/auth";
import { env } from "../config/env";

const router = Router();

router.get("/razorpay-key", (_req, res) => {
  res.json({ success: true, data: { keyId: env.RAZORPAY_KEY_ID } });
});

router.use(authenticate);

router.get("/addresses", checkoutController.listAddresses);
router.post("/addresses", checkoutController.createAddress);
router.post("/orders", checkoutController.createOrder);
router.post("/orders/verify-payment", checkoutController.verifyPayment);
router.get("/orders/mine", checkoutController.listMyOrders);

export default router;
