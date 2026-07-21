import { Router } from "express";
import * as productController from "../controllers/product.controller";

const router = Router();

router.get("/products", productController.listPublicProducts);
router.get("/products/:slug", productController.getPublicProductBySlug);
router.get("/categories", productController.listCategoriesLookup);

export default router;
