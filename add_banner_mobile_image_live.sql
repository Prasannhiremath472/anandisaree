-- Adds an optional mobile-specific image to Banner. When set, the storefront
-- shows this on small screens instead of the main (desktop) imageUrl; when
-- left blank, mobile visitors just see the same desktop image as before.
ALTER TABLE `Banner`
  ADD COLUMN `mobileImageUrl` LONGTEXT NULL AFTER `imageUrl`;
