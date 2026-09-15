import { query, queryOne, withTransaction, QueryParams } from "../config/db";
import { createId } from "../utils/id";
import { ApiError } from "../utils/ApiError";
import { buildPaginatedResult, PaginationParams } from "../utils/pagination";
import type { AdminCreateOrderInput, OrderStatusUpdateInput } from "../validation/order.schema";
import { priceOrderItems } from "./checkout.service";
import { checkLowStockAndNotify } from "./notification.service";

function generateOrderNumber() {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AS${stamp}${rand}`;
}

interface ListFilters {
  search?: string;
  status?: string;
  paymentStatus?: string;
  categoryId?: string;
}

function buildOrderListWhere(filters: ListFilters): { whereClause: string; params: QueryParams } {
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
  if (filters.categoryId) {
    conditions.push(
      `EXISTS (
        SELECT 1 FROM \`OrderItem\` oi
        JOIN \`ProductCategory\` pc ON pc.productId = oi.productId
        WHERE oi.orderId = o.id AND pc.categoryId = ?
      )`
    );
    params.push(filters.categoryId);
  }

  return { whereClause: conditions.join(" AND "), params };
}

export async function listOrders(pagination: PaginationParams, filters: ListFilters) {
  const { whereClause, params } = buildOrderListWhere(filters);

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

export async function listAllOrdersForExport(filters: ListFilters) {
  const { whereClause, params } = buildOrderListWhere(filters);

  return query<Record<string, unknown>>(
    `SELECT o.orderNumber, o.status, o.paymentMethod, o.paymentStatus, o.totalAmount, o.createdAt,
            u.name as customerName, u.email as customerEmail, u.phone as customerPhone
     FROM \`Order\` o JOIN \`User\` u ON u.id = o.userId
     WHERE ${whereClause} ORDER BY o.createdAt DESC`,
    params
  );
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

export async function getDashboardSummary(categoryId?: string) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const orderCategoryExists = categoryId
    ? `EXISTS (
        SELECT 1 FROM \`OrderItem\` oi
        JOIN \`ProductCategory\` pc ON pc.productId = oi.productId
        WHERE oi.orderId = o.id AND pc.categoryId = ?
      )`
    : null;
  const productCategoryExists = categoryId
    ? `EXISTS (SELECT 1 FROM \`ProductCategory\` pc WHERE pc.productId = id AND pc.categoryId = ?)`
    : null;

  const [revenueRow, orderCountRow, customerCountRow, lowStockProducts, recentOrdersRows, topProducts] =
    await Promise.all([
      queryOne<{ total: number | null }>(
        `SELECT SUM(totalAmount) as total FROM \`Order\` o
         WHERE createdAt >= ? AND paymentStatus = 'PAID' ${orderCategoryExists ? `AND ${orderCategoryExists}` : ""}`,
        categoryId ? [thirtyDaysAgo, categoryId] : [thirtyDaysAgo]
      ),
      queryOne<{ count: number }>(
        `SELECT COUNT(*) as count FROM \`Order\` o WHERE createdAt >= ? ${orderCategoryExists ? `AND ${orderCategoryExists}` : ""}`,
        categoryId ? [thirtyDaysAgo, categoryId] : [thirtyDaysAgo]
      ),
      // Not category-scoped: a "new customer" isn't tied to any single category.
      queryOne<{ count: number }>(
        "SELECT COUNT(*) as count FROM `User` WHERE role = 'CUSTOMER' AND createdAt >= ?",
        [thirtyDaysAgo]
      ),
      query<{ id: string }>(
        `SELECT id FROM \`Product\` WHERE deletedAt IS NULL AND stockQuantity <= lowStockThreshold ${productCategoryExists ? `AND ${productCategoryExists}` : ""}`,
        categoryId ? [categoryId] : []
      ),
      query<Record<string, unknown>>(
        `SELECT o.*, u.name as user_name FROM \`Order\` o JOIN \`User\` u ON u.id = o.userId
         ${orderCategoryExists ? `WHERE ${orderCategoryExists}` : ""}
         ORDER BY o.createdAt DESC LIMIT 5`,
        categoryId ? [categoryId] : []
      ),
      query<{ id: string; name: string; soldCount: number; sellingPrice: number }>(
        `SELECT id, name, soldCount, sellingPrice FROM \`Product\` WHERE deletedAt IS NULL ${productCategoryExists ? `AND ${productCategoryExists}` : ""} ORDER BY soldCount DESC LIMIT 5`,
        categoryId ? [categoryId] : []
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

/**
 * Admin-initiated order (phone/walk-in sale entered directly by staff).
 * Mirrors checkout.service.ts's createOrder — same pricing/stock-decrement
 * logic — but is userId-agnostic: it accepts either an existing customer
 * (userId + addressId) or inline new-customer details, and never touches
 * Razorpay (payment is assumed already collected or COD).
 */
export async function createAdminOrder(input: AdminCreateOrderInput, createdById?: string) {
  let userId = input.userId;
  let addressId = input.addressId;
  let createdOrderId = "";

  await withTransaction(async (conn) => {
    if (!userId && input.newCustomer) {
      const { name, phone, email, address } = input.newCustomer;

      const [existingByPhoneRows] = await conn.query("SELECT id FROM `User` WHERE phone = ? LIMIT 1", [phone]);
      const existingByPhone = (existingByPhoneRows as { id: string }[])[0];
      if (existingByPhone) {
        userId = existingByPhone.id;
      } else {
        userId = createId();
        const walkInEmail = email && email.length > 0 ? email : `${phone}@walkin.anandisarees.com`;
        await conn.query(
          "INSERT INTO `User` (id, name, email, phone, role, isEmailVerified, isPhoneVerified, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, 'CUSTOMER', 0, 0, 1, NOW(3), NOW(3))",
          [userId, name, walkInEmail, phone]
        );
        await conn.query("INSERT INTO `Wallet` (id, userId, updatedAt) VALUES (?, ?, NOW(3))", [createId(), userId]);
      }

      addressId = createId();
      await conn.query(
        `INSERT INTO \`Address\`
          (id, userId, type, fullName, phone, line1, line2, landmark, city, district, state, pincode, country, isDefault, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'India', 1, NOW(3), NOW(3))`,
        [
          addressId,
          userId,
          address.type ?? "HOME",
          address.fullName,
          address.phone,
          address.line1,
          address.line2 ?? null,
          address.landmark ?? null,
          address.city,
          address.district ?? null,
          address.state,
          address.pincode,
        ]
      );
    }

    if (!userId || !addressId) {
      throw ApiError.badRequest("A customer and address are required");
    }

    const [addressRows] = await conn.query("SELECT id FROM `Address` WHERE id = ? AND userId = ?", [addressId, userId]);
    if ((addressRows as { id: string }[]).length === 0) throw ApiError.badRequest("Address not found for this customer");

    const pricedItems = await priceOrderItems(input.items);
    const subtotal = pricedItems.reduce((sum, i) => sum + i.totalPrice, 0);
    const totalAmount = subtotal;
    const orderId = createId();
    const orderNumber = generateOrderNumber();
    const paymentStatus = input.paymentStatus ?? "PENDING";

    await conn.query(
      `INSERT INTO \`Order\`
        (id, orderNumber, userId, addressId, status, paymentMethod, paymentStatus, subtotal, discountAmount, taxAmount, shippingAmount, totalAmount, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, 'PENDING', ?, ?, ?, 0, 0, 0, ?, NOW(3), NOW(3))`,
      [orderId, orderNumber, userId, addressId, input.paymentMethod, paymentStatus, subtotal, totalAmount]
    );

    for (const item of pricedItems) {
      await conn.query(
        `INSERT INTO \`OrderItem\` (id, orderId, productId, variantId, productName, sku, quantity, unitPrice, totalPrice)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [createId(), orderId, item.productId, item.variantId, item.productName, item.sku, item.quantity, item.unitPrice, item.totalPrice]
      );

      if (item.variantId) {
        await conn.query("UPDATE `ProductVariant` SET stockQuantity = stockQuantity - ? WHERE id = ?", [
          item.quantity,
          item.variantId,
        ]);
      } else {
        await conn.query("UPDATE `Product` SET stockQuantity = stockQuantity - ? WHERE id = ?", [
          item.quantity,
          item.productId,
        ]);
      }
    }

    await conn.query(
      "INSERT INTO `OrderStatusHistory` (id, orderId, status, note, changedById, createdAt) VALUES (?, ?, 'PENDING', 'Order created by admin', ?, NOW(3))",
      [createId(), orderId, createdById ?? null]
    );

    createdOrderId = orderId;
  });

  const uniqueProductIds = [...new Set(input.items.map((i) => i.productId))];
  for (const productId of uniqueProductIds) {
    await checkLowStockAndNotify(productId);
  }

  return getOrderById(createdOrderId);
}
