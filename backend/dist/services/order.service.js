"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listOrders = listOrders;
exports.getOrderById = getOrderById;
exports.updateOrderStatus = updateOrderStatus;
exports.getDashboardSummary = getDashboardSummary;
const prisma_1 = require("../config/prisma");
const ApiError_1 = require("../utils/ApiError");
const pagination_1 = require("../utils/pagination");
async function listOrders(pagination, filters) {
    const where = {
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.paymentStatus ? { paymentStatus: filters.paymentStatus } : {}),
        ...(filters.search
            ? {
                OR: [
                    { orderNumber: { contains: filters.search } },
                    { user: { name: { contains: filters.search } } },
                    { user: { email: { contains: filters.search } } },
                ],
            }
            : {}),
    };
    const [items, total] = await Promise.all([
        prisma_1.prisma.order.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: pagination.skip,
            take: pagination.take,
            include: {
                user: { select: { id: true, name: true, email: true, phone: true } },
                items: true,
            },
        }),
        prisma_1.prisma.order.count({ where }),
    ]);
    return (0, pagination_1.buildPaginatedResult)(items, total, pagination);
}
async function getOrderById(id) {
    const order = await prisma_1.prisma.order.findUnique({
        where: { id },
        include: {
            user: { select: { id: true, name: true, email: true, phone: true } },
            address: true,
            items: { include: { product: { select: { name: true, images: { take: 1 } } } } },
            statusHistory: { orderBy: { createdAt: "desc" } },
            coupon: true,
            returnRequests: true,
        },
    });
    if (!order)
        throw ApiError_1.ApiError.notFound("Order not found");
    return order;
}
async function updateOrderStatus(id, input, changedById) {
    const order = await prisma_1.prisma.order.findUnique({ where: { id } });
    if (!order)
        throw ApiError_1.ApiError.notFound("Order not found");
    const updated = await prisma_1.prisma.$transaction(async (tx) => {
        const result = await tx.order.update({
            where: { id },
            data: {
                status: input.status,
                ...(input.trackingNumber ? { trackingNumber: input.trackingNumber } : {}),
                ...(input.courierName ? { courierName: input.courierName } : {}),
            },
        });
        await tx.orderStatusHistory.create({
            data: { orderId: id, status: input.status, note: input.note, changedById },
        });
        return result;
    });
    return updated;
}
async function getDashboardSummary() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const [revenueAgg, orderCount, customerCount, lowStockProducts, recentOrders, topProducts] = await Promise.all([
        prisma_1.prisma.order.aggregate({
            where: { createdAt: { gte: thirtyDaysAgo }, paymentStatus: "PAID" },
            _sum: { totalAmount: true },
        }),
        prisma_1.prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        prisma_1.prisma.user.count({ where: { role: "CUSTOMER", createdAt: { gte: thirtyDaysAgo } } }),
        prisma_1.prisma.$queryRaw `SELECT id FROM Product WHERE deletedAt IS NULL AND stockQuantity <= lowStockThreshold`,
        prisma_1.prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { user: { select: { name: true } } },
        }),
        prisma_1.prisma.product.findMany({
            where: { deletedAt: null },
            orderBy: { soldCount: "desc" },
            take: 5,
            select: { id: true, name: true, soldCount: true, sellingPrice: true },
        }),
    ]);
    const lowStockCount = lowStockProducts.length;
    return {
        revenue30d: revenueAgg._sum.totalAmount ?? 0,
        orders30d: orderCount,
        newCustomers30d: customerCount,
        lowStockCount,
        recentOrders,
        topProducts,
    };
}
//# sourceMappingURL=order.service.js.map