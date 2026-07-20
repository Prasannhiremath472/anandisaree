-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `passwordHash` VARCHAR(191) NULL,
    `role` ENUM('SUPER_ADMIN', 'ADMIN', 'INVENTORY_MANAGER', 'ORDER_MANAGER', 'CUSTOMER_SUPPORT', 'MARKETING_MANAGER', 'CONTENT_MANAGER', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
    `isEmailVerified` BOOLEAN NOT NULL DEFAULT false,
    `isPhoneVerified` BOOLEAN NOT NULL DEFAULT false,
    `avatarUrl` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `referralCode` VARCHAR(191) NULL,
    `referredById` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    UNIQUE INDEX `User_referralCode_key`(`referralCode`),
    INDEX `User_role_idx`(`role`),
    INDEX `User_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `revoked` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `RefreshToken_token_key`(`token`),
    INDEX `RefreshToken_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OtpCode` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `identifier` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `purpose` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `consumed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `OtpCode_identifier_purpose_idx`(`identifier`, `purpose`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Address` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` ENUM('HOME', 'WORK', 'OTHER') NOT NULL DEFAULT 'HOME',
    `fullName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `line1` VARCHAR(191) NOT NULL,
    `line2` VARCHAR(191) NULL,
    `landmark` VARCHAR(191) NULL,
    `city` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NULL,
    `state` VARCHAR(191) NOT NULL,
    `pincode` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL DEFAULT 'India',
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Address_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `group` ENUM('MAHARASHTRIAN', 'PAN_INDIAN') NOT NULL DEFAULT 'PAN_INDIAN',
    `imageUrl` VARCHAR(191) NULL,
    `parentId` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` TEXT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Category_slug_key`(`slug`),
    INDEX `Category_group_idx`(`group`),
    INDEX `Category_parentId_idx`(`parentId`),
    INDEX `Category_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Collection` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `startsAt` DATETIME(3) NULL,
    `endsAt` DATETIME(3) NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Collection_slug_key`(`slug`),
    INDEX `Collection_isFeatured_idx`(`isFeatured`),
    INDEX `Collection_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Brand` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `logoUrl` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Brand_name_key`(`name`),
    UNIQUE INDEX `Brand_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LandingPage` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `heroImageUrl` VARCHAR(191) NULL,
    `contentHtml` LONGTEXT NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` TEXT NULL,
    `categoryId` VARCHAR(191) NULL,
    `collectionId` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LandingPage_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `shortDescription` VARCHAR(191) NULL,
    `description` LONGTEXT NULL,
    `brandId` VARCHAR(191) NULL,
    `fabric` VARCHAR(191) NOT NULL,
    `weavingTechnique` VARCHAR(191) NULL,
    `isHandloom` BOOLEAN NOT NULL DEFAULT false,
    `borderType` VARCHAR(191) NULL,
    `palluDesign` VARCHAR(191) NULL,
    `designPattern` VARCHAR(191) NULL,
    `color` VARCHAR(191) NOT NULL,
    `secondaryColors` VARCHAR(191) NULL,
    `sareeLength` DECIMAL(5, 2) NOT NULL,
    `blouseIncluded` BOOLEAN NOT NULL DEFAULT false,
    `blouseLength` DECIMAL(5, 2) NULL,
    `weightGrams` INTEGER NULL,
    `craftOrigin` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL DEFAULT 'Maharashtra',
    `district` VARCHAR(191) NULL,
    `weaverDetails` TEXT NULL,
    `mrp` DECIMAL(10, 2) NOT NULL,
    `sellingPrice` DECIMAL(10, 2) NOT NULL,
    `gstPercent` DECIMAL(4, 2) NOT NULL DEFAULT 5,
    `stockQuantity` INTEGER NOT NULL DEFAULT 0,
    `lowStockThreshold` INTEGER NOT NULL DEFAULT 5,
    `dispatchDays` INTEGER NOT NULL DEFAULT 2,
    `deliveryEstimateDays` INTEGER NOT NULL DEFAULT 7,
    `washCare` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `isNewArrival` BOOLEAN NOT NULL DEFAULT false,
    `isBestSeller` BOOLEAN NOT NULL DEFAULT false,
    `isTodaysDeal` BOOLEAN NOT NULL DEFAULT false,
    `publishedAt` DATETIME(3) NULL,
    `deletedAt` DATETIME(3) NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` TEXT NULL,
    `avgRating` DECIMAL(3, 2) NOT NULL DEFAULT 0,
    `reviewCount` INTEGER NOT NULL DEFAULT 0,
    `viewCount` INTEGER NOT NULL DEFAULT 0,
    `soldCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Product_sku_key`(`sku`),
    UNIQUE INDEX `Product_slug_key`(`slug`),
    INDEX `Product_fabric_idx`(`fabric`),
    INDEX `Product_color_idx`(`color`),
    INDEX `Product_isActive_idx`(`isActive`),
    INDEX `Product_isFeatured_idx`(`isFeatured`),
    INDEX `Product_isNewArrival_idx`(`isNewArrival`),
    INDEX `Product_isBestSeller_idx`(`isBestSeller`),
    INDEX `Product_isTodaysDeal_idx`(`isTodaysDeal`),
    INDEX `Product_deletedAt_idx`(`deletedAt`),
    INDEX `Product_sellingPrice_idx`(`sellingPrice`),
    FULLTEXT INDEX `Product_name_description_idx`(`name`, `description`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductCategory` (
    `productId` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,

    INDEX `ProductCategory_categoryId_idx`(`categoryId`),
    PRIMARY KEY (`productId`, `categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductCollection` (
    `productId` VARCHAR(191) NOT NULL,
    `collectionId` VARCHAR(191) NOT NULL,

    INDEX `ProductCollection_collectionId_idx`(`collectionId`),
    PRIMARY KEY (`productId`, `collectionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Occasion` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Occasion_name_key`(`name`),
    UNIQUE INDEX `Occasion_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductOccasion` (
    `productId` VARCHAR(191) NOT NULL,
    `occasionId` VARCHAR(191) NOT NULL,

    INDEX `ProductOccasion_occasionId_idx`(`occasionId`),
    PRIMARY KEY (`productId`, `occasionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductImage` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `altText` VARCHAR(191) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProductImage_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductVideo` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `thumbnailUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProductVideo_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductVariant` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NULL,
    `size` VARCHAR(191) NULL,
    `priceDelta` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `stockQuantity` INTEGER NOT NULL DEFAULT 0,
    `barcode` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ProductVariant_sku_key`(`sku`),
    INDEX `ProductVariant_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockMovement` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `variantId` VARCHAR(191) NULL,
    `type` ENUM('PURCHASE_IN', 'SALE_OUT', 'RETURN_IN', 'ADJUSTMENT', 'DAMAGE_OUT') NOT NULL,
    `quantity` INTEGER NOT NULL,
    `note` VARCHAR(191) NULL,
    `createdById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `StockMovement_productId_idx`(`productId`),
    INDEX `StockMovement_variantId_idx`(`variantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CartItem` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `variantId` VARCHAR(191) NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `savedForLater` BOOLEAN NOT NULL DEFAULT false,
    `giftWrap` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CartItem_userId_idx`(`userId`),
    UNIQUE INDEX `CartItem_userId_productId_variantId_key`(`userId`, `productId`, `variantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WishlistItem` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `WishlistItem_userId_idx`(`userId`),
    UNIQUE INDEX `WishlistItem_userId_productId_key`(`userId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecentlyViewed` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `viewedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `RecentlyViewed_userId_idx`(`userId`),
    UNIQUE INDEX `RecentlyViewed_userId_productId_key`(`userId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `orderNumber` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `addressId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `paymentMethod` ENUM('COD', 'RAZORPAY', 'UPI', 'CARD', 'NETBANKING', 'WALLET') NOT NULL,
    `paymentStatus` ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `razorpayOrderId` VARCHAR(191) NULL,
    `razorpayPaymentId` VARCHAR(191) NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `discountAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `taxAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `shippingAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `totalAmount` DECIMAL(10, 2) NOT NULL,
    `couponId` VARCHAR(191) NULL,
    `giftWrap` BOOLEAN NOT NULL DEFAULT false,
    `gstInvoiceNumber` VARCHAR(191) NULL,
    `trackingNumber` VARCHAR(191) NULL,
    `courierName` VARCHAR(191) NULL,
    `cancelReason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Order_orderNumber_key`(`orderNumber`),
    INDEX `Order_userId_idx`(`userId`),
    INDEX `Order_status_idx`(`status`),
    INDEX `Order_paymentStatus_idx`(`paymentStatus`),
    INDEX `Order_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `variantId` VARCHAR(191) NULL,
    `productName` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unitPrice` DECIMAL(10, 2) NOT NULL,
    `totalPrice` DECIMAL(10, 2) NOT NULL,

    INDEX `OrderItem_orderId_idx`(`orderId`),
    INDEX `OrderItem_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderStatusHistory` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED') NOT NULL,
    `note` VARCHAR(191) NULL,
    `changedById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `OrderStatusHistory_orderId_idx`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReturnRequest` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `reason` TEXT NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'REQUESTED',
    `refundAmount` DECIMAL(10, 2) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ReturnRequest_orderId_idx`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wallet` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `balance` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Wallet_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WalletTransaction` (
    `id` VARCHAR(191) NOT NULL,
    `walletId` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `WalletTransaction_walletId_idx`(`walletId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoyaltyTransaction` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `points` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LoyaltyTransaction_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GiftCard` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `balance` DECIMAL(10, 2) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `expiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `GiftCard_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Coupon` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `type` ENUM('PERCENTAGE', 'FLAT', 'BOGO') NOT NULL,
    `value` DECIMAL(10, 2) NOT NULL,
    `minOrderAmount` DECIMAL(10, 2) NULL,
    `maxDiscount` DECIMAL(10, 2) NULL,
    `usageLimit` INTEGER NULL,
    `usedCount` INTEGER NOT NULL DEFAULT 0,
    `isFestival` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `startsAt` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Coupon_code_key`(`code`),
    INDEX `Coupon_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `title` VARCHAR(191) NULL,
    `comment` TEXT NULL,
    `imageUrls` TEXT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'SPAM') NOT NULL DEFAULT 'PENDING',
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Review_productId_idx`(`productId`),
    INDEX `Review_userId_idx`(`userId`),
    INDEX `Review_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupportTicket` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SupportTicket_userId_idx`(`userId`),
    INDEX `SupportTicket_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Banner` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `linkUrl` VARCHAR(191) NULL,
    `placement` ENUM('HOMEPAGE_SLIDER', 'FESTIVAL_BANNER', 'OFFER_BANNER', 'COLLECTION_BANNER', 'POPUP_BANNER') NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `startsAt` DATETIME(3) NULL,
    `endsAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Banner_placement_idx`(`placement`),
    INDEX `Banner_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CmsPage` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `contentHtml` LONGTEXT NOT NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` TEXT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CmsPage_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlogPost` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `excerpt` VARCHAR(191) NULL,
    `contentHtml` LONGTEXT NOT NULL,
    `coverImageUrl` VARCHAR(191) NULL,
    `categoryName` VARCHAR(191) NULL,
    `tags` VARCHAR(191) NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` TEXT NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BlogPost_slug_key`(`slug`),
    INDEX `BlogPost_isPublished_idx`(`isPublished`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlogComment` (
    `id` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `comment` TEXT NOT NULL,
    `isApproved` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BlogComment_postId_idx`(`postId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsletterSubscriber` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `isSubscribed` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `NewsletterSubscriber_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Testimonial` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,
    `message` TEXT NOT NULL,
    `rating` INTEGER NOT NULL DEFAULT 5,
    `imageUrl` VARCHAR(191) NULL,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Setting` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,
    `group` VARCHAR(191) NOT NULL DEFAULT 'general',
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Setting_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NULL,
    `metadata` TEXT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditLog_userId_idx`(`userId`),
    INDEX `AuditLog_entityType_entityId_idx`(`entityType`, `entityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_referredById_fkey` FOREIGN KEY (`referredById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OtpCode` ADD CONSTRAINT `OtpCode_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `Brand`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductCategory` ADD CONSTRAINT `ProductCategory_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductCategory` ADD CONSTRAINT `ProductCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductCollection` ADD CONSTRAINT `ProductCollection_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductCollection` ADD CONSTRAINT `ProductCollection_collectionId_fkey` FOREIGN KEY (`collectionId`) REFERENCES `Collection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductOccasion` ADD CONSTRAINT `ProductOccasion_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductOccasion` ADD CONSTRAINT `ProductOccasion_occasionId_fkey` FOREIGN KEY (`occasionId`) REFERENCES `Occasion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductVideo` ADD CONSTRAINT `ProductVideo_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductVariant` ADD CONSTRAINT `ProductVariant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockMovement` ADD CONSTRAINT `StockMovement_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockMovement` ADD CONSTRAINT `StockMovement_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `ProductVariant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `ProductVariant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WishlistItem` ADD CONSTRAINT `WishlistItem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WishlistItem` ADD CONSTRAINT `WishlistItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecentlyViewed` ADD CONSTRAINT `RecentlyViewed_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecentlyViewed` ADD CONSTRAINT `RecentlyViewed_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `Coupon`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `ProductVariant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderStatusHistory` ADD CONSTRAINT `OrderStatusHistory_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReturnRequest` ADD CONSTRAINT `ReturnRequest_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wallet` ADD CONSTRAINT `Wallet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WalletTransaction` ADD CONSTRAINT `WalletTransaction_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `Wallet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoyaltyTransaction` ADD CONSTRAINT `LoyaltyTransaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupportTicket` ADD CONSTRAINT `SupportTicket_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BlogComment` ADD CONSTRAINT `BlogComment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `BlogPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
-- CreateTable
CREATE TABLE `UserCoupon` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `couponId` VARCHAR(191) NOT NULL,
    `source` VARCHAR(191) NOT NULL DEFAULT 'popup',
    `isUsed` BOOLEAN NOT NULL DEFAULT false,
    `claimedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usedAt` DATETIME(3) NULL,

    INDEX `UserCoupon_userId_idx`(`userId`),
    UNIQUE INDEX `UserCoupon_userId_couponId_key`(`userId`, `couponId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserCoupon` ADD CONSTRAINT `UserCoupon_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCoupon` ADD CONSTRAINT `UserCoupon_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `Coupon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
-- AlterTable
ALTER TABLE `ProductImage` MODIFY `url` LONGTEXT NOT NULL;
-- ============================================================
-- Seed data: categories, occasions, landing pages, admin user
-- Generated to match prisma/schema.prisma exactly
-- ============================================================

-- Categories (Maharashtrian, with parent/child tree)

INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catac0c2fe9287c6f8f844eec1d', 'Paithani Sarees', 'paithani', 'Traditional hand-woven Paithani sarees', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat1d8432a2802ccd2f6d8a8385', 'Yeola Paithani', 'paithani-yeola-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat0c2c168b641c792a551c651f', 'Pure Silk Paithani', 'paithani-pure-silk-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat85a6beb69999a34e37221508', 'Handloom Paithani', 'paithani-handloom-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catdd7982fd3b4715473e1a729d', 'Semi Paithani', 'paithani-semi-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catf2207f71be9d58e4d0dae4a6', 'Tissue Paithani', 'paithani-tissue-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catd9c8c5ba977bf69a175ee8f8', 'Muniya Border Paithani', 'paithani-muniya-border-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catdb6fd6f9acdd408d64d6bb8d', 'Bangdi Mor Paithani', 'paithani-bangdi-mor-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cataebfc7107d7774587c56857f', 'Lotus Paithani', 'paithani-lotus-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat21732964c818d83414d6266b', 'Peacock Design Paithani', 'paithani-peacock-design-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catce6713074b2d504b05aa8f90', 'Ajanta Lotus Paithani', 'paithani-ajanta-lotus-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat268980060dbaa27f35279019', 'Asawali Paithani', 'paithani-asawali-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat4533da184b764822f93de426', 'Narali Border Paithani', 'paithani-narali-border-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catcfba50f0a5af6ca4fe70c5e7', 'Kalamkari Paithani', 'paithani-kalamkari-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat9f64a14429b81fbe3555dffd', 'Nauvari Sarees (9 Yards)', 'nauvari', 'Traditional nine-yard Maharashtrian sarees', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat170172cfb2e5847f951d8da4', 'Kashta Sarees', 'nauvari-kashta-sarees', 'MAHARASHTRIAN', 'cat9f64a14429b81fbe3555dffd', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat99ee91db086a3a7f04cb53bc', 'Traditional Maharashtrian Nauvari', 'nauvari-traditional-maharashtrian-nauvari', 'MAHARASHTRIAN', 'cat9f64a14429b81fbe3555dffd', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cate465eaa7a5453db5be959168', 'Cotton Nauvari', 'nauvari-cotton-nauvari', 'MAHARASHTRIAN', 'cat9f64a14429b81fbe3555dffd', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat18315d309d338200c0866852', 'Silk Nauvari', 'nauvari-silk-nauvari', 'MAHARASHTRIAN', 'cat9f64a14429b81fbe3555dffd', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat4c36d9f406ed5dc330278bf6', 'Ready-to-Wear Nauvari', 'nauvari-ready-to-wear-nauvari', 'MAHARASHTRIAN', 'cat9f64a14429b81fbe3555dffd', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat0e9e4a027b518c2e23724e06', 'Peshwai Sarees', 'peshwai', 'Peshwai era inspired sarees', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat1e05a65039db3566df93fa5c', 'Narayan Peth Sarees', 'narayan-peth', 'Narayan Peth handloom sarees', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat0c43100e58c05264f574fd05', 'Solapuri Cotton Sarees', 'solapuri-cotton', 'Solapur cotton weaves', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat2e81ea8bf3b5dcfc461ba652', 'Ilkal Sarees', 'ilkal', 'Traditional Ilkal weave', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat0252aab030b61ac05782d7c7', 'Khun Fabric Sarees', 'khun-fabric', 'Khun fabric blouse & saree pieces', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat88d30078665d8ccfeac18de2', 'Maharashtrian Bridal Sarees', 'maharashtrian-bridal', 'Bridal collection for Maharashtrian weddings', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat7468ca188a1d6acdc54c7583', 'Maharashtrian Wedding Collection', 'maharashtrian-wedding', 'Wedding function sarees', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat6a2df202a417f2a614a04d54', 'Maharashtrian Festive Collection', 'maharashtrian-festive', 'Festival wear sarees', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catd5703f01063d81a2903a9969', 'Maharashtrian Haldi Collection', 'maharashtrian-haldi', 'Haldi ceremony sarees', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catdedcd7352898f1fd737aa02e', 'Maharashtrian Reception Collection', 'maharashtrian-reception', 'Reception sarees', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat0efedb1d846c90c8722f5c35', 'Maharashtrian Traditional Wear', 'maharashtrian-traditional', 'Everyday traditional wear', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

-- Categories (Pan-Indian, flat)

INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat16a46024d009cda71a64c44d', 'Banarasi Silk', 'banarasi-silk', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cate73329494067b11a1f32c079', 'Kanjivaram Silk', 'kanjivaram-silk', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catdba174d24ea55d8c4ce6a2e9', 'Patola', 'patola', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cate6645764cf0b6e3441f24bb1', 'Bandhani', 'bandhani', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat20bf90d4511630eaccda0c1e', 'Chanderi', 'chanderi', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat0ac53b2016a3ac72c2afae09', 'Maheshwari', 'maheshwari', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catfcc3abb0425c13da5bdc9ac9', 'Kota Doria', 'kota-doria', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat48deafdbe1aba5fd2e6571d8', 'Tussar Silk', 'tussar-silk', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catfe1a9b7e15642fd335995505', 'Organza', 'organza', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catf4f2e5719309c386f52bc303', 'Linen', 'linen', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat7737d54804a09ab000eece0f', 'Cotton', 'cotton', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat45245ff3c5a4a52f64bc0f06', 'Georgette', 'georgette', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cata7f0d378aa3b33547fbf3104', 'Chiffon', 'chiffon', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat5e15fe3e3e8b376cab682eb8', 'Crepe', 'crepe', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cata2d9d2e3e035160195ccbe8d', 'Satin Silk', 'satin-silk', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat7e1306d8dcf0ccfaf075009e', 'Soft Silk', 'soft-silk', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catabccc56a904339f6266b48f6', 'Tissue Silk', 'tissue-silk', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cata68e4a9e8ad5fade7e7cede9', 'Handloom Collection', 'handloom-collection', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat79ddcd19e56b1ec0248ddc17', 'Printed Sarees', 'printed-sarees', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat6dfb92fe1871773a7e5df177', 'Embroidered Sarees', 'embroidered-sarees', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat567a5e899b8b63ed999da57e', 'Party Wear Sarees', 'party-wear-sarees', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat6943d3a70e5b9a4bab693f0f', 'Office Wear Sarees', 'office-wear-sarees', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catf7fcf3ab11516afa9bea6c01', 'Casual Wear Sarees', 'casual-wear-sarees', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catc9de8683e883ae29b53926cf', 'Designer Sarees', 'designer-sarees', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat961b2cca28c75105376c50b3', 'Wedding Collection', 'wedding-collection', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat86ff274465ce4cfa2911fdbb', 'Festive Collection', 'festive-collection', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat6c7a5fdcc7d360ae7e3c3e71', 'Luxury Collection', 'luxury-collection', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

-- Occasions

INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occc83cbb52f79eabd30fb9564d', 'Maharashtrian Wedding', 'maharashtrian-wedding');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occc89c96bae17c4ebb05066c87', 'Bride', 'bride');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occcca89b9dd1527851d61b2411', 'Bride\'s Mother', 'bride-s-mother');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occb50194374390d83a9374ab52', 'Haldi Ceremony', 'haldi-ceremony');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occcaac89b31b1a09d611416c45', 'Mehendi Ceremony', 'mehendi-ceremony');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ5032434bcb1be53890db1251', 'Sangeet', 'sangeet');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ5e2acefd72fc21af9c19abd2', 'Reception', 'reception');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occa98c54f0105cda9fbd2bb33c', 'Engagement', 'engagement');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ63da09304a9b429a9d0c8c23', 'Gudi Padwa', 'gudi-padwa');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ2c26712508a518aa4f703f5b', 'Ganesh Festival', 'ganesh-festival');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ83dd9c0e76e1a490c90ac914', 'Diwali', 'diwali');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ93d1b08162f02dbd9915cbff', 'Navratri', 'navratri');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ48f9fa47fd6b8922d5d9631a', 'Mangalagaur', 'mangalagaur');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ9a559d716a6a8b0a7c5bf3f6', 'Vat Pournima', 'vat-pournima');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ0968917c599d5b8676d37186', 'Traditional Functions', 'traditional-functions');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occae77e0583d11f9c879f86dc7', 'Office Wear', 'office-wear');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ9dbd7173a19df294b9a2002e', 'Daily Wear', 'daily-wear');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ2b2c75746b82b665c2a4fadb', 'Party Wear', 'party-wear');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ9937c782f8af0273d2496928', 'Temple Visit', 'temple-visit');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ8e96ffd23fcb1ace8b47c73e', 'Housewarming', 'housewarming');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ523bdcefa368cf420f460c26', 'Baby Shower', 'baby-shower');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occc1b97174a595fa471c65565c', 'Naming Ceremony', 'naming-ceremony');

-- SEO Landing Pages

INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lpa10d315f17cf0fa780108f74', 'buy-paithani-sarees-online', 'Buy Paithani Sarees Online', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp5cc36bf4f020b0594ee05ae2', 'pure-silk-paithani', 'Pure Silk Paithani', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp96b4e290c261942c6cd19049', 'yeola-paithani-collection', 'Yeola Paithani Collection', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp0da1b49d0ff73ed0d1f8d1b6', 'maharashtrian-wedding-sarees', 'Maharashtrian Wedding Sarees', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp6632183c501fd982bec2aedd', 'nauvari-sarees-online', 'Nauvari Sarees Online', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp6ef67515d8e3b39345370439', 'ready-to-wear-nauvari', 'Ready-to-Wear Nauvari', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp29bf0397fb36f67ec0b8581c', 'maharashtrian-bridal-collection', 'Maharashtrian Bridal Collection', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp2d4bbc2ed004df00b4d79afb', 'gudi-padwa-sarees', 'Gudi Padwa Sarees', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp1d44b3e3f755d8f0df71ce92', 'diwali-sarees', 'Diwali Sarees', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp757e190e6873dc5f77abe37a', 'ganesh-festival-sarees', 'Ganesh Festival Sarees', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp17af73465dfa95684054824a', 'narayan-peth-sarees', 'Narayan Peth Sarees', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lpf6e53ce134e0fde5801d4f72', 'solapuri-cotton-sarees', 'Solapuri Cotton Sarees', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lpae1eac635cad1b984a83c15c', 'traditional-maharashtrian-sarees', 'Traditional Maharashtrian Sarees', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp1ecbe4e28f0d35be9a4ab06f', 'best-saree-shop-in-maharashtra', 'Best Saree Shop in Maharashtra', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp16bacf18c074bccb7f603276', 'premium-paithani-collection', 'Premium Paithani Collection', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp3134b7fa2761d876a4e3154f', 'handloom-maharashtra-sarees', 'Handloom Maharashtra Sarees', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `User` (`id`, `name`, `email`, `passwordHash`, `role`, `isEmailVerified`, `isPhoneVerified`, `isActive`, `createdAt`, `updatedAt`)
VALUES (
  'cljadminf045db863ad7dc68',
  'Super Admin',
  'admin@anandisaree.com',
  '$2a$12$CvtU.LiQ29HjkIlROUfloOZhnQ9YtYOm7EwHZWFr0UO7zKL3y/R3W',
  'SUPER_ADMIN',
  1,
  0,
  1,
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
);
