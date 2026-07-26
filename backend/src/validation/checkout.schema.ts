import { z } from "zod";

export const addressSchema = z.object({
  type: z.enum(["HOME", "WORK", "OTHER"]).optional(),
  fullName: z.string().min(1),
  phone: z.string().min(6),
  line1: z.string().min(1),
  line2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(1),
  district: z.string().optional(),
  state: z.string().min(1),
  pincode: z.string().min(4),
  isDefault: z.coerce.boolean().optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;

export const createOrderSchema = z.object({
  addressId: z.string().min(1),
  paymentMethod: z.enum(["COD", "RAZORPAY"]),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().optional(),
        quantity: z.coerce.number().int().positive(),
      })
    )
    .min(1),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const verifyPaymentSchema = z.object({
  orderId: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
