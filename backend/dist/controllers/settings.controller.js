"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertSettings = exports.listSettings = void 0;
const zod_1 = require("zod");
const asyncHandler_1 = require("../utils/asyncHandler");
const prisma_1 = require("../config/prisma");
exports.listSettings = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const group = req.query.group;
    const settings = await prisma_1.prisma.setting.findMany({
        where: group ? { group } : undefined,
        orderBy: { key: "asc" },
    });
    res.json({ success: true, data: settings });
});
const upsertSchema = zod_1.z.object({
    settings: zod_1.z.array(zod_1.z.object({ key: zod_1.z.string().min(1), value: zod_1.z.string(), group: zod_1.z.string().optional() })),
});
exports.upsertSettings = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { settings } = upsertSchema.parse(req.body);
    await prisma_1.prisma.$transaction(settings.map((s) => prisma_1.prisma.setting.upsert({
        where: { key: s.key },
        update: { value: s.value, ...(s.group ? { group: s.group } : {}) },
        create: { key: s.key, value: s.value, group: s.group ?? "general" },
    })));
    const updated = await prisma_1.prisma.setting.findMany({ where: { key: { in: settings.map((s) => s.key) } } });
    res.json({ success: true, data: updated });
});
//# sourceMappingURL=settings.controller.js.map