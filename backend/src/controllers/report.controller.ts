import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { query, queryOne } from "../config/db";

export const salesReport = asyncHandler(async (req: Request, res: Response) => {
  const days = Math.min(365, Math.max(1, parseInt(String(req.query.days ?? "30"), 10) || 30));
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const orders = await query<{ createdAt: Date; totalAmount: number }>(
    "SELECT createdAt, totalAmount FROM `Order` WHERE createdAt >= ? AND paymentStatus = 'PAID'",
    [since]
  );

  const byDay = new Map<string, number>();
  for (const order of orders) {
    const key = new Date(order.createdAt).toISOString().slice(0, 10);
    byDay.set(key, (byDay.get(key) ?? 0) + Number(order.totalAmount));
  }

  const series = Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, revenue]) => ({ date, revenue }));

  res.json({ success: true, data: { series, totalRevenue: orders.reduce((sum, o) => sum + Number(o.totalAmount), 0) } });
});

export const orderStatusReport = asyncHandler(async (_req: Request, res: Response) => {
  const grouped = await query<{ status: string; count: number }>(
    "SELECT status, COUNT(*) as count FROM `Order` GROUP BY status"
  );
  res.json({ success: true, data: grouped.map((g) => ({ status: g.status, count: g.count })) });
});

export const topProductsReport = asyncHandler(async (_req: Request, res: Response) => {
  const products = await query(
    "SELECT id, name, sku, soldCount, sellingPrice, stockQuantity FROM `Product` WHERE deletedAt IS NULL ORDER BY soldCount DESC LIMIT 10"
  );
  res.json({ success: true, data: products });
});

export const inventoryReport = asyncHandler(async (_req: Request, res: Response) => {
  const lowStock = await query<{
    id: string;
    name: string;
    sku: string;
    stockQuantity: number;
    lowStockThreshold: number;
  }>(
    "SELECT id, name, sku, stockQuantity, lowStockThreshold FROM `Product` WHERE deletedAt IS NULL AND stockQuantity <= lowStockThreshold ORDER BY stockQuantity ASC"
  );

  res.json({ success: true, data: lowStock });
});

export const customersReport = asyncHandler(async (_req: Request, res: Response) => {
  const totalCustomersRow = await queryOne<{ count: number }>(
    "SELECT COUNT(*) as count FROM `User` WHERE role = 'CUSTOMER'"
  );
  const repeatCustomersRow = await queryOne<{ count: number }>(
    "SELECT COUNT(DISTINCT u.id) as count FROM `User` u JOIN `Order` o ON o.userId = u.id WHERE u.role = 'CUSTOMER'"
  );
  res.json({
    success: true,
    data: { totalCustomers: totalCustomersRow?.count ?? 0, repeatCustomers: repeatCustomersRow?.count ?? 0 },
  });
});
