const ExcelJS = require("exceljs");
const path = require("path");

const MAHARASHTRIAN_CATEGORIES = [
  "Paithani Sarees", "Nauvari Sarees (9 Yards)", "Peshwai Sarees", "Narayan Peth Sarees",
  "Solapuri Cotton Sarees", "Ilkal Sarees", "Khun Fabric Sarees", "Maharashtrian Bridal Sarees",
  "Maharashtrian Wedding Collection", "Maharashtrian Festive Collection", "Maharashtrian Haldi Collection",
  "Maharashtrian Reception Collection", "Maharashtrian Traditional Wear",
];

const PAN_INDIAN_CATEGORIES = [
  "Banarasi Silk", "Kanjivaram Silk", "Patola", "Bandhani", "Chanderi", "Maheshwari", "Kota Doria",
  "Tussar Silk", "Organza", "Linen", "Cotton", "Georgette", "Chiffon", "Crepe", "Satin Silk",
  "Soft Silk", "Tissue Silk", "Handloom Collection", "Printed Sarees", "Embroidered Sarees",
  "Party Wear Sarees", "Office Wear Sarees", "Casual Wear Sarees", "Designer Sarees",
  "Wedding Collection", "Festive Collection", "Luxury Collection",
];

const ALL_CATEGORIES = [...MAHARASHTRIAN_CATEGORIES, ...PAN_INDIAN_CATEGORIES];

const FABRICS = [
  "Pure Silk", "Semi Silk", "Cotton", "Cotton Silk", "Linen", "Organza", "Chiffon", "Georgette",
  "Tissue", "Tussar Silk", "Banarasi Silk", "Kanjivaram Silk", "Khun Fabric", "Modal Silk",
  "Crepe", "Satin", "Art Silk",
];

const YES_NO = ["YES", "NO"];

const COLUMNS = [
  { header: "SKU*", key: "sku", width: 20, note: "Unique product code, e.g. AS-PAITHANI-001" },
  { header: "Product Name*", key: "name", width: 32, note: "e.g. Yeola Pure Silk Paithani - Peacock Motif" },
  { header: "Category*", key: "category", width: 26, note: "Pick from dropdown" },
  { header: "Fabric*", key: "fabric", width: 16, note: "Pick from dropdown" },
  { header: "Color*", key: "color", width: 16, note: "e.g. Peacock Blue" },
  { header: "MRP*", key: "mrp", width: 12, note: "Original price in Rs, e.g. 4999" },
  { header: "Selling Price*", key: "sellingPrice", width: 14, note: "Discounted/actual selling price in Rs" },
  { header: "Stock Quantity*", key: "stockQuantity", width: 14, note: "How many pieces in stock" },
  { header: "Saree Length (m)*", key: "sareeLength", width: 16, note: "e.g. 6.3" },
  { header: "Short Description", key: "shortDescription", width: 32, note: "One-line summary shown on product cards" },
  { header: "Description", key: "description", width: 40, note: "Full product description (optional, can Generate with AI later)" },
  { header: "Wash Care", key: "washCare", width: 28, note: "e.g. Dry clean only" },
  { header: "Blouse Included", key: "blouseIncluded", width: 14, note: "YES or NO" },
  { header: "Handloom", key: "isHandloom", width: 12, note: "YES or NO" },
  { header: "Product Photo", key: "photo", width: 22, note: "Insert a picture directly into this cell (Insert > Pictures > Place in Cell). First photo becomes the main image." },
  { header: "Featured", key: "isFeatured", width: 12, note: "YES or NO - shows in Featured section" },
  { header: "New Arrival", key: "isNewArrival", width: 12, note: "YES or NO" },
  { header: "Best Seller", key: "isBestSeller", width: 12, note: "YES or NO" },
  { header: "Today's Deal", key: "isTodaysDeal", width: 12, note: "YES or NO" },
  { header: "Live Special Today", key: "isLiveSpecial", width: 16, note: "YES or NO" },
  { header: "Top Selection", key: "isTopSelection", width: 14, note: "YES or NO" },
];

