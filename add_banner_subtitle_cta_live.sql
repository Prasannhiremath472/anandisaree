-- Adds subtitle and ctaLabel to Banner so admin can fully control the
-- homepage hero slider / collection banner copy, not just image + title.
ALTER TABLE `Banner`
  ADD COLUMN `subtitle` VARCHAR(255) NULL AFTER `title`,
  ADD COLUMN `ctaLabel` VARCHAR(100) NULL AFTER `linkUrl`;
