"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = createNotification;
exports.listNotifications = listNotifications;
exports.markNotificationRead = markNotificationRead;
exports.markAllNotificationsRead = markAllNotificationsRead;
exports.checkLowStockAndNotify = checkLowStockAndNotify;
const db_1 = require("../config/db");
const id_1 = require("../utils/id");
async function createNotification(type, message, link) {
    await (0, db_1.execute)("INSERT INTO `Notification` (id, type, message, link, isRead, createdAt) VALUES (?, ?, ?, ?, 0, NOW(3))", [(0, id_1.createId)(), type, message, link ?? null]);
}
async function listNotifications(limit = 20) {
    const items = await (0, db_1.query)("SELECT * FROM `Notification` ORDER BY createdAt DESC LIMIT ?", [limit]);
    const unreadRow = await (0, db_1.queryOne)("SELECT COUNT(*) as count FROM `Notification` WHERE isRead = 0");
    return { items, unreadCount: unreadRow?.count ?? 0 };
}
async function markNotificationRead(id) {
    await (0, db_1.execute)("UPDATE `Notification` SET isRead = 1 WHERE id = ?", [id]);
}
async function markAllNotificationsRead() {
    await (0, db_1.execute)("UPDATE `Notification` SET isRead = 1 WHERE isRead = 0");
}
/** Fires a LOW_STOCK notification if the product just crossed at/under its low-stock threshold. */
async function checkLowStockAndNotify(productId) {
    const product = await (0, db_1.queryOne)("SELECT name, stockQuantity, lowStockThreshold FROM `Product` WHERE id = ?", [productId]);
    if (!product || product.stockQuantity > product.lowStockThreshold)
        return;
    await createNotification("LOW_STOCK", `${product.name} is low on stock (${product.stockQuantity} left)`, `/products`);
}
//# sourceMappingURL=notification.service.js.map