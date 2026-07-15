import { Router } from "express";
import * as productController from "../controllers/product.controller";
import { authenticate, authorize } from "../middleware/auth";
import { INVENTORY_ROLES } from "../utils/roles";

const router = Router();

router.use(authenticate, authorize(...INVENTORY_ROLES));

router.get("/", productController.listProducts);
router.get("/lookups/categories", productController.listCategoriesLookup);
router.get("/lookups/brands", productController.listBrandsLookup);
router.get("/:id", productController.getProduct);
router.post("/", productController.createProduct);
router.post("/bulk-delete", productController.bulkDeleteProducts);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
