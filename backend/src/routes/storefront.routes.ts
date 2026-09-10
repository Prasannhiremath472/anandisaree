import { Router } from "express";
import * as productController from "../controllers/product.controller";
import * as reelController from "../controllers/reel.controller";
import * as bannerController from "../controllers/banner.controller";

const router = Router();

router.get("/products", productController.listPublicProducts);
router.get("/products/:slug", productController.getPublicProductBySlug);
router.get("/categories", productController.listPublicCategoriesLookup);
router.get("/reels", reelController.listPublicReels);
router.get("/banners", bannerController.listPublicBanners);

export default router;
