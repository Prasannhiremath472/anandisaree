-- Lets each category declare which optional product fields apply to it
-- (e.g. Saree Length for sarees, not for Nightwear). NULL means "no
-- restriction configured" — the product form falls back to showing everything.
ALTER TABLE `Category` ADD COLUMN `enabledFields` JSON NULL;
