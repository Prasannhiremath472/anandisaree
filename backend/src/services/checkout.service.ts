import { query, queryOne, withTransaction } from "../config/db";
import { createId } from "../utils/id";
import { ApiError } from "../utils/ApiError";
import type { AddressInput, CreateOrderInput } from "../validation/checkout.schema";
import { createRazorpayOrder, verifyRazorpaySignature } from "./razorpay.service";

export async function listAddresses(userId: string) {
  return query<Record<string, unknown>>(
    "SELECT * FROM `Address` WHERE userId = ? ORDER BY isDefault DESC, createdAt DESC",
    [userId]
  );
}

export async function createAddress(userId: string, input: AddressInput) {
  const id = createId();
  if (input.isDefault) {
    await query("UPDATE `Address` SET isDefault = 0 WHERE userId = ?", [userId]);
  }
  await query(
    `INSERT INTO \`Address\`
      (id, userId, type, fullName, phone, line1, line2, landmark, city, district, state, pincode, country, isDefault, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'India', ?, NOW(3), NOW(3))`,
    [
      id,
      userId,
      input.type ?? "HOME",
      input.fullName,
      input.phone,
      input.line1,
      input.line2 ?? null,
      input.landmark ?? null,
      input.city,
      input.district ?? null,
      input.state,
      input.pincode,
      input.isDefault ?? false,
    ]
  );
  return queryOne<Record<string, unknown>>("SELECT * FROM `Address` WHERE id = ?", [id]);
}

function generateOrderNumber() {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AS${stamp}${rand}`;
}

async function priceOrderItems(items: CreateOrderInput["items"]) {
  const priced: {
    productId: string;
    variantId: string | null;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[] = [];

  for (const item of items) {
    const product = await queryOne<Record<string, unknown>>(
      "SELECT id, name, sku, sellingPrice, stockQuantity FROM `Product` WHERE id = ? AND deletedAt IS NULL",
      [item.productId]
    );
    if (!product) throw ApiError.badRequest(`Product ${item.productId} not found`);

    let unitPrice = Number(product.sellingPrice);
    let availableStock = Number(product.stockQuantity);

    if (item.variantId) {
      const variant = await queryOne<Record<string, unknown>>(
        "SELECT id, priceDelta, stockQuantity, isActive FROM `ProductVariant` WHERE id = ? AND productId = ?",
        [item.variantId, item.productId]
      );
      if (!variant || !variant.isActive) throw ApiError.badRequest(`Variant ${item.variantId} not available`);
      unitPrice += Number(variant.priceDelta);
      availableStock = Number(variant.stockQuantity);
    }

    if (availableStock < item.quantity) {
      throw ApiError.badRequest(`Insufficient stock for ${product.name}`);
    }

    priced.push({
      productId: item.productId,
      variantId: item.variantId ?? null,
      productName: String(product.name),
      sku: String(product.sku),
      quantity: item.quantity,
      unitPrice,
      totalPrice: unitPrice * item.quantity,
    });
  }

  return priced;
}

export async function createOrder(userId: string, input: CreateOrderInput) {
  const address = await queryOne<Record<string, unknown>>(
    "SELECT * FROM `Address` WHERE id = ? AND userId = ?",
    [input.addressId, userId]
  );
  if (!address) throw ApiError.badRequest("Address not found");

  const pricedItems = await priceOrderItems(input.items);
  const subtotal = pricedItems.reduce((sum, i) => sum + i.totalPrice, 0);
  const totalAmount = subtotal;
  const orderId = createId();
  const orderNumber = generateOrderNumber();

  await withTransaction(async (conn) => {
    await conn.query(
      `INSERT INTO \`Order\`
        (id, orderNumber, userId, addressId, status, paymentMethod, paymentStatus, subtotal, discountAmount, taxAmount, shippingAmount, totalAmount, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, 'PENDING', ?, 'PENDING', ?, 0, 0, 0, ?, NOW(3), NOW(3))`,
      [orderId, orderNumber, userId, input.addressId, input.paymentMethod, subtotal, totalAmount]
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
      "INSERT INTO `OrderStatusHistory` (id, orderId, status, note, createdAt) VALUES (?, ?, 'PENDING', 'Order placed', NOW(3))",
      [createId(), orderId]
    );
  });

  let razorpayOrder: { id: string; amount: string | number; currency: string } | null = null;
  if (input.paymentMethod === "RAZORPAY") {
    razorpayOrder = await createRazorpayOrder(totalAmount, orderNumber);
    await query("UPDATE `Order` SET razorpayOrderId = ? WHERE id = ?", [razorpayOrder.id, orderId]);
  }

  return {
    id: orderId,
    orderNumber,
    totalAmount,
    paymentMethod: input.paymentMethod,
    razorpayOrder,
  };
}

export async function verifyPayment(userId: string, input: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const order = await queryOne<Record<string, unknown>>("SELECT * FROM `Order` WHERE id = ? AND userId = ?", [
    input.orderId,
    userId,
  ]);
  if (!order) throw ApiError.notFound("Order not found");
  if (order.razorpayOrderId !== input.razorpayOrderId) {
    throw ApiError.badRequest("Order mismatch");
  }

  const isValid = verifyRazorpaySignature(input.razorpayOrderId, input.razorpayPaymentId, input.razorpaySignature);
  if (!isValid) {
    throw ApiError.badRequest("Payment verification failed");
  }

  await query(
    "UPDATE `Order` SET paymentStatus = 'PAID', status = 'CONFIRMED', razorpayPaymentId = ? WHERE id = ?",
    [input.razorpayPaymentId, input.orderId]
  );
  await query(
    "INSERT INTO `OrderStatusHistory` (id, orderId, status, note, createdAt) VALUES (?, ?, 'CONFIRMED', 'Payment confirmed', NOW(3))",
    [createId(), input.orderId]
  );

  return { success: true };
}

export async function listMyOrders(userId: string) {
  const orders = await query<Record<string, unknown>>(
    "SELECT * FROM `Order` WHERE userId = ? ORDER BY createdAt DESC",
    [userId]
  );
  const orderIds = orders.map((o) => o.id as string);
  if (!orderIds.length) return [];

  const items = await query<Record<string, unknown>>(
    `SELECT * FROM \`OrderItem\` WHERE orderId IN (${orderIds.map(() => "?").join(",")})`,
    orderIds
  );

  return orders.map((order) => ({
    ...order,
    items: items.filter((i) => i.orderId === order.id),
  }));
}
