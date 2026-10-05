-- ============================================================
-- Hostinger production catch-up: schema-only migrations
-- ============================================================
-- Fixes the errors seen in production logs:
--   "Table 'u297598113_anandi_db.Reel' doesn't exist"
--   "Unknown column 'enabledFields' in 'INSERT INTO'"
--
-- This consolidates every SCHEMA-changing *_live.sql file from the project
-- root into one script, with every statement guarded so it only runs if
-- that table/column is actually missing. Safe to run on production even
-- though we don't know exactly which of the 17 *_live.sql files already
-- landed there — anything already present is skipped, nothing is dropped,
-- no data is touched.
--
-- Deliberately NOT included here (these are one-time DATA scripts, not
-- schema fixes, and re-running them on production could duplicate or
-- overwrite real data):
--   products_insert_live.sql, assign_categories_live.sql,
--   backfill_thumbnails_live.sql, set_product_flags_live.sql,
--   remove_all_categories_live.sql, assign_all_products_cotton_category.sql
-- Run those separately and deliberately, only if you actually want their
-- effect on production.
--
-- How to run: paste this whole file into Hostinger phpMyAdmin's SQL tab
-- for u297598113_anandi_db and execute. Review the final verification
-- block's output afterward.
-- ============================================================

-- ---- 1. Reel table (missing entirely per the error log) ----
CREATE TABLE IF NOT EXISTS `Reel` (
  `id` VARCHAR(191) NOT NULL,
  `caption` VARCHAR(191) NOT NULL,
  `videoUrl` VARCHAR(191) NOT NULL,
  `thumbnailUrl` VARCHAR(191) NULL,
  `categoryId` VARCHAR(191) NULL,
  `linkUrl` VARCHAR(191) NULL,
  `sortOrder` INT NOT NULL DEFAULT 0,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `deletedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `Reel_categoryId_idx` (`categoryId`),
  INDEX `Reel_isActive_idx` (`isActive`),
  CONSTRAINT `Reel_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---- 2. Category.enabledFields (missing per the error log) ----
SET @hasEnabledFields = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Category' AND COLUMN_NAME = 'enabledFields'
);
SET @sqlEnabledFields = IF(
  @hasEnabledFields = 0,
  'ALTER TABLE `Category` ADD COLUMN `enabledFields` JSON NULL',
  'SELECT ''enabledFields already exists, skipping'''
);
PREPARE stmt FROM @sqlEnabledFields;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ---- 2b. Category.customFieldSuggestions ----
SET @hasCustomFieldSuggestions = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Category' AND COLUMN_NAME = 'customFieldSuggestions'
);
SET @sqlCustomFieldSuggestions = IF(
  @hasCustomFieldSuggestions = 0,
  'ALTER TABLE `Category` ADD COLUMN `customFieldSuggestions` JSON NULL AFTER `enabledFields`',
  'SELECT ''customFieldSuggestions already exists, skipping'''
);
PREPARE stmt FROM @sqlCustomFieldSuggestions;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ---- 3. Banner.mobileImageUrl ----
SET @hasMobileImageUrl = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Banner' AND COLUMN_NAME = 'mobileImageUrl'
);
SET @sqlMobileImageUrl = IF(
  @hasMobileImageUrl = 0,
  'ALTER TABLE `Banner` ADD COLUMN `mobileImageUrl` LONGTEXT NULL AFTER `imageUrl`',
  'SELECT ''mobileImageUrl already exists, skipping'''
);
PREPARE stmt FROM @sqlMobileImageUrl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ---- 4. Banner.subtitle / Banner.ctaLabel ----
SET @hasSubtitle = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Banner' AND COLUMN_NAME = 'subtitle'
);
SET @sqlSubtitle = IF(
  @hasSubtitle = 0,
  'ALTER TABLE `Banner` ADD COLUMN `subtitle` VARCHAR(255) NULL AFTER `title`',
  'SELECT ''subtitle already exists, skipping'''
);
PREPARE stmt FROM @sqlSubtitle;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @hasCtaLabel = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Banner' AND COLUMN_NAME = 'ctaLabel'
);
SET @sqlCtaLabel = IF(
  @hasCtaLabel = 0,
  'ALTER TABLE `Banner` ADD COLUMN `ctaLabel` VARCHAR(100) NULL AFTER `linkUrl`',
  'SELECT ''ctaLabel already exists, skipping'''
);
PREPARE stmt FROM @sqlCtaLabel;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ---- 5. Banner.imageUrl widened to LONGTEXT ----
SET @imageUrlType = (
  SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Banner' AND COLUMN_NAME = 'imageUrl'
);
SET @sqlImageUrlType = IF(
  @imageUrlType IS NOT NULL AND @imageUrlType <> 'longtext',
  'ALTER TABLE `Banner` MODIFY COLUMN `imageUrl` LONGTEXT NOT NULL',
  'SELECT ''Banner.imageUrl already longtext (or table missing), skipping'''
);
PREPARE stmt FROM @sqlImageUrlType;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ---- 6. Product.isLiveSpecial / isTopSelection ----
SET @hasLiveSpecial = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Product' AND COLUMN_NAME = 'isLiveSpecial'
);
SET @sqlLiveSpecial = IF(
  @hasLiveSpecial = 0,
  'ALTER TABLE `Product` ADD COLUMN `isLiveSpecial` BOOLEAN NOT NULL DEFAULT false, ADD INDEX `idx_isLiveSpecial` (`isLiveSpecial`)',
  'SELECT ''isLiveSpecial already exists, skipping'''
);
PREPARE stmt FROM @sqlLiveSpecial;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @hasTopSelection = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Product' AND COLUMN_NAME = 'isTopSelection'
);
SET @sqlTopSelection = IF(
  @hasTopSelection = 0,
  'ALTER TABLE `Product` ADD COLUMN `isTopSelection` BOOLEAN NOT NULL DEFAULT false, ADD INDEX `idx_isTopSelection` (`isTopSelection`)',
  'SELECT ''isTopSelection already exists, skipping'''
);
PREPARE stmt FROM @sqlTopSelection;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ---- 7. Notification table ----
CREATE TABLE IF NOT EXISTS `Notification` (
  `id` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `message` VARCHAR(500) NOT NULL,
  `link` VARCHAR(191) NULL,
  `isRead` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Notification_isRead_idx` (`isRead`),
  INDEX `Notification_createdAt_idx` (`createdAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---- 8. ProductCustomField table ----
CREATE TABLE IF NOT EXISTS `ProductCustomField` (
  `id` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NOT NULL,
  `label` VARCHAR(191) NOT NULL,
  `value` VARCHAR(500) NOT NULL,
  `sortOrder` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `ProductCustomField_productId_idx` (`productId`),
  CONSTRAINT `ProductCustomField_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---- 9. Product.specialOfferPercent / blouseDetails ----
SET @hasOffer = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Product' AND COLUMN_NAME = 'specialOfferPercent'
);
SET @sqlOffer = IF(
  @hasOffer = 0,
  'ALTER TABLE `Product` ADD COLUMN `specialOfferPercent` DECIMAL(5,2) NULL AFTER `gstPercent`',
  'SELECT ''specialOfferPercent already exists, skipping'''
);
PREPARE stmt FROM @sqlOffer;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @hasBlouseDetails = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Product' AND COLUMN_NAME = 'blouseDetails'
);
SET @sqlBlouseDetails = IF(
  @hasBlouseDetails = 0,
  'ALTER TABLE `Product` ADD COLUMN `blouseDetails` VARCHAR(255) NULL AFTER `blouseLength`',
  'SELECT ''blouseDetails already exists, skipping'''
);
PREPARE stmt FROM @sqlBlouseDetails;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ---- 10. Product.status ----
SET @hasStatus = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Product' AND COLUMN_NAME = 'status'
);
SET @sqlStatus = IF(
  @hasStatus = 0,
  'ALTER TABLE `Product` ADD COLUMN `status` ENUM(''ACTIVE'', ''INACTIVE'', ''OUT_OF_STOCK'') NOT NULL DEFAULT ''ACTIVE'' AFTER `isActive`, ADD INDEX `Product_status_idx` (`status`)',
  'SELECT ''status already exists, skipping'''
);
PREPARE stmt FROM @sqlStatus;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Backfill only applies the first time status is added; harmless no-op if
-- status already existed and was already backfilled.
UPDATE `Product` SET `status` = 'INACTIVE' WHERE `isActive` = 0 AND `status` = 'ACTIVE';

-- ---- 11. ProductTag / ProductTagAssignment tables ----
CREATE TABLE IF NOT EXISTS `ProductTag` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ProductTag_name_key`(`name`),
    UNIQUE INDEX `ProductTag_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ProductTagAssignment` (
    `productId` VARCHAR(191) NOT NULL,
    `tagId` VARCHAR(191) NOT NULL,

    INDEX `ProductTagAssignment_tagId_idx`(`tagId`),
    PRIMARY KEY (`productId`, `tagId`),
    CONSTRAINT `ProductTagAssignment_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `ProductTagAssignment_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `ProductTag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---- 12. ProductImage.thumbnailUrl ----
SET @hasThumbnailUrl = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ProductImage' AND COLUMN_NAME = 'thumbnailUrl'
);
SET @sqlThumbnailUrl = IF(
  @hasThumbnailUrl = 0,
  'ALTER TABLE `ProductImage` ADD COLUMN `thumbnailUrl` LONGTEXT NULL AFTER `url`',
  'SELECT ''thumbnailUrl already exists, skipping'''
);
PREPARE stmt FROM @sqlThumbnailUrl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ---- 13. Product.sareeLength made nullable ----
SET @sareeLengthNullable = (
  SELECT IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Product' AND COLUMN_NAME = 'sareeLength'
);
SET @sqlSareeLength = IF(
  @sareeLengthNullable = 'NO',
  'ALTER TABLE `Product` MODIFY COLUMN `sareeLength` DECIMAL(5, 2) NULL',
  'SELECT ''sareeLength already nullable (or column missing), skipping'''
);
PREPARE stmt FROM @sqlSareeLength;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================================
-- Verification — run after the script finishes and check every row
-- says the table/column is now present.
-- ============================================================
SELECT 'Reel table' AS item, COUNT(*) AS found
FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Reel'
UNION ALL
SELECT 'Category.enabledFields', COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Category' AND COLUMN_NAME = 'enabledFields'
UNION ALL
SELECT 'Category.customFieldSuggestions', COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Category' AND COLUMN_NAME = 'customFieldSuggestions'
UNION ALL
SELECT 'Banner.mobileImageUrl', COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Banner' AND COLUMN_NAME = 'mobileImageUrl'
UNION ALL
SELECT 'Banner.subtitle', COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Banner' AND COLUMN_NAME = 'subtitle'
UNION ALL
SELECT 'Banner.ctaLabel', COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Banner' AND COLUMN_NAME = 'ctaLabel'
UNION ALL
SELECT 'Product.isLiveSpecial', COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Product' AND COLUMN_NAME = 'isLiveSpecial'
UNION ALL
SELECT 'Product.isTopSelection', COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Product' AND COLUMN_NAME = 'isTopSelection'
UNION ALL
SELECT 'Notification table', COUNT(*) FROM INFORMATION_SCHEMA.TABLES
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Notification'
UNION ALL
SELECT 'ProductCustomField table', COUNT(*) FROM INFORMATION_SCHEMA.TABLES
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ProductCustomField'
UNION ALL
SELECT 'Product.specialOfferPercent', COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Product' AND COLUMN_NAME = 'specialOfferPercent'
UNION ALL
SELECT 'Product.blouseDetails', COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Product' AND COLUMN_NAME = 'blouseDetails'
UNION ALL
SELECT 'Product.status', COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Product' AND COLUMN_NAME = 'status'
UNION ALL
SELECT 'ProductTag table', COUNT(*) FROM INFORMATION_SCHEMA.TABLES
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ProductTag'
UNION ALL
SELECT 'ProductTagAssignment table', COUNT(*) FROM INFORMATION_SCHEMA.TABLES
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ProductTagAssignment'
UNION ALL
SELECT 'ProductImage.thumbnailUrl', COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ProductImage' AND COLUMN_NAME = 'thumbnailUrl';
-- every row above should show found = 1
