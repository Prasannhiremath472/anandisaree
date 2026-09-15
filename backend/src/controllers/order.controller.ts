import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getPagination } from "../utils/pagination";
import * as orderService from "../services/order.service";
import { adminCreateOrderSchema, orderListQuerySchema, orderStatusUpdateSchema } from "../validation/order.schema";
import { toCsv, sendCsv } from "../utils/csv";

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

export const createAdminOrder = asyncHandler(async (req: Request, res: Response) => {
  const input = adminCreateOrderSchema.parse(req.body);
  const order = await orderService.createAdminOrder(input, req.user?.userId);
  res.status(201).json({ success: true, data: order });
});

export const exportOrders = asyncHandler(async (req: Request, res: Response) => {
  const filters = orderListQuerySchema.parse(req.query);
  const orders = await orderService.listAllOrdersForExport(filters);

  const headers = ["Order Number", "Customer", "Email", "Phone", "Status", "Payment Method", "Payment Status", "Total", "Created At"];
  const rows = orders.map((o) => [
    o.orderNumber,
    o.customerName,
    o.customerEmail,
    o.customerPhone,
    o.status,
    o.paymentMethod,
    o.paymentStatus,
    o.totalAmount,
    new Date(o.createdAt as string).toISOString(),
  ]);

  sendCsv(res, "orders.csv", toCsv(headers, rows));
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const input = orderStatusUpdateSchema.parse(req.body);
  const order = await orderService.updateOrderStatus(req.params.id, input, req.user?.userId);
  res.json({ success: true, data: order });
});

export const getDashboardSummary = asyncHandler(async (req: Request, res: Response) => {
  const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;
  const summary = await orderService.getDashboardSummary(categoryId);
  res.json({ success: true, data: summary });
});
