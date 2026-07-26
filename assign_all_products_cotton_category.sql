INSERT INTO `ProductCategory` (productId, categoryId)
SELECT p.id, 'cat7737d54804a09ab000eece0f'
FROM `Product` p
WHERE p.deletedAt IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM `ProductCategory` pc WHERE pc.productId = p.id
  );
