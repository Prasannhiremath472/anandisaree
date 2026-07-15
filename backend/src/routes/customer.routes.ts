import { Router } from "express";
import * as customerController from "../controllers/customer.controller";
import { authenticate, authorize } from "../middleware/auth";
import { SUPPORT_ROLES } from "../utils/roles";

const router = Router();

router.use(authenticate, authorize(...SUPPORT_ROLES));

router.get("/", customerController.listCustomers);
router.get("/:id", customerController.getCustomer);
router.patch("/:id/status", customerController.updateCustomerStatus);

export default router;
