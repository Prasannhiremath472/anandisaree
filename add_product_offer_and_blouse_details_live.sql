-- Adds two fields to Product:
--   specialOfferPercent: optional promotional discount %, settable at
--     product-creation time (shown as a discount badge on that product only,
--     independent of the site-wide Coupon system).
--   blouseDetails: free-text replacement for the old blouseIncluded
--     (boolean) + blouseLength (numeric) pair, per client request to make
--     this a single descriptive text field (e.g. "2.5m running blouse
--     piece included"). blouseIncluded/blouseLength columns stay in the
--     schema for backward compatibility — no data is dropped.
--
-- Safe to re-run: skips each ALTER if the column already exists.
SET @hasOffer = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Product' AND COLUMN_NAME = 'specialOfferPercent'
);
SET @sqlOffer = IF(
  @hasOffer = 0,
  'ALTER TABLE `Product` ADD COLUMN `specialOfferPercent` DECIMAL(5,2) NULL AFTER `gstPercent`',
  'SELECT ''specialOfferPercent already exists, skipping'''
);
PREPARE stmt1 FROM @sqlOffer;
EXECUTE stmt1;
DEALLOCATE PREPARE stmt1;

SET @hasBlouseDetails = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Product' AND COLUMN_NAME = 'blouseDetails'
);
SET @sqlBlouseDetails = IF(
  @hasBlouseDetails = 0,
  'ALTER TABLE `Product` ADD COLUMN `blouseDetails` VARCHAR(255) NULL AFTER `blouseLength`',
  'SELECT ''blouseDetails already exists, skipping'''
);
PREPARE stmt2 FROM @sqlBlouseDetails;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;
