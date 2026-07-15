import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getPagination } from "../utils/pagination";
import * as customerService from "../services/customer.service";
import { customerListQuerySchema, customerStatusUpdateSchema } from "../validation/customer.schema";

export const listCustomers = asyncHandler(async (req: Request, res: Response) => {
  const query = customerListQuerySchema.parse(req.query);
  const pagination = getPagination(req);
  const result = await customerService.listCustomers(pagination, query);
  res.json({ success: true, data: result });
});

export const getCustomer = asyncHandler(async (req: Request, res: Response) => {
  const customer = await customerService.getCustomerById(req.params.id);
  res.json({ success: true, data: customer });
});

export const updateCustomerStatus = asyncHandler(async (req: Request, res: Response) => {
  const { isActive } = customerStatusUpdateSchema.parse(req.body);
  const customer = await customerService.setCustomerStatus(req.params.id, isActive);
  res.json({ success: true, data: customer });
});
