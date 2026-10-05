-- Standalone "Available Sizes" field on Product — independent of the
-- variant system (ProductVariant.size, used for per-size stock/price rows).
-- This is a simple multiselect of size labels (e.g. ["M","L","XL"]) shown
-- as informational/filterable chips on the storefront product detail page,
-- for products that don't need per-size stock tracking but still want to
-- communicate available sizes.
--
-- Same JSON column pattern as Category.enabledFields. Safe to re-run.
SET @hasSizes = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Product' AND COLUMN_NAME = 'availableSizes'
);
SET @sqlSizes = IF(
  @hasSizes = 0,
  'ALTER TABLE `Product` ADD COLUMN `availableSizes` JSON NULL AFTER `sareeLength`',
  'SELECT ''availableSizes already exists, skipping'''
);
PREPARE stmt FROM @sqlSizes;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
