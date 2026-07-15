"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = getPagination;
exports.buildPaginatedResult = buildPaginatedResult;
function getPagination(req, defaultPageSize = 20, maxPageSize = 100) {
    const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10) || 1);
    const rawPageSize = parseInt(String(req.query.pageSize ?? defaultPageSize), 10) || defaultPageSize;
    const pageSize = Math.min(maxPageSize, Math.max(1, rawPageSize));
    return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}
function buildPaginatedResult(items, total, { page, pageSize }) {
    return {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
}
//# sourceMappingURL=pagination.js.map