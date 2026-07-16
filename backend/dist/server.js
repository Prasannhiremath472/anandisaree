"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./config/env");
const app_1 = require("./app");
const logger_1 = require("./config/logger");
const db_1 = require("./config/db");
async function main() {
    const app = (0, app_1.createApp)();
    await db_1.pool.query("SELECT 1").catch((err) => {
        logger_1.logger.warn(`Database not connected yet: ${err.message}`);
    });
    app.listen(env_1.env.PORT, () => {
        logger_1.logger.info(`Anandi Saree API listening on port ${env_1.env.PORT} [${env_1.env.NODE_ENV}]`);
    });
}
main().catch((err) => {
    logger_1.logger.error("Failed to start server", err);
    process.exit(1);
});
process.on("SIGTERM", async () => {
    await db_1.pool.end();
    process.exit(0);
});
//# sourceMappingURL=server.js.map