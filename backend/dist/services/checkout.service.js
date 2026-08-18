"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAddresses = listAddresses;
exports.createAddress = createAddress;
exports.createOrder = createOrder;
exports.verifyPayment = verifyPayment;
exports.listMyOrders = listMyOrders;
const db_1 = require("../config/db");
const id_1 = require("../utils/id");
const ApiError_1 = require("../utils/ApiError");
const razorpay_service_1 = require("./razorpay.service");
async function listAddresses(userId) {
    return (0, db_1.query)("SELECT * FROM `Address` WHERE userId = ? ORDER BY isDefault DESC, createdAt DESC", [userId]);
}
async function createAddress(userId, input) {
    const id = (0, id_1.createId)();
    if (input.isDefault) {
        await (0, db_1.query)("UPDATE `Address` SET isDefault = 0 WHERE userId = ?", [userId]);
    }
    await (0, db_1.query)(`INSERT INTO \`Address\`
      (id, userId, type, fullName, phone, line1, line2, landmark, city, district, state, pincode, country, isDefault, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'India', ?, NOW(3), NOW(3))`, [
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
    ]);
    return (0, db_1.queryOne)("SELECT * FROM `Address` WHERE id = ?", [id]);
}
function generateOrderNumber() {
    const date = new Date();
    const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `AS${stamp}${rand}`;
}
async function priceOrderItems(items) {
    const priced = [];
    for (const item of items) {
        const product = await (0, db_1.queryOne)("SELECT id, name, sku, sellingPrice, stockQuantity FROM `Product` WHERE id = ? AND deletedAt IS NULL", [item.productId]);
        if (!product)
            throw ApiError_1.ApiError.badRequest(`Product ${item.productId} not found`);
        let unitPrice = Number(product.sellingPrice);
        let availableStock = Number(product.stockQuantity);
        if (item.variantId) {
            const variant = await (0, db_1.queryOne)("SELECT id, priceDelta, stockQuantity, isActive FROM `ProductVariant` WHERE id = ? AND productId = ?", [item.variantId, item.productId]);
            if (!variant || !variant.isActive)
                throw ApiError_1.ApiError.badRequest(`Variant ${item.variantId} not available`);
            unitPrice += Number(variant.priceDelta);
            availableStock = Number(variant.stockQuantity);
        }
        if (availableStock < item.quantity) {
            throw ApiError_1.ApiError.badRequest(`Insufficient stock for ${product.name}`);
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
async function createOrder(userId, input) {
    const address = await (0, db_1.queryOne)("SELECT * FROM `Address` WHERE id = ? AND userId = ?", [input.addressId, userId]);
    if (!address)
        throw ApiError_1.ApiError.badRequest("Address not found");
    const pricedItems = await priceOrderItems(input.items);
    const subtotal = pricedItems.reduce((sum, i) => sum + i.totalPrice, 0);
    const totalAmount = subtotal;
    const orderId = (0, id_1.createId)();
    const orderNumber = generateOrderNumber();
    // Create the Razorpay order first so a gateway failure never leaves behind
    // a local PENDING order with stock already decremented.
    let razorpayOrder = null;
    if (input.paymentMethod === "RAZORPAY") {
        razorpayOrder = await (0, razorpay_service_1.createRazorpayOrder)(totalAmount, orderNumber);
    }
    await (0, db_1.withTransaction)(async (conn) => {
        await conn.query(`INSERT INTO \`Order\`
        (id, orderNumber, userId, addressId, status, paymentMethod, paymentStatus, razorpayOrderId, subtotal, discountAmount, taxAmount, shippingAmount, totalAmount, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, 'PENDING', ?, 'PENDING', ?, ?, 0, 0, 0, ?, NOW(3), NOW(3))`, [orderId, orderNumber, userId, input.addressId, input.paymentMethod, razorpayOrder?.id ?? null, subtotal, totalAmount]);
        for (const item of pricedItems) {
            await conn.query(`INSERT INTO \`OrderItem\` (id, orderId, productId, variantId, productName, sku, quantity, unitPrice, totalPrice)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [(0, id_1.createId)(), orderId, item.productId, item.variantId, item.productName, item.sku, item.quantity, item.unitPrice, item.totalPrice]);
            if (item.variantId) {
                await conn.query("UPDATE `ProductVariant` SET stockQuantity = stockQuantity - ? WHERE id = ?", [
                    item.quantity,
                    item.variantId,
                ]);
            }
            else {
                await conn.query("UPDATE `Product` SET stockQuantity = stockQuantity - ? WHERE id = ?", [
                    item.quantity,
                    item.productId,
                ]);
            }
        }
        await conn.query("INSERT INTO `OrderStatusHistory` (id, orderId, status, note, createdAt) VALUES (?, ?, 'PENDING', 'Order placed', NOW(3))", [(0, id_1.createId)(), orderId]);
    });
    return {
        id: orderId,
        orderNumber,
        totalAmount,
        paymentMethod: input.paymentMethod,
        razorpayOrder,
    };
}
async function verifyPayment(userId, input) {
    const order = await (0, db_1.queryOne)("SELECT * FROM `Order` WHERE id = ? AND userId = ?", [
        input.orderId,
        userId,
    ]);
    if (!order)
        throw ApiError_1.ApiError.notFound("Order not found");
    if (order.razorpayOrderId !== input.razorpayOrderId) {
        throw ApiError_1.ApiError.badRequest("Order mismatch");
    }
    const isValid = (0, razorpay_service_1.verifyRazorpaySignature)(input.razorpayOrderId, input.razorpayPaymentId, input.razorpaySignature);
    if (!isValid) {
        throw ApiError_1.ApiError.badRequest("Payment verification failed");
    }
    await (0, db_1.query)("UPDATE `Order` SET paymentStatus = 'PAID', status = 'CONFIRMED', razorpayPaymentId = ? WHERE id = ?", [input.razorpayPaymentId, input.orderId]);
    await (0, db_1.query)("INSERT INTO `OrderStatusHistory` (id, orderId, status, note, createdAt) VALUES (?, ?, 'CONFIRMED', 'Payment confirmed', NOW(3))", [(0, id_1.createId)(), input.orderId]);
    return { success: true };
}
async function listMyOrders(userId) {
    const orders = await (0, db_1.query)("SELECT * FROM `Order` WHERE userId = ? ORDER BY createdAt DESC", [userId]);
    const orderIds = orders.map((o) => o.id);
    if (!orderIds.length)
        return [];
    const items = await (0, db_1.query)(`SELECT * FROM \`OrderItem\` WHERE orderId IN (${orderIds.map(() => "?").join(",")})`, orderIds);
    return orders.map((order) => ({
        ...order,
        items: items.filter((i) => i.orderId === order.id),
    }));
}
//# sourceMappingURL=checkout.service.js.map