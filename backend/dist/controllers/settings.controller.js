"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertSettings = exports.listSettings = void 0;
const zod_1 = require("zod");
const asyncHandler_1 = require("../utils/asyncHandler");
const db_1 = require("../config/db");
const id_1 = require("../utils/id");
exports.listSettings = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const group = req.query.group;
    const settings = group
        ? await (0, db_1.query)("SELECT * FROM `Setting` WHERE `group` = ? ORDER BY `key` ASC", [group])
        : await (0, db_1.query)("SELECT * FROM `Setting` ORDER BY `key` ASC");
    res.json({ success: true, data: settings });
});
const upsertSchema = zod_1.z.object({
    settings: zod_1.z.array(zod_1.z.object({ key: zod_1.z.string().min(1), value: zod_1.z.string(), group: zod_1.z.string().optional() })),
});
exports.upsertSettings = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { settings } = upsertSchema.parse(req.body);
    await (0, db_1.withTransaction)(async (conn) => {
        for (const s of settings) {
            const [existingRows] = await conn.query("SELECT id FROM `Setting` WHERE `key` = ? LIMIT 1", [s.key]);
            const existing = existingRows[0];
            if (existing) {
                if (s.group) {
                    await conn.query("UPDATE `Setting` SET value = ?, `group` = ?, updatedAt = NOW(3) WHERE `key` = ?", [
                        s.value,
                        s.group,
                        s.key,
                    ]);
                }
                else {
                    await conn.query("UPDATE `Setting` SET value = ?, updatedAt = NOW(3) WHERE `key` = ?", [s.value, s.key]);
                }
            }
            else {
                await conn.query("INSERT INTO `Setting` (id, `key`, value, `group`, updatedAt) VALUES (?, ?, ?, ?, NOW(3))", [(0, id_1.createId)(), s.key, s.value, s.group ?? "general"]);
            }
        }
    });
    const keys = settings.map((s) => s.key);
    const updated = await (0, db_1.query)(`SELECT * FROM \`Setting\` WHERE \`key\` IN (${keys.map(() => "?").join(",")})`, keys);
    res.json({ success: true, data: updated });
});
//# sourceMappingURL=settings.controller.js.map