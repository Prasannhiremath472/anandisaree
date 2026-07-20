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
import { authenticate, authorize } from "../middleware/auth";
import { ADMIN_ROLES } from "../utils/roles";
import { asyncHandler } from "../utils/asyncHandler";
import * as orderService from "../services/order.service";
import { pool } from "../config/db";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString() } });
});

// TEMPORARY diagnostic endpoint: attempts a real DB query and returns the
// actual error message, since Hostinger's runtime log panel isn't capturing
// application errors. Remove once the DB connection issue is diagnosed.
router.get("/health/db", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 as ok, DATABASE() as db, USER() as dbuser");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : String(err),
      code: (err as { code?: string })?.code,
      errno: (err as { errno?: number })?.errno,
    });
  }
});

router.use("/auth", authRoutes);

router.get(
  "/admin/dashboard",
  authenticate,
  authorize(...ADMIN_ROLES),
  asyncHandler(async (_req, res) => {
    const summary = await orderService.getDashboardSummary();
    res.json({ success: true, data: summary });
  })
);

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

router.use("/coupons", couponClaimRoutes);

// Storefront-facing routes (products catalog, cart, checkout) are added in Phase 3.

export default router;
