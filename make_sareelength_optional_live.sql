-- Makes Product.sareeLength nullable so non-saree products (e.g. Kurtis) and
-- products with the field manually removed in the admin panel can be saved
-- without a saree length. Safe to run multiple times.
ALTER TABLE `Product` MODIFY COLUMN `sareeLength` DECIMAL(5, 2) NULL;
