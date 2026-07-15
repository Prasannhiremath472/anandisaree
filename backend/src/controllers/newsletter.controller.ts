import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../config/prisma";
import { getPagination, buildPaginatedResult } from "../utils/pagination";
import type { Prisma } from "@prisma/client";

export const listSubscribers = asyncHandler(async (req: Request, res: Response) => {
  const pagination = getPagination(req);
  const search = req.query.search as string | undefined;

  const where: Prisma.NewsletterSubscriberWhereInput = search ? { email: { contains: search } } : {};

  const [items, total] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.newsletterSubscriber.count({ where }),
  ]);

  res.json({ success: true, data: buildPaginatedResult(items, total, pagination) });
});

export const exportSubscribers = asyncHandler(async (_req: Request, res: Response) => {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { isSubscribed: true },
    select: { email: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const csvRows = ["email,subscribed_at", ...subscribers.map((s) => `${s.email},${s.createdAt.toISOString()}`)];
  const csv = csvRows.join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=newsletter-subscribers.csv");
  res.send(csv);
});

export const deleteSubscriber = asyncHandler(async (req: Request, res: Response) => {
  await prisma.newsletterSubscriber.delete({ where: { id: req.params.id } }).catch(() => null);
  res.json({ success: true, data: null, message: "Subscriber removed" });
});
