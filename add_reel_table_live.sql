-- Creates the Reel table for the admin "Reels" section (Style Reels shown
-- on the storefront homepage), replacing the previously hardcoded demo data.
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
