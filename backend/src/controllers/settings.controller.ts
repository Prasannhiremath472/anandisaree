import { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../config/prisma";

export const listSettings = asyncHandler(async (req: Request, res: Response) => {
  const group = req.query.group as string | undefined;
  const settings = await prisma.setting.findMany({
    where: group ? { group } : undefined,
    orderBy: { key: "asc" },
  });
  res.json({ success: true, data: settings });
});

const upsertSchema = z.object({
  settings: z.array(z.object({ key: z.string().min(1), value: z.string(), group: z.string().optional() })),
});

export const upsertSettings = asyncHandler(async (req: Request, res: Response) => {
  const { settings } = upsertSchema.parse(req.body);

  await prisma.$transaction(
    settings.map((s) =>
      prisma.setting.upsert({
        where: { key: s.key },
        update: { value: s.value, ...(s.group ? { group: s.group } : {}) },
        create: { key: s.key, value: s.value, group: s.group ?? "general" },
      })
    )
  );

  const updated = await prisma.setting.findMany({ where: { key: { in: settings.map((s) => s.key) } } });
  res.json({ success: true, data: updated });
});
