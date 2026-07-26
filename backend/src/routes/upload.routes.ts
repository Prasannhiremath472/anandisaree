import { Router } from "express";
import multer from "multer";
import * as uploadController from "../controllers/upload.controller";
import { authenticate, authorize } from "../middleware/auth";
import { INVENTORY_ROLES } from "../utils/roles";
import { ApiError } from "../utils/ApiError";

const upload = multer({
  storage: multer.memoryStorage(),
  // Images are stored as-is (no server-side resize/compression), so this cap
  // is the actual stored size, inflated ~33% again once base64-encoded.
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(ApiError.badRequest("Only image files are allowed") as unknown as Error);
    }
    cb(null, true);
  },
});

const router = Router();

router.use(authenticate, authorize(...INVENTORY_ROLES));

router.post("/image", upload.single("image"), uploadController.uploadImage);

export default router;
