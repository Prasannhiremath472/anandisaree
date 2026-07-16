"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubscriber = exports.exportSubscribers = exports.listSubscribers = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const db_1 = require("../config/db");
const pagination_1 = require("../utils/pagination");
exports.listSubscribers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const pagination = (0, pagination_1.getPagination)(req);
    const search = req.query.search;
    const whereClause = search ? "email LIKE ?" : "1=1";
    const params = search ? [`%${search}%`] : [];
    const items = await (0, db_1.query)(`SELECT * FROM \`NewsletterSubscriber\` WHERE ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`, [...params, pagination.take, pagination.skip]);
    const totalRow = await (0, db_1.queryOne)(`SELECT COUNT(*) as count FROM \`NewsletterSubscriber\` WHERE ${whereClause}`, params);
    res.json({ success: true, data: (0, pagination_1.buildPaginatedResult)(items, totalRow?.count ?? 0, pagination) });
});
exports.exportSubscribers = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const subscribers = await (0, db_1.query)("SELECT email, createdAt FROM `NewsletterSubscriber` WHERE isSubscribed = 1 ORDER BY createdAt DESC");
    const csvRows = ["email,subscribed_at", ...subscribers.map((s) => `${s.email},${new Date(s.createdAt).toISOString()}`)];
    const csv = csvRows.join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=newsletter-subscribers.csv");
    res.send(csv);
});
exports.deleteSubscriber = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await (0, db_1.execute)("DELETE FROM `NewsletterSubscriber` WHERE id = ?", [req.params.id]).catch(() => null);
    res.json({ success: true, data: null, message: "Subscriber removed" });
});
//# sourceMappingURL=newsletter.controller.js.map