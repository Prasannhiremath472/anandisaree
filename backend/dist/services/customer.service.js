"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCustomers = listCustomers;
exports.getCustomerById = getCustomerById;
exports.setCustomerStatus = setCustomerStatus;
const db_1 = require("../config/db");
const ApiError_1 = require("../utils/ApiError");
const pagination_1 = require("../utils/pagination");
async function listCustomers(pagination, filters) {
    const conditions = ["role = 'CUSTOMER'", "deletedAt IS NULL"];
    const params = [];
    if (filters.isActive !== undefined) {
        conditions.push("isActive = ?");
        params.push(filters.isActive);
    }
    if (filters.search) {
        conditions.push("(name LIKE ? OR email LIKE ? OR phone LIKE ?)");
        const like = `%${filters.search}%`;
        params.push(like, like, like);
    }
    const whereClause = conditions.join(" AND ");
    const rows = await (0, db_1.query)(`SELECT id, name, email, phone, isActive, isEmailVerified, createdAt FROM \`User\`
     WHERE ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`, [...params, pagination.take, pagination.skip]);
    const totalRow = await (0, db_1.queryOne)(`SELECT COUNT(*) as count FROM \`User\` WHERE ${whereClause}`, params);
    const userIds = rows.map((r) => r.id);
    const orderCounts = userIds.length
        ? await (0, db_1.query)(`SELECT userId, COUNT(*) as count FROM \`Order\` WHERE userId IN (${userIds.map(() => "?").join(",")}) GROUP BY userId`, userIds)
        : [];
    const items = rows.map((row) => ({
        ...row,
        _count: { orders: orderCounts.find((o) => o.userId === row.id)?.count ?? 0 },
    }));
    return (0, pagination_1.buildPaginatedResult)(items, totalRow?.count ?? 0, pagination);
}
async function getCustomerById(id) {
    const customer = await (0, db_1.queryOne)("SELECT * FROM `User` WHERE id = ? AND role = 'CUSTOMER' AND deletedAt IS NULL LIMIT 1", [id]);
    if (!customer)
        throw ApiError_1.ApiError.notFound("Customer not found");
    const addresses = await (0, db_1.query)("SELECT * FROM `Address` WHERE userId = ?", [id]);
    const orders = await (0, db_1.query)("SELECT * FROM `Order` WHERE userId = ? ORDER BY createdAt DESC LIMIT 10", [id]);
    const wallet = await (0, db_1.queryOne)("SELECT * FROM `Wallet` WHERE userId = ? LIMIT 1", [id]);
    const orderCountRow = await (0, db_1.queryOne)("SELECT COUNT(*) as count FROM `Order` WHERE userId = ?", [id]);
    const reviewCountRow = await (0, db_1.queryOne)("SELECT COUNT(*) as count FROM `Review` WHERE userId = ?", [id]);
    const wishlistCountRow = await (0, db_1.queryOne)("SELECT COUNT(*) as count FROM `WishlistItem` WHERE userId = ?", [id]);
    const { passwordHash, ...safe } = customer;
    return {
        ...safe,
        addresses,
        orders,
        wallet,
        _count: {
            orders: orderCountRow?.count ?? 0,
            reviews: reviewCountRow?.count ?? 0,
            wishlist: wishlistCountRow?.count ?? 0,
        },
    };
}
async function setCustomerStatus(id, isActive) {
    const customer = await (0, db_1.queryOne)("SELECT id FROM `User` WHERE id = ? AND role = 'CUSTOMER' LIMIT 1", [id]);
    if (!customer)
        throw ApiError_1.ApiError.notFound("Customer not found");
    await (0, db_1.execute)("UPDATE `User` SET isActive = ?, updatedAt = NOW(3) WHERE id = ?", [isActive, id]);
    return (0, db_1.queryOne)("SELECT * FROM `User` WHERE id = ? LIMIT 1", [id]);
}
//# sourceMappingURL=customer.service.js.map