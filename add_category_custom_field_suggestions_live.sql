-- Lets each category define a list of suggested custom-field labels (e.g.
-- "Jewelry Metal", "Zari Content") that show as quick-add buttons in the
-- product form's Custom Fields section when a product in that category is
-- being edited. These are suggestions only, not structured/required columns
-- -- the admin can still type any other label freely; this just saves
-- retyping the common ones for a given category.
--
-- Same JSON-in-LONGTEXT storage pattern as Category.enabledFields.
-- Safe to re-run: skips the ALTER if the column already exists.
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
