"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubscriber = exports.exportSubscribers = exports.listSubscribers = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const prisma_1 = require("../config/prisma");
const pagination_1 = require("../utils/pagination");
exports.listSubscribers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const pagination = (0, pagination_1.getPagination)(req);
    const search = req.query.search;
    const where = search ? { email: { contains: search } } : {};
    const [items, total] = await Promise.all([
        prisma_1.prisma.newsletterSubscriber.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: pagination.skip,
            take: pagination.take,
        }),
        prisma_1.prisma.newsletterSubscriber.count({ where }),
    ]);
    res.json({ success: true, data: (0, pagination_1.buildPaginatedResult)(items, total, pagination) });
});
exports.exportSubscribers = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const subscribers = await prisma_1.prisma.newsletterSubscriber.findMany({
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
exports.deleteSubscriber = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await prisma_1.prisma.newsletterSubscriber.delete({ where: { id: req.params.id } }).catch(() => null);
    res.json({ success: true, data: null, message: "Subscriber removed" });
});
//# sourceMappingURL=newsletter.controller.js.map