import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { isProd } from "../config/env";
import * as authService from "../services/auth.service";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  requestOtpSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from "../validation/auth.schema";
import { prisma } from "../config/prisma";
import bcrypt from "bcryptjs";
import { ApiError } from "../utils/ApiError";
import { generateRefreshTokenValue, refreshTokenExpiryDate, signAccessToken } from "../utils/tokens";

const REFRESH_COOKIE = "refreshToken";

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/api/auth",
  });
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = registerSchema.parse(req.body);
  const result = await authService.register(input);
  setRefreshCookie(res, result.refreshToken);
  res.status(201).json({ success: true, data: { user: result.user, accessToken: result.accessToken } });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = loginSchema.parse(req.body);
  const result = await authService.login(input);
  setRefreshCookie(res, result.refreshToken);
  res.json({ success: true, data: { user: result.user, accessToken: result.accessToken } });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) throw ApiError.unauthorized("Refresh token missing");
  const result = await authService.refreshAccessToken(token);
  res.json({ success: true, data: result });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (token) await authService.revokeRefreshToken(token);
  res.clearCookie(REFRESH_COOKIE, { path: "/api/auth" });
  res.json({ success: true, data: null, message: "Logged out" });
});

export const requestOtp = asyncHandler(async (req: Request, res: Response) => {
  const input = requestOtpSchema.parse(req.body);
  await authService.requestOtp(input.identifier, input.purpose);
  res.json({ success: true, data: null, message: "OTP sent" });
});

export const verifyOtpAndLogin = asyncHandler(async (req: Request, res: Response) => {
  const input = verifyOtpSchema.parse(req.body);
  await authService.verifyOtp(input.identifier, input.code, input.purpose);

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: input.identifier }, { phone: input.identifier }] },
  });
  if (!user) throw ApiError.notFound("No account found for this identifier");

  const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role as never });
  const refreshToken = generateRefreshTokenValue();
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt: refreshTokenExpiryDate() },
  });

  setRefreshCookie(res, refreshToken);
  res.json({ success: true, data: { user: authService.sanitizeUser(user), accessToken } });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const input = forgotPasswordSchema.parse(req.body);
  await authService.requestOtp(input.email, "RESET_PASSWORD");
  res.json({ success: true, data: null, message: "Password reset OTP sent" });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const input = resetPasswordSchema.parse(req.body);
  await authService.verifyOtp(input.email, input.code, "RESET_PASSWORD");

  const passwordHash = await bcrypt.hash(input.newPassword, 12);
  await prisma.user.update({ where: { email: input.email }, data: { passwordHash } });

  res.json({ success: true, data: null, message: "Password reset successful" });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) throw ApiError.notFound("User not found");
  res.json({ success: true, data: authService.sanitizeUser(user) });
});
