"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.optionalAuthenticate = optionalAuthenticate;
exports.authorize = authorize;
const ApiError_1 = require("../utils/ApiError");
const tokens_1 = require("../utils/tokens");
function authenticate(req, _res, next) {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
    if (!token) {
        return next(ApiError_1.ApiError.unauthorized("Authentication token missing"));
    }
    try {
        const payload = (0, tokens_1.verifyAccessToken)(token);
        req.user = payload;
        next();
    }
    catch {
        next(ApiError_1.ApiError.unauthorized("Invalid or expired token"));
    }
}
function optionalAuthenticate(req, _res, next) {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
    if (!token)
        return next();
    try {
        req.user = (0, tokens_1.verifyAccessToken)(token);
    }
    catch {
        // ignore invalid token for optional auth
    }
    next();
}
function authorize(...roles) {
    return (req, _res, next) => {
        if (!req.user) {
            return next(ApiError_1.ApiError.unauthorized());
        }
        if (!roles.includes(req.user.role)) {
            return next(ApiError_1.ApiError.forbidden("You do not have permission to perform this action"));
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map