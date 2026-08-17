import ExcelJS from "exceljs";
import { query } from "../config/db";
import { createProduct } from "./product.service";
import { ApiError } from "../utils/ApiError";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toBool(value: unknown) {
  if (value === undefined || value === null) return false;
  return String(value).trim().toUpperCase() === "YES";
}

function cellText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && "text" in (value as Record<string, unknown>)) {
    return String((value as { text: unknown }).text ?? "");
  }
  if (typeof value === "object" && "result" in (value as Record<string, unknown>)) {
    return String((value as { result: unknown }).result ?? "");
  }
  return String(value);
}

interface RowResult {
  row: number;
  sku: string;
  name: string;
  status: "created" | "skipped" | "failed";
  message?: string;
}

export async function importProductsFromExcel(buffer: Buffer) {
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(buffer as never);
  } catch {
    throw ApiError.badRequest("Could not read this file — please upload a valid .xlsx file");
  }

  const sheet = workbook.getWorksheet("Products");
  if (!sheet) {
    throw ApiError.badRequest('Could not find a "Products" sheet in this workbook');
  }

  const headerRow = sheet.getRow(1);
  const colIndex: Record<string, number> = {};
  headerRow.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
    const key = cellText(cell.value).replace("*", "").trim();
    if (key) colIndex[key] = colNumber;
  });

  const get = (row: ExcelJS.Row, header: string): unknown => {
    const idx = colIndex[header];
    if (!idx) return undefined;
    const value = row.getCell(idx).value;
    return value === null ? undefined : value;
  };

  // Map each image to the row it's anchored on (0-indexed row -> +1 for Excel row number).
  const media = workbook.model.media as ExcelJS.Media[];
  const imagesByRow = new Map<number, { buffer: Buffer; extension: string }[]>();
  for (const img of sheet.getImages()) {
    const excelRow = img.range.tl.nativeRow + 1;
    const asset = media[Number(img.imageId)];
    if (!asset?.buffer) continue;
    const list = imagesByRow.get(excelRow) ?? [];
    list.push({ buffer: asset.buffer as unknown as Buffer, extension: asset.extension || "jpeg" });
    imagesByRow.set(excelRow, list);
  }

  const categories = await query<{ id: string; name: string }>(
    "SELECT id, name FROM `Category` WHERE deletedAt IS NULL"
  );
  const categoryByName = new Map(categories.map((c) => [c.name.trim().toLowerCase(), c.id]));

  const results: RowResult[] = [];

  for (let r = 2; r <= sheet.rowCount; r++) {
    const row = sheet.getRow(r);
    const sku = cellText(get(row, "SKU")).trim();
    const name = cellText(get(row, "Product Name")).trim();

    if (!sku && !name) continue; // fully blank row

    if (!sku || !name) {
      results.push({ row: r, sku, name, status: "skipped", message: "Missing SKU or Product Name" });
      continue;
    }

    try {
      const categoryName = cellText(get(row, "Category")).trim();
      const categoryId = categoryName ? categoryByName.get(categoryName.toLowerCase()) : undefined;

      const fabric = cellText(get(row, "Fabric")).trim();
      const color = cellText(get(row, "Color")).trim();
      const mrp = Number(get(row, "MRP"));
      const sellingPrice = Number(get(row, "Selling Price"));
      const sareeLength = Number(get(row, "Saree Length (m)"));
      const stockQuantity = Number(get(row, "Stock Quantity") ?? 0);

      if (!fabric || !color || !Number.isFinite(mrp) || !Number.isFinite(sellingPrice) || !Number.isFinite(sareeLength)) {
        results.push({
          row: r,
          sku,
          name,
          status: "skipped",
          message: "Missing a required field (Fabric, Color, MRP, Selling Price or Saree Length)",
        });
        continue;
      }

      const rowImages = imagesByRow.get(r) ?? [];
      const images = rowImages.map((img, i) => ({
        url: `data:image/${img.extension};base64,${img.buffer.toString("base64")}`,
        isPrimary: i === 0,
      }));

      await createProduct({
        sku,
        name,
        slug: slugify(name),
        fabric,
        color,
        mrp,
        sellingPrice,
        stockQuantity: Number.isFinite(stockQuantity) ? stockQuantity : 0,
        sareeLength,
        shortDescription: cellText(get(row, "Short Description")).trim() || undefined,
        description: cellText(get(row, "Description")).trim() || undefined,
        washCare: cellText(get(row, "Wash Care")).trim() || undefined,
        blouseIncluded: toBool(get(row, "Blouse Included")),
        isHandloom: toBool(get(row, "Handloom")),
        isFeatured: toBool(get(row, "Featured")),
        isNewArrival: toBool(get(row, "New Arrival")),
        isBestSeller: toBool(get(row, "Best Seller")),
        isTodaysDeal: toBool(get(row, "Today's Deal")),
        isLiveSpecial: toBool(get(row, "Live Special Today")),
        isTopSelection: toBool(get(row, "Top Selection")),
        isActive: true,
        categoryIds: categoryId ? [categoryId] : undefined,
        images: images.length ? images : undefined,
      });

      results.push({ row: r, sku, name, status: "created" });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Unexpected error";
      results.push({ row: r, sku, name, status: "failed", message });
    }
  }

  const created = results.filter((r) => r.status === "created").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const failed = results.filter((r) => r.status === "failed").length;

  return { created, skipped, failed, results };
}