async function main() {
  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet("Products");
  sheet.columns = COLUMNS.map((c) => ({ header: c.header, key: c.key, width: c.width }));

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF54208C" } };
  headerRow.alignment = { vertical: "middle", wrapText: true };
  headerRow.height = 34;

  COLUMNS.forEach((c, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.note = c.note;
  });

  // Add 200 blank data rows with dropdown validation.
  const ROW_COUNT = 200;
  const categoryColIdx = COLUMNS.findIndex((c) => c.key === "category") + 1;
  const fabricColIdx = COLUMNS.findIndex((c) => c.key === "fabric") + 1;
  const yesNoCols = COLUMNS.filter((c) =>
    ["blouseIncluded", "isHandloom", "isFeatured", "isNewArrival", "isBestSeller", "isTodaysDeal", "isLiveSpecial", "isTopSelection"].includes(c.key)
  ).map((c) => COLUMNS.findIndex((x) => x.key === c.key) + 1);

  for (let r = 2; r <= ROW_COUNT + 1; r++) {
    sheet.getCell(r, categoryColIdx).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [`"${ALL_CATEGORIES.join(",")}"`],
      showErrorMessage: true,
      errorTitle: "Invalid category",
      error: "Please pick a category from the dropdown list.",
    };
    sheet.getCell(r, fabricColIdx).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [`"${FABRICS.join(",")}"`],
      showErrorMessage: true,
      errorTitle: "Invalid fabric",
      error: "Please pick a fabric from the dropdown list.",
    };
    for (const colIdx of yesNoCols) {
      sheet.getCell(r, colIdx).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [`"${YES_NO.join(",")}"`],
      };
    }
  }

  sheet.getRow(2).values = {
    sku: "AS-PAITHANI-001",
    name: "Yeola Pure Silk Paithani - Peacock Motif",
    category: "Paithani Sarees",
    fabric: "Pure Silk",
    color: "Peacock Blue",
    mrp: 8999,
    sellingPrice: 5999,
    stockQuantity: 5,
    sareeLength: 6.3,
    shortDescription: "Hand-woven pure silk Paithani with peacock motif border",
    description: "",
    washCare: "Dry clean only",
    blouseIncluded: "YES",
    isHandloom: "YES",
    photo: "",
    isFeatured: "NO",
    isNewArrival: "YES",
    isBestSeller: "NO",
    isTodaysDeal: "NO",
    isLiveSpecial: "NO",
    isTopSelection: "NO",
  };
  sheet.getRow(2).font = { italic: true, color: { argb: "FF999999" } };
  sheet.getRow(2).eachCell((cell) => {
    cell.note = "Example row - replace with your real product, or delete this row";
  });

  // Give every data row enough height that an inserted photo is visible in the cell.
  const PHOTO_ROW_HEIGHT = 90;
  for (let r = 2; r <= ROW_COUNT + 1; r++) {
    sheet.getRow(r).height = PHOTO_ROW_HEIGHT;
  }

  sheet.views = [{ state: "frozen", ySplit: 1 }];

  // Reference sheet listing valid values.
  const refSheet = workbook.addWorksheet("Reference (do not edit)");
  refSheet.columns = [
    { header: "Maharashtrian Categories", key: "a", width: 32 },
    { header: "Pan-Indian Categories", key: "b", width: 26 },
    { header: "Fabrics", key: "c", width: 18 },
  ];
  refSheet.getRow(1).font = { bold: true };
  const maxLen = Math.max(MAHARASHTRIAN_CATEGORIES.length, PAN_INDIAN_CATEGORIES.length, FABRICS.length);
  for (let i = 0; i < maxLen; i++) {
    refSheet.addRow({
      a: MAHARASHTRIAN_CATEGORIES[i] ?? "",
      b: PAN_INDIAN_CATEGORIES[i] ?? "",
      c: FABRICS[i] ?? "",
    });
  }

  // Instructions sheet.
  const infoSheet = workbook.addWorksheet("Instructions");
  infoSheet.columns = [{ key: "text", width: 100 }];
  const lines = [
    "HOW TO USE THIS TEMPLATE",
    "",
    "1. Fill in the 'Products' sheet - one row per product. Columns marked with * are required.",
    "2. Category and Fabric have dropdowns - click the cell and choose from the list.",
    "3. For Blouse Included, Handloom, and all the Featured/New Arrival/etc columns, type YES or NO.",
    "4. To add a photo: click the 'Product Photo' cell for that row, then in Excel go to",
    "   Insert > Pictures > This Device, pick the photo, and Excel will place it in that cell.",
    "   (If it doesn't land inside the cell, right-click the picture > Size and Properties >",
    "   set 'Move and size with cells'.) One photo per row becomes that product's main image.",
    "5. Delete the example row (row 2) once you understand the format, or overwrite it with a real product.",
    "6. SKU must be unique for every product - use your own numbering, e.g. AS-PAITHANI-001, AS-PAITHANI-002...",
    "7. Save the file and upload it directly from the admin panel: Products > Import from Excel.",
    "",
    "Notes:",
    "- MRP and Selling Price should be plain numbers (no currency symbol or commas), e.g. 4999",
    "- Saree Length is in meters, e.g. 6.3",
    "- Description can be left blank - it can be generated later from the admin panel using 'Generate with AI'",
    "- A product photo is optional but recommended - rows without one are still created, just with no image",
    "  until you add one later from the admin panel.",
  ];
  lines.forEach((l) => infoSheet.addRow([l]));
  infoSheet.getRow(1).font = { bold: true, size: 14 };

  const outPath = path.resolve(__dirname, "Anandi_Sarees_Product_Upload_Template.xlsx");
  await workbook.xlsx.writeFile(outPath);
  console.log("Written to", outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
