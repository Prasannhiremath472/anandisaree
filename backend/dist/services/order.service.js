"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listOrders = listOrders;
exports.getOrderById = getOrderById;
exports.updateOrderStatus = updateOrderStatus;
exports.getDashboardSummary = getDashboardSummary;
const db_1 = require("../config/db");
const id_1 = require("../utils/id");
const ApiError_1 = require("../utils/ApiError");
const pagination_1 = require("../utils/pagination");
async function listOrders(pagination, filters) {
    const conditions = ["1=1"];
    const params = [];
    if (filters.status) {
        conditions.push("o.status = ?");
        params.push(filters.status);
    }
    if (filters.paymentStatus) {
        conditions.push("o.paymentStatus = ?");
        params.push(filters.paymentStatus);
    }
    if (filters.search) {
        conditions.push("(o.orderNumber LIKE ? OR u.name LIKE ? OR u.email LIKE ?)");
        const like = `%${filters.search}%`;
        params.push(like, like, like);
    }
    const whereClause = conditions.join(" AND ");
    const items = await (0, db_1.query)(`SELECT o.*, u.id as user_id, u.name as user_name, u.email as user_email, u.phone as user_phone
     FROM \`Order\` o JOIN \`User\` u ON u.id = o.userId
     WHERE ${whereClause} ORDER BY o.createdAt DESC LIMIT ? OFFSET ?`, [...params, pagination.take, pagination.skip]);
    const totalRow = await (0, db_1.queryOne)(`SELECT COUNT(*) as count FROM \`Order\` o JOIN \`User\` u ON u.id = o.userId WHERE ${whereClause}`, params);
    const orderIds = items.map((i) => i.id);
    const orderItems = orderIds.length
        ? await (0, db_1.query)(`SELECT * FROM \`OrderItem\` WHERE orderId IN (${orderIds.map(() => "?").join(",")})`, orderIds)
        : [];
    const shaped = items.map((row) => {
        const { user_id, user_name, user_email, user_phone, ...order } = row;
        return {
            ...order,
            user: { id: user_id, name: user_name, email: user_email, phone: user_phone },
            items: orderItems.filter((oi) => oi.orderId === order.id),
        };
    });
    return (0, pagination_1.buildPaginatedResult)(shaped, totalRow?.count ?? 0, pagination);
}
async function getOrderById(id) {
    const row = await (0, db_1.queryOne)(`SELECT o.*, u.id as user_id, u.name as user_name, u.email as user_email, u.phone as user_phone
     FROM \`Order\` o JOIN \`User\` u ON u.id = o.userId
     WHERE o.id = ? LIMIT 1`, [id]);
    if (!row)
        throw ApiError_1.ApiError.notFound("Order not found");
    const { user_id, user_name, user_email, user_phone, ...order } = row;
    const address = await (0, db_1.queryOne)("SELECT * FROM `Address` WHERE id = ? LIMIT 1", [order.addressId]);
    const itemRows = await (0, db_1.query)("SELECT * FROM `OrderItem` WHERE orderId = ?", [id]);
    const productIds = itemRows.map((i) => i.productId);
    const products = productIds.length
        ? await (0, db_1.query)(`SELECT id, name FROM \`Product\` WHERE id IN (${productIds.map(() => "?").join(",")})`, productIds)
        : [];
    const images = productIds.length
        ? await (0, db_1.query)(`SELECT productId, url FROM \`ProductImage\` WHERE productId IN (${productIds.map(() => "?").join(",")}) ORDER BY sortOrder ASC`, productIds)
        : [];
    const items = itemRows.map((item) => ({
        ...item,
        product: {
            name: products.find((p) => p.id === item.productId)?.name ?? null,
            images: images.filter((img) => img.productId === item.productId).slice(0, 1),
        },
    }));
    const statusHistory = await (0, db_1.query)("SELECT * FROM `OrderStatusHistory` WHERE orderId = ? ORDER BY createdAt DESC", [id]);
    const coupon = order.couponId
        ? await (0, db_1.queryOne)("SELECT * FROM `Coupon` WHERE id = ? LIMIT 1", [order.couponId])
        : null;
    const returnRequests = await (0, db_1.query)("SELECT * FROM `ReturnRequest` WHERE orderId = ?", [id]);
    return {
        ...order,
        user: { id: user_id, name: user_name, email: user_email, phone: user_phone },
        address,
        items,
        statusHistory,
        coupon,
        returnRequests,
    };
}
async function updateOrderStatus(id, input, changedById) {
    const order = await (0, db_1.queryOne)("SELECT id FROM `Order` WHERE id = ? LIMIT 1", [id]);
    if (!order)
        throw ApiError_1.ApiError.notFound("Order not found");
    await (0, db_1.withTransaction)(async (conn) => {
        const setClauses = ["status = ?"];
        const params = [input.status];
        if (input.trackingNumber) {
            setClauses.push("trackingNumber = ?");
            params.push(input.trackingNumber);
        }
        if (input.courierName) {
            setClauses.push("courierName = ?");
            params.push(input.courierName);
        }
        await conn.query(`UPDATE \`Order\` SET ${setClauses.join(", ")}, updatedAt = NOW(3) WHERE id = ?`, [
            ...params,
            id,
        ]);
        await conn.query("INSERT INTO `OrderStatusHistory` (id, orderId, status, note, changedById, createdAt) VALUES (?, ?, ?, ?, ?, NOW(3))", [(0, id_1.createId)(), id, input.status, input.note ?? null, changedById ?? null]);
    });
    return (0, db_1.queryOne)("SELECT * FROM `Order` WHERE id = ? LIMIT 1", [id]);
}
async function getDashboardSummary() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const [revenueRow, orderCountRow, customerCountRow, lowStockProducts, recentOrdersRows, topProducts] = await Promise.all([
        (0, db_1.queryOne)("SELECT SUM(totalAmount) as total FROM `Order` WHERE createdAt >= ? AND paymentStatus = 'PAID'", [thirtyDaysAgo]),
        (0, db_1.queryOne)("SELECT COUNT(*) as count FROM `Order` WHERE createdAt >= ?", [thirtyDaysAgo]),
        (0, db_1.queryOne)("SELECT COUNT(*) as count FROM `User` WHERE role = 'CUSTOMER' AND createdAt >= ?", [thirtyDaysAgo]),
        (0, db_1.query)("SELECT id FROM `Product` WHERE deletedAt IS NULL AND stockQuantity <= lowStockThreshold"),
        (0, db_1.query)(`SELECT o.*, u.name as user_name FROM \`Order\` o JOIN \`User\` u ON u.id = o.userId
         ORDER BY o.createdAt DESC LIMIT 5`),
        (0, db_1.query)("SELECT id, name, soldCount, sellingPrice FROM `Product` WHERE deletedAt IS NULL ORDER BY soldCount DESC LIMIT 5"),
    ]);
    const recentOrders = recentOrdersRows.map((row) => {
        const { user_name, ...order } = row;
        return { ...order, user: { name: user_name } };
    });
    return {
        revenue30d: revenueRow?.total ?? 0,
        orders30d: orderCountRow?.count ?? 0,
        newCustomers30d: customerCountRow?.count ?? 0,
        lowStockCount: lowStockProducts.length,
        recentOrders,
        topProducts,
    };
}
//# sourceMappingURL=order.service.js.map