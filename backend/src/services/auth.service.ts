import bcrypt from "bcryptjs";
import { query, queryOne, execute } from "../config/db";
import { createId } from "../utils/id";
import { ApiError } from "../utils/ApiError";
import {
  generateOtpCode,
  generateRefreshTokenValue,
  refreshTokenExpiryDate,
  signAccessToken,
} from "../utils/tokens";
import type { LoginInput, RegisterInput } from "../validation/auth.schema";

const SALT_ROUNDS = 12;

interface UserRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  passwordHash: string | null;
  role: string;
  isEmailVerified: number;
  isPhoneVerified: number;
  avatarUrl: string | null;
  isActive: number;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  referralCode: string | null;
  referredById: string | null;
}

async function issueTokenPair(user: { id: string; email: string; role: string }) {
  const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role as never });

  const refreshToken = generateRefreshTokenValue();
  await execute("INSERT INTO `RefreshToken` (id, token, userId, expiresAt, createdAt) VALUES (?, ?, ?, ?, NOW(3))", [
    createId(),
    refreshToken,
    user.id,
    refreshTokenExpiryDate(),
  ]);

  return { accessToken, refreshToken };
}

export async function register(input: RegisterInput) {
  const existing = await queryOne<UserRow>("SELECT * FROM `User` WHERE email = ? LIMIT 1", [input.email]);
  if (existing) {
    throw ApiError.conflict("An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const userId = createId();
  await execute(
    "INSERT INTO `User` (id, name, email, phone, passwordHash, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, 'CUSTOMER', NOW(3), NOW(3))",
    [userId, input.name, input.email, input.phone ?? null, passwordHash]
  );
  const user = await queryOne<UserRow>("SELECT * FROM `User` WHERE id = ? LIMIT 1", [userId]);
  if (!user) {
    throw ApiError.internal("Failed to create user");
  }

  await execute("INSERT INTO `Wallet` (id, userId, updatedAt) VALUES (?, ?, NOW(3))", [createId(), user.id]);

  const tokens = await issueTokenPair(user);
  return { user: sanitizeUser(user), ...tokens };
}

export async function login(input: LoginInput) {
  const user = await queryOne<UserRow>("SELECT * FROM `User` WHERE email = ? LIMIT 1", [input.email]);
  if (!user || !user.passwordHash) {
    throw ApiError.unauthorized("Invalid email or password");
  }
  if (!user.isActive) {
    throw ApiError.forbidden("This account has been deactivated");
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const tokens = await issueTokenPair(user);
  return { user: sanitizeUser(user), ...tokens };
}

export async function refreshAccessToken(refreshToken: string) {
  const stored = await queryOne<{
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
    revoked: number;
  }>("SELECT * FROM `RefreshToken` WHERE token = ? LIMIT 1", [refreshToken]);

  if (!stored || stored.revoked || new Date(stored.expiresAt) < new Date()) {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  const user = await queryOne<UserRow>("SELECT * FROM `User` WHERE id = ? LIMIT 1", [stored.userId]);
  if (!user) {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  const accessToken = signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role as never,
  });

  return { accessToken, user: sanitizeUser(user) };
}

export async function revokeRefreshToken(refreshToken: string) {
  await execute("UPDATE `RefreshToken` SET revoked = 1 WHERE token = ?", [refreshToken]);
}

export async function requestOtp(identifier: string, purpose: string) {
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const user = await queryOne<UserRow>("SELECT * FROM `User` WHERE email = ? OR phone = ? LIMIT 1", [
    identifier,
    identifier,
  ]);

  await execute(
    "INSERT INTO `OtpCode` (id, userId, identifier, code, purpose, expiresAt, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW(3))",
    [createId(), user?.id ?? null, identifier, code, purpose, expiresAt]
  );

  // NOTE: actual SMS/email dispatch happens in notification.service (Nodemailer wired in Phase 2/3).
  return { code, expiresAt };
}

export async function verifyOtp(identifier: string, code: string, purpose: string) {
  const otp = await queryOne<{ id: string }>(
    "SELECT id FROM `OtpCode` WHERE identifier = ? AND code = ? AND purpose = ? AND consumed = 0 AND expiresAt > NOW(3) ORDER BY createdAt DESC LIMIT 1",
    [identifier, code, purpose]
  );

  if (!otp) {
    throw ApiError.badRequest("Invalid or expired OTP");
  }

  await execute("UPDATE `OtpCode` SET consumed = 1 WHERE id = ?", [otp.id]);
  return true;
}

export function sanitizeUser<T extends { passwordHash?: string | null }>(user: T) {
  const { passwordHash, ...rest } = user;
  return rest;
}
