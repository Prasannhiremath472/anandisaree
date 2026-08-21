import { Router } from "express";
import * as categoryController from "../controllers/category.controller";
import { authenticate, authorize } from "../middleware/auth";
import { INVENTORY_ROLES } from "../utils/roles";

const router = Router();

router.use(authenticate, authorize(...INVENTORY_ROLES));

router.get("/", categoryController.listCategories);
router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

export default router;
