import { Router } from "express";
import multer from "multer";
import * as productController from "../controllers/product.controller";
import { authenticate, authorize } from "../middleware/auth";
import { INVENTORY_ROLES } from "../utils/roles";
import { ApiError } from "../utils/ApiError";

const excelUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const isExcel =
      file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.originalname.toLowerCase().endsWith(".xlsx");
    if (!isExcel) {
      return cb(ApiError.badRequest("Please upload a .xlsx file") as unknown as Error);
    }
    cb(null, true);
  },
});

const router = Router();

router.use(authenticate, authorize(...INVENTORY_ROLES));

router.get("/", productController.listProducts);
router.get("/trash", productController.listTrashedProducts);
router.get("/next-sku", productController.getNextSku);
router.get("/variant-values", productController.listVariantValues);
router.get("/export", productController.exportProducts);
router.get("/lookups/categories", productController.listCategoriesLookup);
router.get("/lookups/brands", productController.listBrandsLookup);
router.post("/generate-description", productController.generateDescription);
router.post("/import", excelUpload.single("file"), productController.importProducts);
router.get("/:id", productController.getProduct);
router.post("/", productController.createProduct);
router.post("/bulk-delete", productController.bulkDeleteProducts);
router.put("/:id", productController.updateProduct);
router.patch("/:id/status", productController.updateProductStatus);
router.post("/:id/restore", productController.restoreProduct);
router.delete("/:id/permanent", productController.permanentlyDeleteProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
