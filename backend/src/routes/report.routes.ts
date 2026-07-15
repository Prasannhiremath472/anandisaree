import { Router } from "express";
import * as reportController from "../controllers/report.controller";
import { authenticate, authorize } from "../middleware/auth";
import { ADMIN_ROLES } from "../utils/roles";

const router = Router();

router.use(authenticate, authorize(...ADMIN_ROLES));

router.get("/sales", reportController.salesReport);
router.get("/order-status", reportController.orderStatusReport);
router.get("/top-products", reportController.topProductsReport);
router.get("/inventory", reportController.inventoryReport);
router.get("/customers", reportController.customersReport);

export default router;
