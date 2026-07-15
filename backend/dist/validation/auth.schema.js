"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.verifyOtpSchema = exports.requestOtpSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters").max(100),
    email: zod_1.z.string().email("Invalid email address"),
    phone: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number")
        .optional(),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[a-z]/, "Password must contain a lowercase letter")
        .regex(/[0-9]/, "Password must contain a number"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.requestOtpSchema = zod_1.z.object({
    identifier: zod_1.z.string().min(3, "Email or phone is required"),
    purpose: zod_1.z.enum(["LOGIN", "REGISTER", "RESET_PASSWORD"]),
});
exports.verifyOtpSchema = zod_1.z.object({
    identifier: zod_1.z.string().min(3),
    code: zod_1.z.string().length(6, "OTP must be 6 digits"),
    purpose: zod_1.z.enum(["LOGIN", "REGISTER", "RESET_PASSWORD"]),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
});
exports.resetPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    code: zod_1.z.string().length(6, "OTP must be 6 digits"),
    newPassword: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[a-z]/, "Password must contain a lowercase letter")
        .regex(/[0-9]/, "Password must contain a number"),
});
//# sourceMappingURL=auth.schema.js.map