import { z } from "zod";

export const orderListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED", "REFUNDED"]).optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).optional(),
  categoryId: z.string().optional(),
});

export const orderStatusUpdateSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED", "REFUNDED"]),
  note: z.string().optional(),
  trackingNumber: z.string().optional(),
  courierName: z.string().optional(),
});

export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;

const adminOrderItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  quantity: z.coerce.number().int().positive(),
});

const adminOrderAddressSchema = z.object({
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
});

export const adminCreateOrderSchema = z
  .object({
    // Either an existing customer (userId + addressId), or a walk-in
    // customer described inline (name/phone/email + a fresh address).
    userId: z.string().optional(),
    addressId: z.string().optional(),
    newCustomer: z
      .object({
        name: z.string().min(1),
        phone: z.string().min(6),
        email: z.string().email().optional(),
        address: adminOrderAddressSchema,
      })
      .optional(),
    paymentMethod: z.enum(["COD", "RAZORPAY", "UPI", "CARD", "NETBANKING", "WALLET"]),
    paymentStatus: z.enum(["PENDING", "PAID"]).optional(),
    items: z.array(adminOrderItemSchema).min(1),
  })
  .refine((data) => (data.userId && data.addressId) || data.newCustomer, {
    message: "Provide either an existing customer with an address, or new customer details",
  });

export type AdminCreateOrderInput = z.infer<typeof adminCreateOrderSchema>;
