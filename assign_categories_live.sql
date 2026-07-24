INSERT INTO `Category` (id, name, slug, description, `group`, isActive, sortOrder, createdAt, updatedAt)
   SELECT 'catg8nk159lrl5j2e32zs0h', 'Nightwear', 'nightwear', 'Comfortable nightwear gowns and nighties', 'PAN_INDIAN', 1, 100, NOW(3), NOW(3)
   WHERE NOT EXISTS (SELECT 1 FROM `Category` WHERE slug = 'nightwear');

INSERT INTO `ProductCategory` (productId, categoryId)
SELECT p.id, 'catg8nk159lrl5j2e32zs0h'
FROM `Product` p
WHERE p.sku LIKE 'AS-%'
  AND (p.name LIKE 'Drape Gown%' OR p.name LIKE 'Smocked Gown%' OR p.name LIKE 'Short Nighty%')
  AND NOT EXISTS (SELECT 1 FROM `ProductCategory` pc WHERE pc.productId = p.id AND pc.categoryId = 'catg8nk159lrl5j2e32zs0h');


INSERT INTO `ProductCategory` (productId, categoryId)
SELECT p.id, c.id
FROM `Product` p
JOIN `Category` c ON c.slug = 'printed-sarees'
WHERE p.sku LIKE 'AS-%'
  AND NOT (p.name LIKE 'Drape Gown%' OR p.name LIKE 'Smocked Gown%' OR p.name LIKE 'Short Nighty%')
  AND NOT EXISTS (SELECT 1 FROM `ProductCategory` pc WHERE pc.productId = p.id AND pc.categoryId = c.id);
