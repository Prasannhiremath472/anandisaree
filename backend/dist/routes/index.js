"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const customer_routes_1 = __importDefault(require("./customer.routes"));
const coupon_routes_1 = __importDefault(require("./coupon.routes"));
const banner_routes_1 = __importDefault(require("./banner.routes"));
const cms_routes_1 = __importDefault(require("./cms.routes"));
const review_routes_1 = __importDefault(require("./review.routes"));
const newsletter_routes_1 = __importDefault(require("./newsletter.routes"));
const report_routes_1 = __importDefault(require("./report.routes"));
const settings_routes_1 = __importDefault(require("./settings.routes"));
const couponClaim_routes_1 = __importDefault(require("./couponClaim.routes"));
const upload_routes_1 = __importDefault(require("./upload.routes"));
const auth_1 = require("../middleware/auth");
const roles_1 = require("../utils/roles");
const asyncHandler_1 = require("../utils/asyncHandler");
const orderService = __importStar(require("../services/order.service"));
const db_1 = require("../config/db");
const router = (0, express_1.Router)();
router.get("/health", (_req, res) => {
    res.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString() } });
});
// TEMPORARY diagnostic endpoint: attempts a real DB query and returns the
// actual error message, since Hostinger's runtime log panel isn't capturing
// application errors. Remove once the DB connection issue is diagnosed.
router.get("/health/db", async (_req, res) => {
    try {
        const [rows] = await db_1.pool.query("SELECT 1 as ok, DATABASE() as db, USER() as dbuser");
        res.json({ success: true, data: rows });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err instanceof Error ? err.message : String(err),
            code: err?.code,
            errno: err?.errno,
        });
    }
});
router.use("/auth", auth_routes_1.default);
router.get("/admin/dashboard", auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const summary = await orderService.getDashboardSummary();
    res.json({ success: true, data: summary });
}));
router.use("/admin/products", product_routes_1.default);
router.use("/admin/orders", order_routes_1.default);
router.use("/admin/customers", customer_routes_1.default);
router.use("/admin/coupons", coupon_routes_1.default);
router.use("/admin/banners", banner_routes_1.default);
router.use("/admin/cms", cms_routes_1.default);
router.use("/admin/reviews", review_routes_1.default);
router.use("/admin/newsletter", newsletter_routes_1.default);
router.use("/admin/reports", report_routes_1.default);
router.use("/admin/settings", settings_routes_1.default);
router.use("/admin/upload", upload_routes_1.default);
router.use("/coupons", couponClaim_routes_1.default);
// Storefront-facing routes (products catalog, cart, checkout) are added in Phase 3.
exports.default = router;
//# sourceMappingURL=index.js.map