"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customersReport = exports.inventoryReport = exports.topProductsReport = exports.orderStatusReport = exports.salesReport = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const prisma_1 = require("../config/prisma");
exports.salesReport = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const days = Math.min(365, Math.max(1, parseInt(String(req.query.days ?? "30"), 10) || 30));
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const orders = await prisma_1.prisma.order.findMany({
        where: { createdAt: { gte: since }, paymentStatus: "PAID" },
        select: { createdAt: true, totalAmount: true },
    });
    const byDay = new Map();
    for (const order of orders) {
        const key = order.createdAt.toISOString().slice(0, 10);
        byDay.set(key, (byDay.get(key) ?? 0) + Number(order.totalAmount));
    }
    const series = Array.from(byDay.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, revenue]) => ({ date, revenue }));
    res.json({ success: true, data: { series, totalRevenue: orders.reduce((sum, o) => sum + Number(o.totalAmount), 0) } });
});
exports.orderStatusReport = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const grouped = await prisma_1.prisma.order.groupBy({ by: ["status"], _count: true });
    res.json({ success: true, data: grouped.map((g) => ({ status: g.status, count: g._count })) });
});
exports.topProductsReport = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const products = await prisma_1.prisma.product.findMany({
        where: { deletedAt: null },
        orderBy: { soldCount: "desc" },
        take: 10,
        select: { id: true, name: true, sku: true, soldCount: true, sellingPrice: true, stockQuantity: true },
    });
    res.json({ success: true, data: products });
});
exports.inventoryReport = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const lowStock = await prisma_1.prisma.$queryRaw `SELECT id, name, sku, stockQuantity, lowStockThreshold FROM Product WHERE deletedAt IS NULL AND stockQuantity <= lowStockThreshold ORDER BY stockQuantity ASC`;
    res.json({ success: true, data: lowStock });
});
exports.customersReport = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const totalCustomers = await prisma_1.prisma.user.count({ where: { role: "CUSTOMER" } });
    const repeatCustomers = await prisma_1.prisma.user.count({
        where: { role: "CUSTOMER", orders: { some: {} } },
    });
    res.json({ success: true, data: { totalCustomers, repeatCustomers } });
});
//# sourceMappingURL=report.controller.js.map