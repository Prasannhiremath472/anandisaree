-- Free-form label/value attributes an admin can add to one specific product
-- (e.g. "Zari Content" -> "Pure Gold Zari") that don't correspond to any of
-- the fixed Product columns. Multiple rows per product, shown read-only on
-- the product detail view.
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
