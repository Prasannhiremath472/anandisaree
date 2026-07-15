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
const prisma_1 = require("../config/prisma");
const ApiError_1 = require("../utils/ApiError");
const tokens_1 = require("../utils/tokens");
const SALT_ROUNDS = 12;
async function issueTokenPair(user) {
    const accessToken = (0, tokens_1.signAccessToken)({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = (0, tokens_1.generateRefreshTokenValue)();
    await prisma_1.prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: (0, tokens_1.refreshTokenExpiryDate)(),
        },
    });
    return { accessToken, refreshToken };
}
async function register(input) {
    const existing = await prisma_1.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
        throw ApiError_1.ApiError.conflict("An account with this email already exists");
    }
    const passwordHash = await bcryptjs_1.default.hash(input.password, SALT_ROUNDS);
    const user = await prisma_1.prisma.user.create({
        data: {
            name: input.name,
            email: input.email,
            phone: input.phone,
            passwordHash,
            role: "CUSTOMER",
        },
    });
    await prisma_1.prisma.wallet.create({ data: { userId: user.id } });
    const tokens = await issueTokenPair(user);
    return { user: sanitizeUser(user), ...tokens };
}
async function login(input) {
    const user = await prisma_1.prisma.user.findUnique({ where: { email: input.email } });
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
    const stored = await prisma_1.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
    });
    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
        throw ApiError_1.ApiError.unauthorized("Invalid or expired refresh token");
    }
    const accessToken = (0, tokens_1.signAccessToken)({
        userId: stored.user.id,
        email: stored.user.email,
        role: stored.user.role,
    });
    return { accessToken, user: sanitizeUser(stored.user) };
}
async function revokeRefreshToken(refreshToken) {
    await prisma_1.prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { revoked: true },
    });
}
async function requestOtp(identifier, purpose) {
    const code = (0, tokens_1.generateOtpCode)();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const user = await prisma_1.prisma.user.findFirst({
        where: { OR: [{ email: identifier }, { phone: identifier }] },
    });
    await prisma_1.prisma.otpCode.create({
        data: { identifier, code, purpose, expiresAt, userId: user?.id },
    });
    // NOTE: actual SMS/email dispatch happens in notification.service (Nodemailer wired in Phase 2/3).
    return { code, expiresAt };
}
async function verifyOtp(identifier, code, purpose) {
    const otp = await prisma_1.prisma.otpCode.findFirst({
        where: { identifier, code, purpose, consumed: false, expiresAt: { gt: new Date() } },
        orderBy: { createdAt: "desc" },
    });
    if (!otp) {
        throw ApiError_1.ApiError.badRequest("Invalid or expired OTP");
    }
    await prisma_1.prisma.otpCode.update({ where: { id: otp.id }, data: { consumed: true } });
    return true;
}
function sanitizeUser(user) {
    const { passwordHash, ...rest } = user;
    return rest;
}
//# sourceMappingURL=auth.service.js.map