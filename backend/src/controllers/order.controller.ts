import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getPagination } from "../utils/pagination";
import * as orderService from "../services/order.service";
import { orderListQuerySchema, orderStatusUpdateSchema } from "../validation/order.schema";

export const listOrders = asyncHandler(async (req: Request, res: Response) => {
  const query = orderListQuerySchema.parse(req.query);
  const pagination = getPagination(req);
  const result = await orderService.listOrders(pagination, query);
  res.json({ success: true, data: result });
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.getOrderById(req.params.id);
  res.json({ success: true, data: order });
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const input = orderStatusUpdateSchema.parse(req.body);
  const order = await orderService.updateOrderStatus(req.params.id, input, req.user?.userId);
  res.json({ success: true, data: order });
});

export const getDashboardSummary = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await orderService.getDashboardSummary();
  res.json({ success: true, data: summary });
});
