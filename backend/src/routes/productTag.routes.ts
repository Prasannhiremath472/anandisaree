import { Router } from "express";
import * as productTagController from "../controllers/productTag.controller";
import { authenticate, authorize } from "../middleware/auth";
import { INVENTORY_ROLES } from "../utils/roles";

const router = Router();

router.use(authenticate, authorize(...INVENTORY_ROLES));

router.get("/", productTagController.listProductTags);
router.post("/", productTagController.createProductTag);

export default router;
