"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = sendOtpEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const logger_1 = require("../config/logger");
let transporter = null;
function getTransporter() {
    if (!env_1.env.SMTP_HOST || !env_1.env.SMTP_USER || !env_1.env.SMTP_PASS) {
        return null;
    }
    if (!transporter) {
        transporter = nodemailer_1.default.createTransport({
            host: env_1.env.SMTP_HOST,
            port: env_1.env.SMTP_PORT,
            secure: env_1.env.SMTP_PORT === 465,
            auth: { user: env_1.env.SMTP_USER, pass: env_1.env.SMTP_PASS },
        });
    }
    return transporter;
}
async function sendOtpEmail(to, code, purpose) {
    const transport = getTransporter();
    if (!transport) {
        logger_1.logger.warn(`SMTP is not configured — OTP for ${to} was not emailed (code: ${code})`);
        return;
    }
    const purposeText = purpose === "RESET_PASSWORD" ? "reset your password" : purpose === "REGISTER" ? "verify your account" : "sign in";
    await transport.sendMail({
        from: env_1.env.SMTP_FROM,
        to,
        subject: `Your Anandi Sarees verification code: ${code}`,
        html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px; color: #1a1a1a;">
        <h2 style="color: #54208C; margin-bottom: 4px;">Anandi Sarees</h2>
        <p style="font-size: 15px; color: #444;">Use the code below to ${purposeText}.</p>
        <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #54208C; margin: 24px 0; text-align: center;">
          ${code}
        </div>
        <p style="font-size: 13px; color: #777;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
    });
}
//# sourceMappingURL=mailer.service.js.map