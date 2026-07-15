"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./config/env");
const rateLimiter_1 = require("./middleware/rateLimiter");
const errorHandler_1 = require("./middleware/errorHandler");
const routes_1 = __importDefault(require("./routes"));
function createApp() {
    const app = (0, express_1.default)();
    app.set("trust proxy", 1);
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: [env_1.env.CLIENT_URL, env_1.env.ADMIN_URL],
        credentials: true,
    }));
    app.use((0, compression_1.default)());
    app.use(express_1.default.json({ limit: "20mb" }));
    app.use(express_1.default.urlencoded({ extended: true, limit: "20mb" }));
    app.use((0, cookie_parser_1.default)(env_1.env.COOKIE_SECRET));
    app.use("/api", rateLimiter_1.apiLimiter);
    app.use("/api", routes_1.default);
    app.use(errorHandler_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map