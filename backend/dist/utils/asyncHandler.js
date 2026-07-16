"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = asyncHandler;
const prisma_1 = require("../config/prisma");
function isPrismaEnginePanic(err) {
    const message = err instanceof Error ? err.message : "";
    return message.includes("PANIC") || message.includes("Response from the Engine was empty");
}
function asyncHandler(fn) {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (err) {
            if (!isPrismaEnginePanic(err)) {
                return next(err);
            }
            // Hostinger suspends idle Node processes; the resumed Prisma engine can panic
            // on its first query with a stale internal timer. Reconnect and retry once
            // before surfacing an error, so the crash is invisible to the caller.
            await prisma_1.prisma.$disconnect().catch(() => undefined);
            try {
                await fn(req, res, next);
            }
            catch (retryErr) {
                next(retryErr);
            }
        }
    };
}
//# sourceMappingURL=asyncHandler.js.map