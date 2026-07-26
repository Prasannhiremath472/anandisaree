"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiError_1 = require("../utils/ApiError");
/**
 * Accepts a single image upload and returns it as a data URI ready to store
 * directly in ProductImage.url (LONGTEXT) — no external file storage, and no
 * server-side resizing/re-encoding (sharp's native binary isn't reliable on
 * this host, so images are stored at their original size/format instead).
 */
exports.uploadImage = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        throw ApiError_1.ApiError.badRequest("No image file provided");
    }
    const base64 = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;
    res.json({
        success: true,
        data: { dataUri, sizeBytes: req.file.buffer.length },
    });
});
//# sourceMappingURL=upload.controller.js.map