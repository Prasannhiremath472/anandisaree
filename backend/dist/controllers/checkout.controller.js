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
exports.listMyOrders = exports.verifyPayment = exports.createOrder = exports.createAddress = exports.listAddresses = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const checkoutService = __importStar(require("../services/checkout.service"));
const checkout_schema_1 = require("../validation/checkout.schema");
exports.listAddresses = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const addresses = await checkoutService.listAddresses(req.user.userId);
    res.json({ success: true, data: addresses });
});
exports.createAddress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = checkout_schema_1.addressSchema.parse(req.body);
    const address = await checkoutService.createAddress(req.user.userId, input);
    res.status(201).json({ success: true, data: address });
});
exports.createOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = checkout_schema_1.createOrderSchema.parse(req.body);
    const order = await checkoutService.createOrder(req.user.userId, input);
    res.status(201).json({ success: true, data: order });
});
exports.verifyPayment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = checkout_schema_1.verifyPaymentSchema.parse(req.body);
    const result = await checkoutService.verifyPayment(req.user.userId, input);
    res.json({ success: true, data: result });
});
exports.listMyOrders = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const orders = await checkoutService.listMyOrders(req.user.userId);
    res.json({ success: true, data: orders });
});
//# sourceMappingURL=checkout.controller.js.map