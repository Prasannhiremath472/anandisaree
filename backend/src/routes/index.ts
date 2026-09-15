import { Router } from "express";
import authRoutes from "./auth.routes";
import productRoutes from "./product.routes";
import orderRoutes from "./order.routes";
import customerRoutes from "./customer.routes";
import couponRoutes from "./coupon.routes";
import bannerRoutes from "./banner.routes";
import cmsRoutes from "./cms.routes";
import reviewRoutes from "./review.routes";
import newsletterRoutes from "./newsletter.routes";
import reportRoutes from "./report.routes";
import settingsRoutes from "./settings.routes";
import couponClaimRoutes from "./couponClaim.routes";
import uploadRoutes from "./upload.routes";
import storefrontRoutes from "./storefront.routes";
import checkoutRoutes from "./checkout.routes";
import categoryRoutes from "./category.routes";
import reelRoutes from "./reel.routes";
import productTagRoutes from "./productTag.routes";
import notificationRoutes from "./notification.routes";
import { authenticate, authorize } from "../middleware/auth";
import { ADMIN_ROLES } from "../utils/roles";
import * as orderController from "../controllers/order.controller";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString() } });
});

router.use("/auth", authRoutes);

router.get("/admin/dashboard", authenticate, authorize(...ADMIN_ROLES), orderController.getDashboardSummary);

router.use("/admin/products", productRoutes);
router.use("/admin/orders", orderRoutes);
router.use("/admin/customers", customerRoutes);
router.use("/admin/coupons", couponRoutes);
router.use("/admin/banners", bannerRoutes);
router.use("/admin/cms", cmsRoutes);
router.use("/admin/reviews", reviewRoutes);
router.use("/admin/newsletter", newsletterRoutes);
router.use("/admin/reports", reportRoutes);
router.use("/admin/settings", settingsRoutes);
router.use("/admin/upload", uploadRoutes);
router.use("/admin/categories", categoryRoutes);
router.use("/admin/reels", reelRoutes);
router.use("/admin/product-tags", productTagRoutes);
router.use("/admin/notifications", notificationRoutes);

router.use("/coupons", couponClaimRoutes);

router.use("/storefront", storefrontRoutes);
router.use("/checkout", checkoutRoutes);

export default router;
