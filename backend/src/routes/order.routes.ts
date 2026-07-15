import { Router } from "express";
import * as orderController from "../controllers/order.controller";
import { authenticate, authorize } from "../middleware/auth";
import { ORDER_ROLES } from "../utils/roles";

const router = Router();

router.use(authenticate, authorize(...ORDER_ROLES));

router.get("/", orderController.listOrders);
router.get("/:id", orderController.getOrder);
router.patch("/:id/status", orderController.updateOrderStatus);

export default router;
