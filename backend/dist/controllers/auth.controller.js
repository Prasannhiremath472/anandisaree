"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.resetPassword = exports.forgotPassword = exports.verifyOtpAndLogin = exports.requestOtp = exports.logout = exports.refresh = exports.login = exports.register = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const env_1 = require("../config/env");
const authService = __importStar(require("../services/auth.service"));
const auth_schema_1 = require("../validation/auth.schema");
const db_1 = require("../config/db");
const id_1 = require("../utils/id");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ApiError_1 = require("../utils/ApiError");
const tokens_1 = require("../utils/tokens");
const REFRESH_COOKIE = "refreshToken";
function setRefreshCookie(res, token) {
    res.cookie(REFRESH_COOKIE, token, {
        httpOnly: true,
        secure: env_1.isProd,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/api/auth",
    });
}
exports.register = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = auth_schema_1.registerSchema.parse(req.body);
    const result = await authService.register(input);
    setRefreshCookie(res, result.refreshToken);
    res.status(201).json({ success: true, data: { user: result.user, accessToken: result.accessToken } });
});
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = auth_schema_1.loginSchema.parse(req.body);
    const result = await authService.login(input);
    setRefreshCookie(res, result.refreshToken);
    res.json({ success: true, data: { user: result.user, accessToken: result.accessToken } });
});
exports.refresh = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token)
        throw ApiError_1.ApiError.unauthorized("Refresh token missing");
    const result = await authService.refreshAccessToken(token);
    res.json({ success: true, data: result });
});
exports.logout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (token)
        await authService.revokeRefreshToken(token);
    res.clearCookie(REFRESH_COOKIE, { path: "/api/auth" });
    res.json({ success: true, data: null, message: "Logged out" });
});
exports.requestOtp = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = auth_schema_1.requestOtpSchema.parse(req.body);
    await authService.requestOtp(input.identifier, input.purpose);
    res.json({ success: true, data: null, message: "OTP sent" });
});
exports.verifyOtpAndLogin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = auth_schema_1.verifyOtpSchema.parse(req.body);
    await authService.verifyOtp(input.identifier, input.code, input.purpose);
    const user = await (0, db_1.queryOne)("SELECT * FROM `User` WHERE email = ? OR phone = ? LIMIT 1", [
        input.identifier,
        input.identifier,
    ]);
    if (!user)
        throw ApiError_1.ApiError.notFound("No account found for this identifier");
    const accessToken = (0, tokens_1.signAccessToken)({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = (0, tokens_1.generateRefreshTokenValue)();
    await (0, db_1.execute)("INSERT INTO `RefreshToken` (id, token, userId, expiresAt, createdAt) VALUES (?, ?, ?, ?, NOW(3))", [
        (0, id_1.createId)(),
        refreshToken,
        user.id,
        (0, tokens_1.refreshTokenExpiryDate)(),
    ]);
    setRefreshCookie(res, refreshToken);
    res.json({ success: true, data: { user: authService.sanitizeUser(user), accessToken } });
});
exports.forgotPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = auth_schema_1.forgotPasswordSchema.parse(req.body);
    await authService.requestOtp(input.email, "RESET_PASSWORD");
    res.json({ success: true, data: null, message: "Password reset OTP sent" });
});
exports.resetPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = auth_schema_1.resetPasswordSchema.parse(req.body);
    await authService.verifyOtp(input.email, input.code, "RESET_PASSWORD");
    const passwordHash = await bcryptjs_1.default.hash(input.newPassword, 12);
    await (0, db_1.execute)("UPDATE `User` SET passwordHash = ? WHERE email = ?", [passwordHash, input.email]);
    res.json({ success: true, data: null, message: "Password reset successful" });
});
exports.me = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await (0, db_1.queryOne)("SELECT * FROM `User` WHERE id = ? LIMIT 1", [req.user.userId]);
    if (!user)
        throw ApiError_1.ApiError.notFound("User not found");
    res.json({ success: true, data: authService.sanitizeUser(user) });
});
//# sourceMappingURL=auth.controller.js.map