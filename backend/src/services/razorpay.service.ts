import Razorpay from "razorpay";
import crypto from "crypto";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

let client: Razorpay | null = null;

function getClient() {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    throw ApiError.badRequest("Razorpay is not configured on the server");
  }
  if (!client) {
    client = new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET });
  }
  return client;
}

export async function createRazorpayOrder(amountInRupees: number, receipt: string) {
  const razorpay = getClient();
  const order = await razorpay.orders.create({
    amount: Math.round(amountInRupees * 100),
    currency: "INR",
    receipt,
  });
  return order;
}

export function verifyRazorpaySignature(razorpayOrderId: string, razorpayPaymentId: string, signature: string) {
  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
  return expected === signature;
}
