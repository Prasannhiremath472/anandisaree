-- Free-form merchandising tags an admin can create on the fly from the
-- Product form's searchable multiselect, additive alongside the existing
-- isFeatured/isBestSeller/etc. boolean flags (not a replacement for them).
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
