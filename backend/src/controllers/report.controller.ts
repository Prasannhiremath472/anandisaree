import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { query, queryOne } from "../config/db";
import { toCsv, sendCsv } from "../utils/csv";

export const salesReport = asyncHandler(async (req: Request, res: Response) => {
  const days = Math.min(365, Math.max(1, parseInt(String(req.query.days ?? "30"), 10) || 30));
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;

  const orders = await query<{ createdAt: Date; totalAmount: number }>(
    `SELECT createdAt, totalAmount FROM \`Order\` o
     WHERE createdAt >= ? AND paymentStatus = 'PAID'
     ${
       categoryId
         ? `AND EXISTS (
             SELECT 1 FROM \`OrderItem\` oi
             JOIN \`ProductCategory\` pc ON pc.productId = oi.productId
             WHERE oi.orderId = o.id AND pc.categoryId = ?
           )`
         : ""
     }`,
    categoryId ? [since, categoryId] : [since]
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

export const exportSalesReport = asyncHandler(async (req: Request, res: Response) => {
  const days = Math.min(365, Math.max(1, parseInt(String(req.query.days ?? "30"), 10) || 30));
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;

  const orders = await query<{ createdAt: Date; totalAmount: number }>(
    `SELECT createdAt, totalAmount FROM \`Order\` o
     WHERE createdAt >= ? AND paymentStatus = 'PAID'
     ${
       categoryId
         ? `AND EXISTS (
             SELECT 1 FROM \`OrderItem\` oi
             JOIN \`ProductCategory\` pc ON pc.productId = oi.productId
             WHERE oi.orderId = o.id AND pc.categoryId = ?
           )`
         : ""
     }`,
    categoryId ? [since, categoryId] : [since]
  );

  const byDay = new Map<string, number>();
  for (const order of orders) {
    const key = new Date(order.createdAt).toISOString().slice(0, 10);
    byDay.set(key, (byDay.get(key) ?? 0) + Number(order.totalAmount));
  }
  const series = Array.from(byDay.entries()).sort(([a], [b]) => a.localeCompare(b));

  const headers = ["Date", "Revenue"];
  const rows = series.map(([date, revenue]) => [date, revenue]);

  sendCsv(res, "sales-report.csv", toCsv(headers, rows));
});

export const orderStatusReport = asyncHandler(async (_req: Request, res: Response) => {
  const grouped = await query<{ status: string; count: number }>(
    "SELECT status, COUNT(*) as count FROM `Order` GROUP BY status"
  );
  res.json({ success: true, data: grouped.map((g) => ({ status: g.status, count: g.count })) });
});

export const topProductsReport = asyncHandler(async (req: Request, res: Response) => {
  const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;
  const products = await query(
    `SELECT id, name, sku, soldCount, sellingPrice, stockQuantity FROM \`Product\`
     WHERE deletedAt IS NULL
     ${categoryId ? "AND EXISTS (SELECT 1 FROM `ProductCategory` pc WHERE pc.productId = id AND pc.categoryId = ?)" : ""}
     ORDER BY soldCount DESC LIMIT 10`,
    categoryId ? [categoryId] : []
  );
  res.json({ success: true, data: products });
});

export const inventoryReport = asyncHandler(async (req: Request, res: Response) => {
  const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;
  const lowStock = await query<{
    id: string;
    name: string;
    sku: string;
    stockQuantity: number;
    lowStockThreshold: number;
  }>(
    `SELECT id, name, sku, stockQuantity, lowStockThreshold FROM \`Product\`
     WHERE deletedAt IS NULL AND stockQuantity <= lowStockThreshold
     ${categoryId ? "AND EXISTS (SELECT 1 FROM `ProductCategory` pc WHERE pc.productId = id AND pc.categoryId = ?)" : ""}
     ORDER BY stockQuantity ASC`,
    categoryId ? [categoryId] : []
  );

  res.json({ success: true, data: lowStock });
});

export const customersReport = asyncHandler(async (_req: Request, res: Response) => {
  const totalCustomersRow = await queryOne<{ count: number }>(
    "SELECT COUNT(*) as count FROM `User` WHERE role = 'CUSTOMER'"
  );
  const repeatCustomersRow = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM (
       SELECT o.userId FROM \`Order\` o
       JOIN \`User\` u ON u.id = o.userId
       WHERE u.role = 'CUSTOMER'
       GROUP BY o.userId
       HAVING COUNT(*) >= 2
     ) as repeat_customers`
  );
  res.json({
    success: true,
    data: { totalCustomers: totalCustomersRow?.count ?? 0, repeatCustomers: repeatCustomersRow?.count ?? 0 },
  });
});
