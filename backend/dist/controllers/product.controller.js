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
exports.listBrandsLookup = exports.listCategoriesLookup = exports.bulkDeleteProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.listProducts = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const pagination_1 = require("../utils/pagination");
const productService = __importStar(require("../services/product.service"));
const product_schema_1 = require("../validation/product.schema");
const zod_1 = require("zod");
const db_1 = require("../config/db");
exports.listProducts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const query = product_schema_1.productListQuerySchema.parse(req.query);
    const pagination = (0, pagination_1.getPagination)(req);
    const result = await productService.listProducts(pagination, query);
    res.json({ success: true, data: result });
});
exports.getProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    res.json({ success: true, data: product });
});
exports.createProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = product_schema_1.productCreateSchema.parse(req.body);
    const product = await productService.createProduct(input);
    res.status(201).json({ success: true, data: product });
});
exports.updateProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = product_schema_1.productUpdateSchema.parse(req.body);
    const product = await productService.updateProduct(req.params.id, input);
    res.json({ success: true, data: product });
});
exports.deleteProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await productService.softDeleteProduct(req.params.id);
    res.json({ success: true, data: null, message: "Product deleted" });
});
const bulkDeleteSchema = zod_1.z.object({ ids: zod_1.z.array(zod_1.z.string()).min(1) });
exports.bulkDeleteProducts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { ids } = bulkDeleteSchema.parse(req.body);
    await productService.bulkDeleteProducts(ids);
    res.json({ success: true, data: null, message: `${ids.length} products deleted` });
});
exports.listCategoriesLookup = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const categories = await (0, db_1.query)("SELECT id, name, slug, `group`, parentId FROM `Category` WHERE deletedAt IS NULL ORDER BY `group` ASC, sortOrder ASC");
    res.json({ success: true, data: categories });
});
exports.listBrandsLookup = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const brands = await (0, db_1.query)("SELECT id, name FROM `Brand` WHERE isActive = 1");
    res.json({ success: true, data: brands });
});
//# sourceMappingURL=product.controller.js.map