import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../config/prisma";

export const salesReport = asyncHandler(async (req: Request, res: Response) => {
  const days = Math.min(365, Math.max(1, parseInt(String(req.query.days ?? "30"), 10) || 30));
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: since }, paymentStatus: "PAID" },
    select: { createdAt: true, totalAmount: true },
  });

  const byDay = new Map<string, number>();
  for (const order of orders) {
    const key = order.createdAt.toISOString().slice(0, 10);
    byDay.set(key, (byDay.get(key) ?? 0) + Number(order.totalAmount));
  }

  const series = Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, revenue]) => ({ date, revenue }));

  res.json({ success: true, data: { series, totalRevenue: orders.reduce((sum, o) => sum + Number(o.totalAmount), 0) } });
});

export const orderStatusReport = asyncHandler(async (_req: Request, res: Response) => {
  const grouped = await prisma.order.groupBy({ by: ["status"], _count: true });
  res.json({ success: true, data: grouped.map((g) => ({ status: g.status, count: g._count })) });
});

export const topProductsReport = asyncHandler(async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    orderBy: { soldCount: "desc" },
    take: 10,
    select: { id: true, name: true, sku: true, soldCount: true, sellingPrice: true, stockQuantity: true },
  });
  res.json({ success: true, data: products });
});

export const inventoryReport = asyncHandler(async (_req: Request, res: Response) => {
  const lowStock = await prisma.$queryRaw<
    { id: string; name: string; sku: string; stockQuantity: number; lowStockThreshold: number }[]
  >`SELECT id, name, sku, stockQuantity, lowStockThreshold FROM Product WHERE deletedAt IS NULL AND stockQuantity <= lowStockThreshold ORDER BY stockQuantity ASC`;

  res.json({ success: true, data: lowStock });
});

export const customersReport = asyncHandler(async (_req: Request, res: Response) => {
  const totalCustomers = await prisma.user.count({ where: { role: "CUSTOMER" } });
  const repeatCustomers = await prisma.user.count({
    where: { role: "CUSTOMER", orders: { some: {} } },
  });
  res.json({ success: true, data: { totalCustomers, repeatCustomers } });
});
