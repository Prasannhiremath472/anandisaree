import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import {
  generateOtpCode,
  generateRefreshTokenValue,
  refreshTokenExpiryDate,
  signAccessToken,
} from "../utils/tokens";
import type { LoginInput, RegisterInput } from "../validation/auth.schema";

const SALT_ROUNDS = 12;

async function issueTokenPair(user: { id: string; email: string; role: string }) {
  const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role as never });

  const refreshToken = generateRefreshTokenValue();
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshTokenExpiryDate(),
    },
  });

  return { accessToken, refreshToken };
}

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw ApiError.conflict("An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      passwordHash,
      role: "CUSTOMER",
    },
  });

  await prisma.wallet.create({ data: { userId: user.id } });

  const tokens = await issueTokenPair(user);
  return { user: sanitizeUser(user), ...tokens };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
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
  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!stored || stored.revoked || stored.expiresAt < new Date()) {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  const accessToken = signAccessToken({
    userId: stored.user.id,
    email: stored.user.email,
    role: stored.user.role as never,
  });

  return { accessToken, user: sanitizeUser(stored.user) };
}

export async function revokeRefreshToken(refreshToken: string) {
  await prisma.refreshToken.updateMany({
    where: { token: refreshToken },
    data: { revoked: true },
  });
}

export async function requestOtp(identifier: string, purpose: string) {
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { phone: identifier }] },
  });

  await prisma.otpCode.create({
    data: { identifier, code, purpose, expiresAt, userId: user?.id },
  });

  // NOTE: actual SMS/email dispatch happens in notification.service (Nodemailer wired in Phase 2/3).
  return { code, expiresAt };
}

export async function verifyOtp(identifier: string, code: string, purpose: string) {
  const otp = await prisma.otpCode.findFirst({
    where: { identifier, code, purpose, consumed: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) {
    throw ApiError.badRequest("Invalid or expired OTP");
  }

  await prisma.otpCode.update({ where: { id: otp.id }, data: { consumed: true } });
  return true;
}

export function sanitizeUser<T extends { passwordHash?: string | null }>(user: T) {
  const { passwordHash, ...rest } = user;
  return rest;
}
