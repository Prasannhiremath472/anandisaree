import nodemailer from "nodemailer";
import { env } from "../config/env";
import { logger } from "../config/logger";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });
  }
  return transporter;
}

export async function sendOtpEmail(to: string, code: string, purpose: string) {
  const transport = getTransporter();
  if (!transport) {
    logger.warn(`SMTP is not configured — OTP for ${to} was not emailed (code: ${code})`);
    return;
  }

  const purposeText =
    purpose === "RESET_PASSWORD" ? "reset your password" : purpose === "REGISTER" ? "verify your account" : "sign in";

  await transport.sendMail({
    from: env.SMTP_FROM,
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
