import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { buildPaginatedResult, PaginationParams } from "../utils/pagination";
import type { OrderStatusUpdateInput } from "../validation/order.schema";

interface ListFilters {
  search?: string;
  status?: string;
  paymentStatus?: string;
}

export async function listOrders(pagination: PaginationParams, filters: ListFilters) {
  const where: Prisma.OrderWhereInput = {
    ...(filters.status ? { status: filters.status as Prisma.EnumOrderStatusFilter["equals"] } : {}),
    ...(filters.paymentStatus ? { paymentStatus: filters.paymentStatus as Prisma.EnumPaymentStatusFilter["equals"] } : {}),
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
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.take,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: true,
      },
    }),
    prisma.order.count({ where }),
  ]);

  return buildPaginatedResult(items, total, pagination);
}

export async function getOrderById(id: string) {
  const order = await prisma.order.findUnique({
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

  if (!order) throw ApiError.notFound("Order not found");
  return order;
}

export async function updateOrderStatus(id: string, input: OrderStatusUpdateInput, changedById?: string) {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw ApiError.notFound("Order not found");

  const updated = await prisma.$transaction(async (tx) => {
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

export async function getDashboardSummary() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [revenueAgg, orderCount, customerCount, lowStockProducts, recentOrders, topProducts] = await Promise.all([
    prisma.order.aggregate({
      where: { createdAt: { gte: thirtyDaysAgo }, paymentStatus: "PAID" },
      _sum: { totalAmount: true },
    }),
    prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({ where: { role: "CUSTOMER", createdAt: { gte: thirtyDaysAgo } } }),
    prisma.$queryRaw<
      { id: string }[]
    >`SELECT id FROM Product WHERE deletedAt IS NULL AND stockQuantity <= lowStockThreshold`,
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { name: true } } },
    }),
    prisma.product.findMany({
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
