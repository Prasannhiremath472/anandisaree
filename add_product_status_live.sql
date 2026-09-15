-- Adds a manual product status (Active / Inactive / Out of Stock) independent
-- of stockQuantity, so the admin can mark a product out-of-stock even with
-- units remaining, or reactivate it manually. isActive stays in sync (kept
-- for any code still reading the boolean, e.g. storefront visibility) via
-- the application layer, not a DB trigger.
--
-- Safe to re-run: skips the ALTER if `status` already exists (e.g. if this
-- script was already applied once).
SET @columnExists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Product' AND COLUMN_NAME = 'status'
);

SET @sql = IF(
  @columnExists = 0,
  'ALTER TABLE `Product` ADD COLUMN `status` ENUM(''ACTIVE'', ''INACTIVE'', ''OUT_OF_STOCK'') NOT NULL DEFAULT ''ACTIVE'' AFTER `isActive`, ADD INDEX `Product_status_idx` (`status`)',
  'SELECT ''status column already exists, skipping'''
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Backfill: existing rows follow their current isActive flag.
UPDATE `Product` SET `status` = 'INACTIVE' WHERE `isActive` = 0;
