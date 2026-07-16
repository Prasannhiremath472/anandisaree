"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refreshAccessToken = refreshAccessToken;
exports.revokeRefreshToken = revokeRefreshToken;
exports.requestOtp = requestOtp;
exports.verifyOtp = verifyOtp;
exports.sanitizeUser = sanitizeUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../config/db");
const id_1 = require("../utils/id");
const ApiError_1 = require("../utils/ApiError");
const tokens_1 = require("../utils/tokens");
const SALT_ROUNDS = 12;
async function issueTokenPair(user) {
    const accessToken = (0, tokens_1.signAccessToken)({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = (0, tokens_1.generateRefreshTokenValue)();
    await (0, db_1.execute)("INSERT INTO `RefreshToken` (id, token, userId, expiresAt, createdAt) VALUES (?, ?, ?, ?, NOW(3))", [
        (0, id_1.createId)(),
        refreshToken,
        user.id,
        (0, tokens_1.refreshTokenExpiryDate)(),
    ]);
    return { accessToken, refreshToken };
}
async function register(input) {
    const existing = await (0, db_1.queryOne)("SELECT * FROM `User` WHERE email = ? LIMIT 1", [input.email]);
    if (existing) {
        throw ApiError_1.ApiError.conflict("An account with this email already exists");
    }
    const passwordHash = await bcryptjs_1.default.hash(input.password, SALT_ROUNDS);
    const userId = (0, id_1.createId)();
    await (0, db_1.execute)("INSERT INTO `User` (id, name, email, phone, passwordHash, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, 'CUSTOMER', NOW(3), NOW(3))", [userId, input.name, input.email, input.phone ?? null, passwordHash]);
    const user = await (0, db_1.queryOne)("SELECT * FROM `User` WHERE id = ? LIMIT 1", [userId]);
    if (!user) {
        throw ApiError_1.ApiError.internal("Failed to create user");
    }
    await (0, db_1.execute)("INSERT INTO `Wallet` (id, userId, updatedAt) VALUES (?, ?, NOW(3))", [(0, id_1.createId)(), user.id]);
    const tokens = await issueTokenPair(user);
    return { user: sanitizeUser(user), ...tokens };
}
async function login(input) {
    const user = await (0, db_1.queryOne)("SELECT * FROM `User` WHERE email = ? LIMIT 1", [input.email]);
    if (!user || !user.passwordHash) {
        throw ApiError_1.ApiError.unauthorized("Invalid email or password");
    }
    if (!user.isActive) {
        throw ApiError_1.ApiError.forbidden("This account has been deactivated");
    }
    const valid = await bcryptjs_1.default.compare(input.password, user.passwordHash);
    if (!valid) {
        throw ApiError_1.ApiError.unauthorized("Invalid email or password");
    }
    const tokens = await issueTokenPair(user);
    return { user: sanitizeUser(user), ...tokens };
}
async function refreshAccessToken(refreshToken) {
    const stored = await (0, db_1.queryOne)("SELECT * FROM `RefreshToken` WHERE token = ? LIMIT 1", [refreshToken]);
    if (!stored || stored.revoked || new Date(stored.expiresAt) < new Date()) {
        throw ApiError_1.ApiError.unauthorized("Invalid or expired refresh token");
    }
    const user = await (0, db_1.queryOne)("SELECT * FROM `User` WHERE id = ? LIMIT 1", [stored.userId]);
    if (!user) {
        throw ApiError_1.ApiError.unauthorized("Invalid or expired refresh token");
    }
    const accessToken = (0, tokens_1.signAccessToken)({
        userId: user.id,
        email: user.email,
        role: user.role,
    });
    return { accessToken, user: sanitizeUser(user) };
}
async function revokeRefreshToken(refreshToken) {
    await (0, db_1.execute)("UPDATE `RefreshToken` SET revoked = 1 WHERE token = ?", [refreshToken]);
}
async function requestOtp(identifier, purpose) {
    const code = (0, tokens_1.generateOtpCode)();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const user = await (0, db_1.queryOne)("SELECT * FROM `User` WHERE email = ? OR phone = ? LIMIT 1", [
        identifier,
        identifier,
    ]);
    await (0, db_1.execute)("INSERT INTO `OtpCode` (id, userId, identifier, code, purpose, expiresAt, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW(3))", [(0, id_1.createId)(), user?.id ?? null, identifier, code, purpose, expiresAt]);
    // NOTE: actual SMS/email dispatch happens in notification.service (Nodemailer wired in Phase 2/3).
    return { code, expiresAt };
}
async function verifyOtp(identifier, code, purpose) {
    const otp = await (0, db_1.queryOne)("SELECT id FROM `OtpCode` WHERE identifier = ? AND code = ? AND purpose = ? AND consumed = 0 AND expiresAt > NOW(3) ORDER BY createdAt DESC LIMIT 1", [identifier, code, purpose]);
    if (!otp) {
        throw ApiError_1.ApiError.badRequest("Invalid or expired OTP");
    }
    await (0, db_1.execute)("UPDATE `OtpCode` SET consumed = 1 WHERE id = ?", [otp.id]);
    return true;
}
function sanitizeUser(user) {
    const { passwordHash, ...rest } = user;
    return rest;
}
//# sourceMappingURL=auth.service.js.map