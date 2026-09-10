-- Banner.imageUrl was VARCHAR(191), which truncates/corrupts base64 data-URI
-- images uploaded from the admin panel (same bug class ProductImage.url had
-- and was already fixed for). Widen it to LONGTEXT so uploaded banner
-- images save correctly instead of getting cut off.
ALTER TABLE `Banner`
  MODIFY COLUMN `imageUrl` LONGTEXT NOT NULL;
