# Bulk product upload

## 1. Fill in the template

Open `Anandi_Sarees_Product_Upload_Template.xlsx`:

- **Products** sheet — one row per product. Columns marked `*` are required.
- **Category** and **Fabric** have dropdowns.
- Type `YES` or `NO` for Blouse Included, Handloom, Featured, New Arrival, Best Seller,
  Today's Deal, Live Special Today, Top Selection.
- **Instructions** and **Reference** sheets have the full valid value lists.

Row 2 is a filled-in example — replace it or delete it.

## 2. Add photos

Put product photos in the `images/` folder next to the Excel file. In the
**Image File Name** column, type the exact file name (e.g. `paithani-001.jpg`).
Multiple images for one product: separate file names with a comma.

## 3. Run the import

```
cd product_import
npm install --no-save exceljs axios
node import_products.js Anandi_Sarees_Product_Upload_Template.xlsx images http://localhost:5000/api
```

For the live site, use the production API URL instead of localhost, e.g.:

```
node import_products.js Anandi_Sarees_Product_Upload_Template.xlsx images https://anandisarees.com/api
```

It will ask for an admin email, send a one-time code to that inbox, then ask you
to type the code — same login as the admin panel. It then creates every row as
a real product and reports what was created, skipped, or failed (with reasons)
at the end. Rows that fail don't stop the rest of the file from importing.

Re-running the same file is safe for rows that already succeeded — a duplicate
SKU is reported as a failure for that row only, nothing gets overwritten or
duplicated.
