/**
 * Reads the filled-in Anandi_Sarees_Product_Upload_Template.xlsx and creates
 * each row as a real product via the admin API (same validation/upload path
 * the admin panel itself uses).
 *
 * Usage:
 *   node import_products.js <path-to-xlsx> <images-folder> <api-base-url> <admin-email> <admin-password-or-otp-flag>
 *
 * Example:
 *   node import_products.js ./Anandi_Sarees_Product_Upload_Template.xlsx ./images http://localhost:5000/api
 */
const ExcelJS = require("exceljs");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toBool(value) {
  if (value === undefined || value === null) return false;
  return String(value).trim().toUpperCase() === "YES";
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    })
  );
}

async function main() {
  const [, , xlsxPathArg, imagesDirArg, apiBaseArg] = process.argv;

  const xlsxPath = xlsxPathArg || path.resolve(__dirname, "Anandi_Sarees_Product_Upload_Template.xlsx");
  const imagesDir = imagesDirArg || path.resolve(__dirname, "images");
  const apiBase = apiBaseArg || "http://localhost:5000/api";

  if (!fs.existsSync(xlsxPath)) {
    console.error(`Excel file not found: ${xlsxPath}`);
    process.exit(1);
  }

  const email = await ask("Admin email: ");
  console.log(`An OTP has been requested — check ${email}'s inbox.`);

  const client = axios.create({ baseURL: apiBase });

  await client.post("/auth/otp/request", { identifier: email, purpose: "LOGIN" });
  const code = await ask("Enter the 6-digit OTP you received: ");
  const loginRes = await client.post("/auth/otp/verify", { identifier: email, code, purpose: "LOGIN" });
  const token = loginRes.data.data.accessToken;
  client.defaults.headers.common.Authorization = `Bearer ${token}`;
  console.log("Logged in.");

  const categoriesRes = await client.get("/admin/products/lookups/categories");
  const categoryByName = new Map(categoriesRes.data.data.map((c) => [c.name.trim().toLowerCase(), c.id]));

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(xlsxPath);
  const sheet = workbook.getWorksheet("Products");
  if (!sheet) {
    console.error('Could not find a "Products" sheet in the workbook.');
    process.exit(1);
  }

  const headerRow = sheet.getRow(1);
  const colIndex = {};
  headerRow.eachCell((cell, colNumber) => {
    const key = String(cell.value || "").replace("*", "").trim();
    colIndex[key] = colNumber;
  });

  const get = (row, header) => {
    const idx = colIndex[header];
    if (!idx) return undefined;
    const cell = row.getCell(idx);
    return cell.value === null || cell.value === undefined ? undefined : cell.value;
  };

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (let r = 2; r <= sheet.rowCount; r++) {
    const row = sheet.getRow(r);
    const sku = get(row, "SKU");
    const name = get(row, "Product Name");

    if (!sku || !name) continue; // blank row

    console.log(`\nRow ${r}: ${name} (${sku})`);

    try {
      const categoryName = String(get(row, "Category") || "").trim();
      const categoryId = categoryByName.get(categoryName.toLowerCase());
      if (categoryName && !categoryId) {
        console.warn(`  Warning: category "${categoryName}" not recognized — creating with no category.`);
      }

      const imageFileNamesRaw = String(get(row, "Image File Name") || "").trim();
      const imageFileNames = imageFileNamesRaw
        ? imageFileNamesRaw.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const images = [];
      for (let i = 0; i < imageFileNames.length; i++) {
        const fileName = imageFileNames[i];
        const filePath = path.join(imagesDir, fileName);
        if (!fs.existsSync(filePath)) {
          console.warn(`  Warning: image file not found, skipping: ${filePath}`);
          continue;
        }
        const buffer = fs.readFileSync(filePath);
        const ext = path.extname(fileName).toLowerCase();
        const mime = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
        const base64 = buffer.toString("base64");
        images.push({ url: `data:${mime};base64,${base64}`, isPrimary: i === 0 });
      }

      const payload = {
        sku: String(sku).trim(),
        name: String(name).trim(),
        slug: slugify(String(name)),
        fabric: String(get(row, "Fabric") || "").trim(),
        color: String(get(row, "Color") || "").trim(),
        mrp: Number(get(row, "MRP")),
        sellingPrice: Number(get(row, "Selling Price")),
        stockQuantity: Number(get(row, "Stock Quantity") ?? 0),
        sareeLength: Number(get(row, "Saree Length (m)")),
        shortDescription: get(row, "Short Description") ? String(get(row, "Short Description")) : undefined,
        description: get(row, "Description") ? String(get(row, "Description")) : undefined,
        washCare: get(row, "Wash Care") ? String(get(row, "Wash Care")) : undefined,
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
      };

      if (!payload.fabric || !payload.color || !Number.isFinite(payload.mrp) || !Number.isFinite(payload.sellingPrice) || !Number.isFinite(payload.sareeLength)) {
        console.warn("  Skipped: missing a required field (fabric, color, MRP, selling price, or saree length).");
        skipped++;
        continue;
      }

      await client.post("/admin/products", payload);
      console.log("  Created.");
      created++;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      console.error(`  Failed: ${message}`);
      failed++;
    }
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}, Failed: ${failed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
