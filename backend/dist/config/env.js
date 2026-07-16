"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProd = exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function required(name, fallback) {
    const value = process.env[name] ?? fallback;
    if (value === undefined) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
// Prisma reads DATABASE_URL directly from process.env, so if it isn't set
// but the individual DB_* parts are, build and export it before anything
// else runs. This also sidesteps hand-encoding mistakes in a manually
// assembled connection string (e.g. special characters in the password).
if (!process.env.DATABASE_URL && process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME) {
    const user = encodeURIComponent(process.env.DB_USER);
    const password = encodeURIComponent(process.env.DB_PASSWORD ?? "");
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT ?? "3306";
    const name = process.env.DB_NAME;
    process.env.DATABASE_URL = `mysql://${user}:${password}@${host}:${port}/${name}`;
}
// TEMPORARY diagnostic: confirm what DATABASE_URL actually resolves to at
// runtime, with the password redacted. Remove once the connection issue
// is resolved.
if (process.env.DATABASE_URL) {
    console.log("[env-debug] DATABASE_URL resolved to:", process.env.DATABASE_URL.replace(/:([^:@]+)@/, ":***@"));
}
else {
    console.log("[env-debug] DATABASE_URL is NOT set at all");
}
exports.env = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: Number(process.env.PORT ?? 5000),
    CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:5173",
    ADMIN_URL: process.env.ADMIN_URL ?? "http://localhost:5174",
    DATABASE_URL: required("DATABASE_URL", "mysql://user:password@localhost:3306/anandisaree"),
    JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET", "dev_access_secret_change_me"),
    JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET", "dev_refresh_secret_change_me"),
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? "30d",
    SMTP_HOST: process.env.SMTP_HOST ?? "",
    SMTP_PORT: Number(process.env.SMTP_PORT ?? 587),
    SMTP_USER: process.env.SMTP_USER ?? "",
    SMTP_PASS: process.env.SMTP_PASS ?? "",
    SMTP_FROM: process.env.SMTP_FROM ?? "Anandi Saree <no-reply@anandisaree.com>",
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ?? "",
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ?? "",
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ?? "",
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ?? "",
    COOKIE_SECRET: process.env.COOKIE_SECRET ?? "dev_cookie_secret_change_me",
};
exports.isProd = exports.env.NODE_ENV === "production";
//# sourceMappingURL=env.js.map