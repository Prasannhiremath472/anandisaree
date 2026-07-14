import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { prisma } from "./config/prisma";

async function main() {
  const app = createApp();

  await prisma.$connect().catch((err) => {
    logger.warn(`Database not connected yet: ${err.message}`);
  });

  app.listen(env.PORT, () => {
    logger.info(`Anandi Saree API listening on port ${env.PORT} [${env.NODE_ENV}]`);
  });
}

main().catch((err) => {
  logger.error("Failed to start server", err);
  process.exit(1);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
