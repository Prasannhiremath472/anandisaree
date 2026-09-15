-- Creates the Notification table backing the admin topbar's notification
-- bell (new orders, low-stock alerts, new reviews). Polled by the admin
-- frontend rather than pushed over a websocket.
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
