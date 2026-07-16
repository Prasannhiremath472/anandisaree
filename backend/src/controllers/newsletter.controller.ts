import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { query, queryOne, execute } from "../config/db";
import { getPagination, buildPaginatedResult } from "../utils/pagination";

export const listSubscribers = asyncHandler(async (req: Request, res: Response) => {
  const pagination = getPagination(req);
  const search = req.query.search as string | undefined;

  const whereClause = search ? "email LIKE ?" : "1=1";
  const params = search ? [`%${search}%`] : [];

  const items = await query(
    `SELECT * FROM \`NewsletterSubscriber\` WHERE ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
    [...params, pagination.take, pagination.skip]
  );
  const totalRow = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM \`NewsletterSubscriber\` WHERE ${whereClause}`,
    params
  );

  res.json({ success: true, data: buildPaginatedResult(items, totalRow?.count ?? 0, pagination) });
});

export const exportSubscribers = asyncHandler(async (_req: Request, res: Response) => {
  const subscribers = await query<{ email: string; createdAt: Date }>(
    "SELECT email, createdAt FROM `NewsletterSubscriber` WHERE isSubscribed = 1 ORDER BY createdAt DESC"
  );

  const csvRows = ["email,subscribed_at", ...subscribers.map((s) => `${s.email},${new Date(s.createdAt).toISOString()}`)];
  const csv = csvRows.join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=newsletter-subscribers.csv");
  res.send(csv);
});

export const deleteSubscriber = asyncHandler(async (req: Request, res: Response) => {
  await execute("DELETE FROM `NewsletterSubscriber` WHERE id = ?", [req.params.id]).catch(() => null);
  res.json({ success: true, data: null, message: "Subscriber removed" });
});
