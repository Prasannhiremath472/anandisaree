ALTER TABLE `Product`
  ADD COLUMN isLiveSpecial BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN isTopSelection BOOLEAN NOT NULL DEFAULT false,
  ADD INDEX idx_isLiveSpecial (isLiveSpecial),
  ADD INDEX idx_isTopSelection (isTopSelection);
