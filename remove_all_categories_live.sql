-- ============================================================
-- Remove ALL categories (full wipe)
-- ============================================================
-- Effects (verified against live FK constraints before writing this):
--   - Category                : all rows deleted.
--   - ProductCategory         : ON DELETE CASCADE -> all links auto-deleted.
--                                Products themselves are NOT deleted, they
--                                just end up with zero categories.
--   - Category.parentId       : ON DELETE SET NULL (self-reference, moot
--                                once all rows are gone).
--   - Reel.categoryId         : ON DELETE SET NULL -> reels keep existing,
--                                just become uncategorized.
--   - LandingPage.categoryId  : NOT a real FK in the live DB (confirmed via
--                                INFORMATION_SCHEMA) -> any stored category
--                                id on a landing page is left stale/orphaned.
--                                Cleared explicitly below so nothing points
--                                at a deleted id.
--
-- Run this against the local MariaDB (port 3307) first, verify, then run
-- the same statements against production.
-- ============================================================

START TRANSACTION;

-- Clear any category reference landing pages hold (no FK enforces this).
UPDATE `LandingPage` SET categoryId = NULL WHERE categoryId IS NOT NULL;

-- Deleting Category cascades into ProductCategory and SET NULLs Reel.categoryId.
DELETE FROM `Category`;

COMMIT;

-- ---- verification (run after commit) ----
-- SELECT COUNT(*) AS categories_left FROM `Category`;            -- expect 0
-- SELECT COUNT(*) AS product_links_left FROM `ProductCategory`;  -- expect 0
-- SELECT COUNT(*) AS reels_still_tagged FROM `Reel` WHERE categoryId IS NOT NULL; -- expect 0
