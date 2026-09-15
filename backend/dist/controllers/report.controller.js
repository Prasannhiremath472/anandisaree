"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customersReport = exports.inventoryReport = exports.topProductsReport = exports.orderStatusReport = exports.exportSalesReport = exports.salesReport = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const db_1 = require("../config/db");
const csv_1 = require("../utils/csv");
exports.salesReport = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const days = Math.min(365, Math.max(1, parseInt(String(req.query.days ?? "30"), 10) || 30));
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;
    const orders = await (0, db_1.query)(`SELECT createdAt, totalAmount FROM \`Order\` o
     WHERE createdAt >= ? AND paymentStatus = 'PAID'
     ${categoryId
        ? `AND EXISTS (
             SELECT 1 FROM \`OrderItem\` oi
             JOIN \`ProductCategory\` pc ON pc.productId = oi.productId
             WHERE oi.orderId = o.id AND pc.categoryId = ?
           )`
        : ""}`, categoryId ? [since, categoryId] : [since]);
    const byDay = new Map();
    for (const order of orders) {
        const key = new Date(order.createdAt).toISOString().slice(0, 10);
        byDay.set(key, (byDay.get(key) ?? 0) + Number(order.totalAmount));
    }
    const series = Array.from(byDay.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, revenue]) => ({ date, revenue }));
    res.json({ success: true, data: { series, totalRevenue: orders.reduce((sum, o) => sum + Number(o.totalAmount), 0) } });
});
exports.exportSalesReport = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const days = Math.min(365, Math.max(1, parseInt(String(req.query.days ?? "30"), 10) || 30));
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;
    const orders = await (0, db_1.query)(`SELECT createdAt, totalAmount FROM \`Order\` o
     WHERE createdAt >= ? AND paymentStatus = 'PAID'
     ${categoryId
        ? `AND EXISTS (
             SELECT 1 FROM \`OrderItem\` oi
             JOIN \`ProductCategory\` pc ON pc.productId = oi.productId
             WHERE oi.orderId = o.id AND pc.categoryId = ?
           )`
        : ""}`, categoryId ? [since, categoryId] : [since]);
    const byDay = new Map();
    for (const order of orders) {
        const key = new Date(order.createdAt).toISOString().slice(0, 10);
        byDay.set(key, (byDay.get(key) ?? 0) + Number(order.totalAmount));
    }
    const series = Array.from(byDay.entries()).sort(([a], [b]) => a.localeCompare(b));
    const headers = ["Date", "Revenue"];
    const rows = series.map(([date, revenue]) => [date, revenue]);
    (0, csv_1.sendCsv)(res, "sales-report.csv", (0, csv_1.toCsv)(headers, rows));
});
exports.orderStatusReport = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const grouped = await (0, db_1.query)("SELECT status, COUNT(*) as count FROM `Order` GROUP BY status");
    res.json({ success: true, data: grouped.map((g) => ({ status: g.status, count: g.count })) });
});
exports.topProductsReport = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;
    const products = await (0, db_1.query)(`SELECT id, name, sku, soldCount, sellingPrice, stockQuantity FROM \`Product\`
     WHERE deletedAt IS NULL
     ${categoryId ? "AND EXISTS (SELECT 1 FROM `ProductCategory` pc WHERE pc.productId = id AND pc.categoryId = ?)" : ""}
     ORDER BY soldCount DESC LIMIT 10`, categoryId ? [categoryId] : []);
    res.json({ success: true, data: products });
});
exports.inventoryReport = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;
    const lowStock = await (0, db_1.query)(`SELECT id, name, sku, stockQuantity, lowStockThreshold FROM \`Product\`
     WHERE deletedAt IS NULL AND stockQuantity <= lowStockThreshold
     ${categoryId ? "AND EXISTS (SELECT 1 FROM `ProductCategory` pc WHERE pc.productId = id AND pc.categoryId = ?)" : ""}
     ORDER BY stockQuantity ASC`, categoryId ? [categoryId] : []);
    res.json({ success: true, data: lowStock });
});
exports.customersReport = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const totalCustomersRow = await (0, db_1.queryOne)("SELECT COUNT(*) as count FROM `User` WHERE role = 'CUSTOMER'");
    const repeatCustomersRow = await (0, db_1.queryOne)(`SELECT COUNT(*) as count FROM (
       SELECT o.userId FROM \`Order\` o
       JOIN \`User\` u ON u.id = o.userId
       WHERE u.role = 'CUSTOMER'
       GROUP BY o.userId
       HAVING COUNT(*) >= 2
     ) as repeat_customers`);
    res.json({
        success: true,
        data: { totalCustomers: totalCustomersRow?.count ?? 0, repeatCustomers: repeatCustomersRow?.count ?? 0 },
    });
});
//# sourceMappingURL=report.controller.js.map