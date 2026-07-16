import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";

type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

function isPrismaEnginePanic(err: unknown): boolean {
  const message = err instanceof Error ? err.message : "";
  return message.includes("PANIC") || message.includes("Response from the Engine was empty");
}

export function asyncHandler(fn: AsyncRouteHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      if (!isPrismaEnginePanic(err)) {
        return next(err);
      }
      // Hostinger suspends idle Node processes; the resumed Prisma engine can panic
      // on its first query with a stale internal timer. Reconnect and retry once
      // before surfacing an error, so the crash is invisible to the caller.
      await prisma.$disconnect().catch(() => undefined);
      try {
        await fn(req, res, next);
      } catch (retryErr) {
        next(retryErr);
      }
    }
  };
}
