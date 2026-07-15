"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const sharp_1 = __importDefault(require("sharp"));
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiError_1 = require("../utils/ApiError");
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 82;
/**
 * Accepts a single image upload, downsizes/re-encodes it with sharp to keep the
 * base64 payload reasonable, and returns a data URI ready to store directly in
 * ProductImage.url (LONGTEXT) — no external file storage required.
 */
exports.uploadImage = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        throw ApiError_1.ApiError.badRequest("No image file provided");
    }
    const optimized = await (0, sharp_1.default)(req.file.buffer)
        .rotate()
        .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: JPEG_QUALITY })
        .toBuffer();
    const base64 = optimized.toString("base64");
    const dataUri = `data:image/jpeg;base64,${base64}`;
    res.json({
        success: true,
        data: { dataUri, sizeBytes: optimized.length },
    });
});
//# sourceMappingURL=upload.controller.js.map