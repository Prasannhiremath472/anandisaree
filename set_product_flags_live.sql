UPDATE `Product` SET isNewArrival = 1 WHERE sku LIKE 'AS-%';
UPDATE `Product` SET isBestSeller = 1 WHERE sku LIKE 'AS-%' ORDER BY createdAt LIMIT 8;
UPDATE `Product` SET isFeatured = 1 WHERE sku LIKE 'AS-%' ORDER BY createdAt DESC LIMIT 6;
