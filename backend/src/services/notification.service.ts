import { query, queryOne, execute } from "../config/db";
import { createId } from "../utils/id";

export type NotificationType = "ORDER" | "LOW_STOCK" | "REVIEW";

export async function createNotification(type: NotificationType, message: string, link?: string) {
  await execute(
    "INSERT INTO `Notification` (id, type, message, link, isRead, createdAt) VALUES (?, ?, ?, ?, 0, NOW(3))",
    [createId(), type, message, link ?? null]
  );
}

export async function listNotifications(limit = 20) {
  const items = await query(
    "SELECT * FROM `Notification` ORDER BY createdAt DESC LIMIT ?",
    [limit]
  );
  const unreadRow = await queryOne<{ count: number }>(
    "SELECT COUNT(*) as count FROM `Notification` WHERE isRead = 0"
  );
  return { items, unreadCount: unreadRow?.count ?? 0 };
}

export async function markNotificationRead(id: string) {
  await execute("UPDATE `Notification` SET isRead = 1 WHERE id = ?", [id]);
}

export async function markAllNotificationsRead() {
  await execute("UPDATE `Notification` SET isRead = 1 WHERE isRead = 0");
}

/** Fires a LOW_STOCK notification if the product just crossed at/under its low-stock threshold. */
export async function checkLowStockAndNotify(productId: string) {
  const product = await queryOne<{ name: string; stockQuantity: number; lowStockThreshold: number }>(
    "SELECT name, stockQuantity, lowStockThreshold FROM `Product` WHERE id = ?",
    [productId]
  );
  if (!product || product.stockQuantity > product.lowStockThreshold) return;

  await createNotification("LOW_STOCK", `${product.name} is low on stock (${product.stockQuantity} left)`, `/products`);
}
