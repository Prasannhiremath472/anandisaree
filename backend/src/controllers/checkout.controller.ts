import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as checkoutService from "../services/checkout.service";
import { addressSchema, createOrderSchema, verifyPaymentSchema } from "../validation/checkout.schema";

export const listAddresses = asyncHandler(async (req: Request, res: Response) => {
  const addresses = await checkoutService.listAddresses(req.user!.userId);
  res.json({ success: true, data: addresses });
});

export const createAddress = asyncHandler(async (req: Request, res: Response) => {
  const input = addressSchema.parse(req.body);
  const address = await checkoutService.createAddress(req.user!.userId, input);
  res.status(201).json({ success: true, data: address });
});

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const input = createOrderSchema.parse(req.body);
  const order = await checkoutService.createOrder(req.user!.userId, input);
  res.status(201).json({ success: true, data: order });
});

export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const input = verifyPaymentSchema.parse(req.body);
  const result = await checkoutService.verifyPayment(req.user!.userId, input);
  res.json({ success: true, data: result });
});

export const listMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await checkoutService.listMyOrders(req.user!.userId);
  res.json({ success: true, data: orders });
});
