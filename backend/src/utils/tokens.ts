import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env";
import type { JwtPayload } from "../types/shared";

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
}

export function generateRefreshTokenValue(): string {
  return crypto.randomBytes(48).toString("hex");
}

export function refreshTokenExpiryDate(): Date {
  const days = parseInt(env.JWT_REFRESH_EXPIRES_IN.replace(/[^\d]/g, ""), 10) || 30;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export function generateOtpCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}
