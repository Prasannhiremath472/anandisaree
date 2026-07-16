import { query, queryOne, withTransaction, QueryParams } from "../config/db";
import { createId } from "../utils/id";
import { ApiError } from "../utils/ApiError";
import { buildPaginatedResult, PaginationParams } from "../utils/pagination";
import type { OrderStatusUpdateInput } from "../validation/order.schema";

interface ListFilters {
  search?: string;
  status?: string;
  paymentStatus?: string;
}

export async function listOrders(pagination: PaginationParams, filters: ListFilters) {
  const conditions: string[] = ["1=1"];
  const params: QueryParams = [];

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

  const items = await query<Record<string, unknown>>(
    `SELECT o.*, u.id as user_id, u.name as user_name, u.email as user_email, u.phone as user_phone
     FROM \`Order\` o JOIN \`User\` u ON u.id = o.userId
     WHERE ${whereClause} ORDER BY o.createdAt DESC LIMIT ? OFFSET ?`,
    [...params, pagination.take, pagination.skip]
  );
  const totalRow = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM \`Order\` o JOIN \`User\` u ON u.id = o.userId WHERE ${whereClause}`,
    params
  );

  const orderIds = items.map((i) => i.id as string);
  const orderItems = orderIds.length
    ? await query<Record<string, unknown>>(
        `SELECT * FROM \`OrderItem\` WHERE orderId IN (${orderIds.map(() => "?").join(",")})`,
        orderIds
      )
    : [];

  const shaped = items.map((row) => {
    const { user_id, user_name, user_email, user_phone, ...order } = row;
    return {
      ...order,
      user: { id: user_id, name: user_name, email: user_email, phone: user_phone },
      items: orderItems.filter((oi) => oi.orderId === order.id),
    };
  });

  return buildPaginatedResult(shaped, totalRow?.count ?? 0, pagination);
}

export async function getOrderById(id: string) {
  const row = await queryOne<Record<string, unknown>>(
    `SELECT o.*, u.id as user_id, u.name as user_name, u.email as user_email, u.phone as user_phone
     FROM \`Order\` o JOIN \`User\` u ON u.id = o.userId
     WHERE o.id = ? LIMIT 1`,
    [id]
  );
  if (!row) throw ApiError.notFound("Order not found");

  const { user_id, user_name, user_email, user_phone, ...order } = row;

  const address = await queryOne("SELECT * FROM `Address` WHERE id = ? LIMIT 1", [order.addressId as string]);

  const itemRows = await query<Record<string, unknown>>("SELECT * FROM `OrderItem` WHERE orderId = ?", [id]);
  const productIds = itemRows.map((i) => i.productId as string);
  const products = productIds.length
    ? await query<{ id: string; name: string }>(
        `SELECT id, name FROM \`Product\` WHERE id IN (${productIds.map(() => "?").join(",")})`,
        productIds
      )
    : [];
  const images = productIds.length
    ? await query<{ productId: string; url: string }>(
        `SELECT productId, url FROM \`ProductImage\` WHERE productId IN (${productIds.map(() => "?").join(",")}) ORDER BY sortOrder ASC`,
        productIds
      )
    : [];
  const items = itemRows.map((item) => ({
    ...item,
    product: {
      name: products.find((p) => p.id === item.productId)?.name ?? null,
      images: images.filter((img) => img.productId === item.productId).slice(0, 1),
    },
  }));

  const statusHistory = await query(
    "SELECT * FROM `OrderStatusHistory` WHERE orderId = ? ORDER BY createdAt DESC",
    [id]
  );
  const coupon = order.couponId
    ? await queryOne("SELECT * FROM `Coupon` WHERE id = ? LIMIT 1", [order.couponId as string])
    : null;
  const returnRequests = await query("SELECT * FROM `ReturnRequest` WHERE orderId = ?", [id]);

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

export async function updateOrderStatus(id: string, input: OrderStatusUpdateInput, changedById?: string) {
  const order = await queryOne("SELECT id FROM `Order` WHERE id = ? LIMIT 1", [id]);
  if (!order) throw ApiError.notFound("Order not found");

  await withTransaction(async (conn) => {
    const setClauses = ["status = ?"];
    const params: QueryParams = [input.status];
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

    await conn.query(
      "INSERT INTO `OrderStatusHistory` (id, orderId, status, note, changedById, createdAt) VALUES (?, ?, ?, ?, ?, NOW(3))",
      [createId(), id, input.status, input.note ?? null, changedById ?? null]
    );
  });

  return queryOne("SELECT * FROM `Order` WHERE id = ? LIMIT 1", [id]);
}

export async function getDashboardSummary() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [revenueRow, orderCountRow, customerCountRow, lowStockProducts, recentOrdersRows, topProducts] =
    await Promise.all([
      queryOne<{ total: number | null }>(
        "SELECT SUM(totalAmount) as total FROM `Order` WHERE createdAt >= ? AND paymentStatus = 'PAID'",
        [thirtyDaysAgo]
      ),
      queryOne<{ count: number }>("SELECT COUNT(*) as count FROM `Order` WHERE createdAt >= ?", [thirtyDaysAgo]),
      queryOne<{ count: number }>(
        "SELECT COUNT(*) as count FROM `User` WHERE role = 'CUSTOMER' AND createdAt >= ?",
        [thirtyDaysAgo]
      ),
      query<{ id: string }>(
        "SELECT id FROM `Product` WHERE deletedAt IS NULL AND stockQuantity <= lowStockThreshold"
      ),
      query<Record<string, unknown>>(
        `SELECT o.*, u.name as user_name FROM \`Order\` o JOIN \`User\` u ON u.id = o.userId
         ORDER BY o.createdAt DESC LIMIT 5`
      ),
      query<{ id: string; name: string; soldCount: number; sellingPrice: number }>(
        "SELECT id, name, soldCount, sellingPrice FROM `Product` WHERE deletedAt IS NULL ORDER BY soldCount DESC LIMIT 5"
      ),
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
