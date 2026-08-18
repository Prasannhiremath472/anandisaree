"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRazorpayOrder = createRazorpayOrder;
exports.verifyRazorpaySignature = verifyRazorpaySignature;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../config/env");
const ApiError_1 = require("../utils/ApiError");
let client = null;
function getClient() {
    if (!env_1.env.RAZORPAY_KEY_ID || !env_1.env.RAZORPAY_KEY_SECRET) {
        throw ApiError_1.ApiError.badRequest("Razorpay is not configured on the server");
    }
    if (!client) {
        client = new razorpay_1.default({ key_id: env_1.env.RAZORPAY_KEY_ID, key_secret: env_1.env.RAZORPAY_KEY_SECRET });
    }
    return client;
}
async function createRazorpayOrder(amountInRupees, receipt) {
    const razorpay = getClient();
    const order = await razorpay.orders.create({
        amount: Math.round(amountInRupees * 100),
        currency: "INR",
        receipt,
    });
    return order;
}
function verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, signature) {
    const expected = crypto_1.default
        .createHmac("sha256", env_1.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");
    return expected === signature;
}
//# sourceMappingURL=razorpay.service.js.map