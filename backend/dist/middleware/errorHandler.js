"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const ApiError_1 = require("../utils/ApiError");
const logger_1 = require("../config/logger");
function notFoundHandler(req, res) {
    res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}
function errorHandler(err, req, res, _next) {
    if (err instanceof zod_1.ZodError) {
        const errors = {};
        for (const issue of err.issues) {
            const key = issue.path.join(".") || "root";
            errors[key] = errors[key] ? [...errors[key], issue.message] : [issue.message];
        }
        return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    if (err instanceof ApiError_1.ApiError) {
        if (err.statusCode >= 500) {
            logger_1.logger.error(err.message, { stack: err.stack });
        }
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(err.errors ? { errors: err.errors } : {}),
        });
    }
    const message = err instanceof Error ? err.message : "Internal server error";
    logger_1.logger.error(message, { stack: err instanceof Error ? err.stack : undefined });
    return res.status(500).json({ success: false, message: "Internal server error" });
}
//# sourceMappingURL=errorHandler.js.map