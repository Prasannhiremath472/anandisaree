"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.verifyAccessToken = verifyAccessToken;
exports.generateRefreshTokenValue = generateRefreshTokenValue;
exports.refreshTokenExpiryDate = refreshTokenExpiryDate;
exports.generateOtpCode = generateOtpCode;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../config/env");
function signAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_ACCESS_SECRET, { expiresIn: env_1.env.JWT_ACCESS_EXPIRES_IN });
}
function verifyAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
}
function generateRefreshTokenValue() {
    return crypto_1.default.randomBytes(48).toString("hex");
}
function refreshTokenExpiryDate() {
    const days = parseInt(env_1.env.JWT_REFRESH_EXPIRES_IN.replace(/[^\d]/g, ""), 10) || 30;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}
function generateOtpCode() {
    return crypto_1.default.randomInt(100000, 999999).toString();
}
//# sourceMappingURL=tokens.js.map