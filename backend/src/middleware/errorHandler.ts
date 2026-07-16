import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";
import { logger } from "../config/logger";
import { prisma } from "../config/prisma";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function isPrismaEnginePanic(err: unknown): boolean {
  const message = err instanceof Error ? err.message : "";
  return message.includes("PANIC") || message.includes("Response from the Engine was empty");
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (isPrismaEnginePanic(err)) {
    // Hostinger suspends idle Node processes; on resume the Prisma query engine's
    // internal timers are invalid ("timer has gone away"). Disconnect so the next
    // query lazily reconnects with a fresh engine instead of reusing the dead one.
    logger.error("Prisma engine panic detected, forcing reconnect", {
      message: err instanceof Error ? err.message : String(err),
    });
    prisma.$disconnect().catch(() => undefined);
    return res.status(503).json({ success: false, message: "Service temporarily unavailable, please retry" });
  }


  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const key = issue.path.join(".") || "root";
      errors[key] = errors[key] ? [...errors[key], issue.message] : [issue.message];
    }
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  if (err instanceof ApiError) {
    if (err.statusCode >= 500) {
      logger.error(err.message, { stack: err.stack });
    }
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
    });
  }

  const message = err instanceof Error ? err.message : "Internal server error";
  logger.error(message, { stack: err instanceof Error ? err.stack : undefined });
  return res.status(500).json({ success: false, message: "Internal server error" });
}
