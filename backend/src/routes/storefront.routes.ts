import { Router } from "express";
import * as productController from "../controllers/product.controller";
import * as reelController from "../controllers/reel.controller";

const router = Router();

router.get("/products", productController.listPublicProducts);
router.get("/products/:slug", productController.getPublicProductBySlug);
router.get("/categories", productController.listPublicCategoriesLookup);
router.get("/reels", reelController.listPublicReels);

export default router;
