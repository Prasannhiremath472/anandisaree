# Bulk product upload

## 1. Fill in the template

Open `Anandi_Sarees_Product_Upload_Template.xlsx`:

- **Products** sheet — one row per product. Columns marked `*` are required.
- **Category** and **Fabric** have dropdowns.
- Type `YES` or `NO` for Blouse Included, Handloom, Featured, New Arrival, Best Seller,
  Today's Deal, Live Special Today, Top Selection.
- **Instructions** and **Reference** sheets have the full valid value lists.

Row 2 is a filled-in example — replace it or delete it.

## 2. Add a photo per product

Click the **Product Photo** cell for a row, then in Excel: **Insert → Pictures → This
Device**, pick the photo. Excel places it into that cell — one photo per row becomes
that product's main image. A photo is optional; rows without one are still created,
just with no image until you add one later from the admin panel.

## 3. Upload it

In the admin panel: **Products → Import from Excel**, choose the filled-in file, and
upload. Every row is created as a real product, and you'll see what was created,
skipped, or failed (with reasons) once it finishes. A bad row doesn't stop the rest
of the file from importing.

Re-running the same file is safe for rows that already succeeded — a duplicate SKU
is reported as a failure for that row only, nothing gets overwritten or duplicated.
