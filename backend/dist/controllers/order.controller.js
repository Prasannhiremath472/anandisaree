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
exports.getDashboardSummary = exports.updateOrderStatus = exports.getOrder = exports.listOrders = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const pagination_1 = require("../utils/pagination");
const orderService = __importStar(require("../services/order.service"));
const order_schema_1 = require("../validation/order.schema");
exports.listOrders = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const query = order_schema_1.orderListQuerySchema.parse(req.query);
    const pagination = (0, pagination_1.getPagination)(req);
    const result = await orderService.listOrders(pagination, query);
    res.json({ success: true, data: result });
});
exports.getOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const order = await orderService.getOrderById(req.params.id);
    res.json({ success: true, data: order });
});
exports.updateOrderStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = order_schema_1.orderStatusUpdateSchema.parse(req.body);
    const order = await orderService.updateOrderStatus(req.params.id, input, req.user?.userId);
    res.json({ success: true, data: order });
});
exports.getDashboardSummary = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const summary = await orderService.getDashboardSummary();
    res.json({ success: true, data: summary });
});
//# sourceMappingURL=order.controller.js.map