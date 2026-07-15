import { Router } from "express";
import multer from "multer";
import * as uploadController from "../controllers/upload.controller";
import { authenticate, authorize } from "../middleware/auth";
import { INVENTORY_ROLES } from "../utils/roles";
import { ApiError } from "../utils/ApiError";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB raw upload cap, before sharp compresses it
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
