import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as notificationService from "../services/notification.service";

export const listNotifications = asyncHandler(async (req: Request, res: Response) => {
  const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit ?? "20"), 10) || 20));
  const result = await notificationService.listNotifications(limit);
  res.json({ success: true, data: result });
});

export const markRead = asyncHandler(async (req: Request, res: Response) => {
  await notificationService.markNotificationRead(req.params.id);
  res.json({ success: true, data: null });
});

export const markAllRead = asyncHandler(async (_req: Request, res: Response) => {
  await notificationService.markAllNotificationsRead();
  res.json({ success: true, data: null });
});
