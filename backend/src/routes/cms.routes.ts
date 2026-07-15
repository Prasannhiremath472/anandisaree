import { Router } from "express";
import * as cmsController from "../controllers/cms.controller";
import { authenticate, authorize } from "../middleware/auth";
import { MARKETING_ROLES } from "../utils/roles";

const router = Router();

router.use(authenticate, authorize(...MARKETING_ROLES));

router.get("/pages", cmsController.listCmsPages);
router.get("/pages/:slug", cmsController.getCmsPage);
router.put("/pages/:slug", cmsController.upsertCmsPage);

router.get("/blog", cmsController.listBlogPosts);
router.get("/blog/:id", cmsController.getBlogPost);
router.post("/blog", cmsController.createBlogPost);
router.put("/blog/:id", cmsController.updateBlogPost);
router.delete("/blog/:id", cmsController.deleteBlogPost);

export default router;
