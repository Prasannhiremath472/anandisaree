import { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { query, withTransaction } from "../config/db";
import { createId } from "../utils/id";

export const listSettings = asyncHandler(async (req: Request, res: Response) => {
  const group = req.query.group as string | undefined;
  const settings = group
    ? await query("SELECT * FROM `Setting` WHERE `group` = ? ORDER BY `key` ASC", [group])
    : await query("SELECT * FROM `Setting` ORDER BY `key` ASC");
  res.json({ success: true, data: settings });
});

const upsertSchema = z.object({
  settings: z.array(z.object({ key: z.string().min(1), value: z.string(), group: z.string().optional() })),
});

export const upsertSettings = asyncHandler(async (req: Request, res: Response) => {
  const { settings } = upsertSchema.parse(req.body);

  await withTransaction(async (conn) => {
    for (const s of settings) {
      const [existingRows] = await conn.query("SELECT id FROM `Setting` WHERE `key` = ? LIMIT 1", [s.key]);
      const existing = (existingRows as Record<string, unknown>[])[0];

      if (existing) {
        if (s.group) {
          await conn.query("UPDATE `Setting` SET value = ?, `group` = ?, updatedAt = NOW(3) WHERE `key` = ?", [
            s.value,
            s.group,
            s.key,
          ]);
        } else {
          await conn.query("UPDATE `Setting` SET value = ?, updatedAt = NOW(3) WHERE `key` = ?", [s.value, s.key]);
        }
      } else {
        await conn.query(
          "INSERT INTO `Setting` (id, `key`, value, `group`, updatedAt) VALUES (?, ?, ?, ?, NOW(3))",
          [createId(), s.key, s.value, s.group ?? "general"]
        );
      }
    }
  });

  const keys = settings.map((s) => s.key);
  const updated = await query(
    `SELECT * FROM \`Setting\` WHERE \`key\` IN (${keys.map(() => "?").join(",")})`,
    keys
  );
  res.json({ success: true, data: updated });
});
