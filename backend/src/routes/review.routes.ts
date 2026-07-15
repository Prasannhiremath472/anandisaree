import { Router } from "express";
import * as reviewController from "../controllers/review.controller";
import { authenticate, authorize } from "../middleware/auth";
import { SUPPORT_ROLES } from "../utils/roles";

const router = Router();

router.use(authenticate, authorize(...SUPPORT_ROLES));

router.get("/", reviewController.listReviews);
router.patch("/:id/status", reviewController.updateReviewStatus);
router.patch("/:id/featured", reviewController.setReviewFeatured);
router.delete("/:id", reviewController.deleteReview);

export default router;
