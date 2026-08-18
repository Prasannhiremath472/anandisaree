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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const productController = __importStar(require("../controllers/product.controller"));
const auth_1 = require("../middleware/auth");
const roles_1 = require("../utils/roles");
const ApiError_1 = require("../utils/ApiError");
const excelUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const isExcel = file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            file.originalname.toLowerCase().endsWith(".xlsx");
        if (!isExcel) {
            return cb(ApiError_1.ApiError.badRequest("Please upload a .xlsx file"));
        }
        cb(null, true);
    },
});
const router = (0, express_1.Router)();
router.use(auth_1.authenticate, (0, auth_1.authorize)(...roles_1.INVENTORY_ROLES));
router.get("/", productController.listProducts);
router.get("/lookups/categories", productController.listCategoriesLookup);
router.get("/lookups/brands", productController.listBrandsLookup);
router.post("/generate-description", productController.generateDescription);
router.post("/import", excelUpload.single("file"), productController.importProducts);
router.get("/:id", productController.getProduct);
router.post("/", productController.createProduct);
router.post("/bulk-delete", productController.bulkDeleteProducts);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
exports.default = router;
//# sourceMappingURL=product.routes.js.map