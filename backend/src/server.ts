import { env } from "./config/env";
import { createApp } from "./app";
import { logger } from "./config/logger";
import { pool } from "./config/db";

async function main() {
  const app = createApp();

  await pool.query("SELECT 1").catch((err) => {
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
  await pool.end();
  process.exit(0);
});
