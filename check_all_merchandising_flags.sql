UPDATE `Product`
SET
  isFeatured = 1,
  isNewArrival = 1,
  isBestSeller = 1,
  isTodaysDeal = 1,
  isLiveSpecial = 1,
  isTopSelection = 1
WHERE deletedAt IS NULL;
