"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllRead = exports.markRead = exports.listNotifications = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const notificationService = __importStar(require("../services/notification.service"));
exports.listNotifications = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit ?? "20"), 10) || 20));
    const result = await notificationService.listNotifications(limit);
    res.json({ success: true, data: result });
});
exports.markRead = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await notificationService.markNotificationRead(req.params.id);
    res.json({ success: true, data: null });
});
exports.markAllRead = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    await notificationService.markAllNotificationsRead();
    res.json({ success: true, data: null });
});
//# sourceMappingURL=notification.controller.js.map