-- Seed data generated from backend/prisma/seed.ts logic-- Run this in phpMyAdmin's SQL tab against the production database.-- Uses INSERT IGNORE so it is safe to re-run (duplicate unique keys are skipped).SET FOREIGN_KEY_CHECKS=0;
INSERT IGNORE INTO `category` (`id`, `name`, `slug`, `description`, `group`, `imageUrl`, `parentId`, `isActive`, `sortOrder`, `metaTitle`, `metaDescription`, `enabledFields`, `createdAt`, `updatedAt`) VALUES
('catgmtsq62bg14mhddv2q', 'Paithani Sarees', 'paithani', 'Traditional hand-woven Paithani sarees', 'MAHARASHTRIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bg22mhueu8r', 'Yeola Paithani', 'paithani-yeola-paithani', NULL, 'MAHARASHTRIAN', NULL, 'catgmtsq62bg14mhddv2q', 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bg3i1uo8v7u', 'Pure Silk Paithani', 'paithani-pure-silk-paithani', NULL, 'MAHARASHTRIAN', NULL, 'catgmtsq62bg14mhddv2q', 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bg4h05mzmjz', 'Handloom Paithani', 'paithani-handloom-paithani', NULL, 'MAHARASHTRIAN', NULL, 'catgmtsq62bg14mhddv2q', 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bg5axtdsl5w', 'Semi Paithani', 'paithani-semi-paithani', NULL, 'MAHARASHTRIAN', NULL, 'catgmtsq62bg14mhddv2q', 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bg6jtyik2qf', 'Tissue Paithani', 'paithani-tissue-paithani', NULL, 'MAHARASHTRIAN', NULL, 'catgmtsq62bg14mhddv2q', 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bg77y2ok25k', 'Muniya Border Paithani', 'paithani-muniya-border-paithani', NULL, 'MAHARASHTRIAN', NULL, 'catgmtsq62bg14mhddv2q', 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bg8kmuta8dy', 'Bangdi Mor Paithani', 'paithani-bangdi-mor-paithani', NULL, 'MAHARASHTRIAN', NULL, 'catgmtsq62bg14mhddv2q', 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bg98zs6765h', 'Lotus Paithani', 'paithani-lotus-paithani', NULL, 'MAHARASHTRIAN', NULL, 'catgmtsq62bg14mhddv2q', 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bgabk7uli63', 'Peacock Design Paithani', 'paithani-peacock-design-paithani', NULL, 'MAHARASHTRIAN', NULL, 'catgmtsq62bg14mhddv2q', 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bgbypk218f8', 'Ajanta Lotus Paithani', 'paithani-ajanta-lotus-paithani', NULL, 'MAHARASHTRIAN', NULL, 'catgmtsq62bg14mhddv2q', 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bgc6b9jpfb0', 'Asawali Paithani', 'paithani-asawali-paithani', NULL, 'MAHARASHTRIAN', NULL, 'catgmtsq62bg14mhddv2q', 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bgdwk405ms0', 'Narali Border Paithani', 'paithani-narali-border-paithani', NULL, 'MAHARASHTRIAN', NULL, 'catgmtsq62bg14mhddv2q', 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bgexrdr7dmx', 'Kalamkari Paithani', 'paithani-kalamkari-paithani', NULL, 'MAHARASHTRIAN', NULL, 'catgmtsq62bg14mhddv2q', 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bgfcapidc4c', 'Nauvari Sarees (9 Yards)', 'nauvari', 'Traditional nine-yard Maharashtrian sarees', 'MAHARASHTRIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bgg7199pkny', 'Kashta Sarees', 'nauvari-kashta-sarees', NULL, 'MAHARASHTRIAN', NULL, 'catgmtsq62bgfcapidc4c', 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bghxejqi7o6', 'Traditional Maharashtrian Nauvari', 'nauvari-traditional-maharashtrian-nauvari', NULL, 'MAHARASHTRIAN', NULL, 'catgmtsq62bgfcapidc4c', 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bgipihz2voa', 'Cotton Nauvari', 'nauvari-cotton-nauvari', NULL, 'MAHARASHTRIAN', NULL, 'catgmtsq62bgfcapidc4c', 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bgj7iqb7xyw', 'Silk Nauvari', 'nauvari-silk-nauvari', NULL, 'MAHARASHTRIAN', NULL, 'catgmtsq62bgfcapidc4c', 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bgk8octbsrf', 'Ready-to-Wear Nauvari', 'nauvari-ready-to-wear-nauvari', NULL, 'MAHARASHTRIAN', NULL, 'catgmtsq62bgfcapidc4c', 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bglgm9msxt6', 'Peshwai Sarees', 'peshwai', 'Peshwai era inspired sarees', 'MAHARASHTRIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bgmxn6d51mi', 'Narayan Peth Sarees', 'narayan-peth', 'Narayan Peth handloom sarees', 'MAHARASHTRIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bgnfqck1h1n', 'Solapuri Cotton Sarees', 'solapuri-cotton', 'Solapur cotton weaves', 'MAHARASHTRIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bgoyypusqc8', 'Ilkal Sarees', 'ilkal', 'Traditional Ilkal weave', 'MAHARASHTRIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bgprlfddvm5', 'Khun Fabric Sarees', 'khun-fabric', 'Khun fabric blouse & saree pieces', 'MAHARASHTRIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bgq2s29i2a3', 'Maharashtrian Bridal Sarees', 'maharashtrian-bridal', 'Bridal collection for Maharashtrian weddings', 'MAHARASHTRIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bgrxbyn9jp5', 'Maharashtrian Wedding Collection', 'maharashtrian-wedding', 'Wedding function sarees', 'MAHARASHTRIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bhsr3zpvtn5', 'Maharashtrian Festive Collection', 'maharashtrian-festive', 'Festival wear sarees', 'MAHARASHTRIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bhtn2kzslyk', 'Maharashtrian Haldi Collection', 'maharashtrian-haldi', 'Haldi ceremony sarees', 'MAHARASHTRIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bhu9sxeidzy', 'Maharashtrian Reception Collection', 'maharashtrian-reception', 'Reception sarees', 'MAHARASHTRIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bhv7yg09v2h', 'Maharashtrian Traditional Wear', 'maharashtrian-traditional', 'Everyday traditional wear', 'MAHARASHTRIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bhwwe8mg37u', 'Banarasi Silk', 'banarasi-silk', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bhxkd64k1gp', 'Kanjivaram Silk', 'kanjivaram-silk', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bhyig0x0ls7', 'Patola', 'patola', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bhzypytw3z6', 'Bandhani', 'bandhani', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh105v7j03d5', 'Chanderi', 'chanderi', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh11cr20ipo2', 'Maheshwari', 'maheshwari', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh12qo9m7ls7', 'Kota Doria', 'kota-doria', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh13bfqke3ej', 'Tussar Silk', 'tussar-silk', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh14tqaabegl', 'Organza', 'organza', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh15e758qicp', 'Linen', 'linen', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh16d7rw8iur', 'Cotton', 'cotton', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh17oyts5btl', 'Georgette', 'georgette', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh1893c5taz4', 'Chiffon', 'chiffon', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh196g3d1320', 'Crepe', 'crepe', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh1asvtcgabz', 'Satin Silk', 'satin-silk', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh1bakxyyxaz', 'Soft Silk', 'soft-silk', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh1c8c4i8yzy', 'Tissue Silk', 'tissue-silk', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh1djx2nd575', 'Handloom Collection', 'handloom-collection', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh1eed5maz4a', 'Printed Sarees', 'printed-sarees', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh1fbk06140t', 'Embroidered Sarees', 'embroidered-sarees', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh1gukd20lps', 'Party Wear Sarees', 'party-wear-sarees', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh1h34ypuggc', 'Office Wear Sarees', 'office-wear-sarees', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh1i2t73htzm', 'Casual Wear Sarees', 'casual-wear-sarees', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh1jazq3i1rr', 'Designer Sarees', 'designer-sarees', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh1krqwvuxps', 'Wedding Collection', 'wedding-collection', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh1lkswlwz8g', 'Festive Collection', 'festive-collection', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('catgmtsq62bh1mwvt95u1d', 'Luxury Collection', 'luxury-collection', NULL, 'PAN_INDIAN', NULL, NULL, 1, 0, NULL, NULL, NULL, '2026-09-08 13:48:23', '2026-09-08 13:48:23');

INSERT IGNORE INTO `occasion` (`id`, `name`, `slug`) VALUES
('occmtsq62bj1n9hiq95zw', 'Maharashtrian Wedding', 'maharashtrian-wedding'),
('occmtsq62bj1orce5eaqb', 'Bride', 'bride'),
('occmtsq62bj1prgcmr2zs', 'Bride\'s Mother', 'bride-s-mother'),
('occmtsq62bj1q1bovpuc5', 'Haldi Ceremony', 'haldi-ceremony'),
('occmtsq62bj1ro2xi3cu2', 'Mehendi Ceremony', 'mehendi-ceremony'),
('occmtsq62bj1s1duf6zdg', 'Sangeet', 'sangeet'),
('occmtsq62bj1t31elzsm6', 'Reception', 'reception'),
('occmtsq62bj1u0zp1ccxy', 'Engagement', 'engagement'),
('occmtsq62bj1vvfpet1o0', 'Gudi Padwa', 'gudi-padwa'),
('occmtsq62bj1wv5ph8hw8', 'Ganesh Festival', 'ganesh-festival'),
('occmtsq62bj1xed3jc2tk', 'Diwali', 'diwali'),
('occmtsq62bj1y2eqmx8ss', 'Navratri', 'navratri'),
('occmtsq62bj1z84a3wa15', 'Mangalagaur', 'mangalagaur'),
('occmtsq62bj20t7t9n8sv', 'Vat Pournima', 'vat-pournima'),
('occmtsq62bj21urct36ia', 'Traditional Functions', 'traditional-functions'),
('occmtsq62bj22yzxignb9', 'Office Wear', 'office-wear'),
('occmtsq62bj23o86k05mq', 'Daily Wear', 'daily-wear'),
('occmtsq62bj243hh0o031', 'Party Wear', 'party-wear'),
('occmtsq62bj25m4lpum11', 'Temple Visit', 'temple-visit'),
('occmtsq62bj261plsk321', 'Housewarming', 'housewarming'),
('occmtsq62bj27b6n0x9f6', 'Baby Shower', 'baby-shower'),
('occmtsq62bj28wcekkmhj', 'Naming Ceremony', 'naming-ceremony');

INSERT IGNORE INTO `landingpage` (`id`, `slug`, `title`, `heroImageUrl`, `contentHtml`, `metaTitle`, `metaDescription`, `categoryId`, `collectionId`, `isActive`, `createdAt`, `updatedAt`) VALUES
('lpmtsq62bj29z4qwzajm', 'buy-paithani-sarees-online', 'Buy Paithani Sarees Online', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('lpmtsq62bj2azxv494l0', 'pure-silk-paithani', 'Pure Silk Paithani', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('lpmtsq62bj2b207e5fk5', 'yeola-paithani-collection', 'Yeola Paithani Collection', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('lpmtsq62bj2cu27dbfju', 'maharashtrian-wedding-sarees', 'Maharashtrian Wedding Sarees', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('lpmtsq62bj2dg3mqsoyg', 'nauvari-sarees-online', 'Nauvari Sarees Online', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('lpmtsq62bj2egbwhbh2q', 'ready-to-wear-nauvari', 'Ready-to-Wear Nauvari', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('lpmtsq62bj2f9psr5vn7', 'maharashtrian-bridal-collection', 'Maharashtrian Bridal Collection', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('lpmtsq62bj2g1adon02l', 'gudi-padwa-sarees', 'Gudi Padwa Sarees', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('lpmtsq62bj2hfxen0gk9', 'diwali-sarees', 'Diwali Sarees', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('lpmtsq62bj2i6s0wjz8m', 'ganesh-festival-sarees', 'Ganesh Festival Sarees', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('lpmtsq62bj2jv8zcjize', 'narayan-peth-sarees', 'Narayan Peth Sarees', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('lpmtsq62bj2knyocnh2l', 'solapuri-cotton-sarees', 'Solapuri Cotton Sarees', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('lpmtsq62bj2l9dk62bdy', 'traditional-maharashtrian-sarees', 'Traditional Maharashtrian Sarees', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('lpmtsq62bj2m7ngfm704', 'best-saree-shop-in-maharashtra', 'Best Saree Shop in Maharashtra', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('lpmtsq62bj2n4wl7e4p1', 'premium-paithani-collection', 'Premium Paithani Collection', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-09-08 13:48:23', '2026-09-08 13:48:23'),
('lpmtsq62bj2ou4ditbyb', 'handloom-maharashtra-sarees', 'Handloom Maharashtra Sarees', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-09-08 13:48:23', '2026-09-08 13:48:23');

INSERT IGNORE INTO `user` (`id`, `name`, `email`, `phone`, `passwordHash`, `role`, `isEmailVerified`, `isPhoneVerified`, `avatarUrl`, `isActive`, `createdAt`, `updatedAt`) VALUES
('usrmtsq62o22pkbckwv52', 'Super Admin', 'admin@anandisaree.com', NULL, '$2a$12$CZHMnjL4B2Y8USDQn0mXUOAJIH0hD9UYQyJqiDJUxw3GteSd86uta', 'SUPER_ADMIN', 1, 0, NULL, 1, '2026-09-08 13:48:24', '2026-09-08 13:48:24');

INSERT IGNORE INTO `product` (`id`, `sku`, `name`, `slug`, `shortDescription`, `description`, `brandId`, `fabric`, `weavingTechnique`, `isHandloom`, `borderType`, `palluDesign`, `designPattern`, `color`, `secondaryColors`, `sareeLength`, `blouseIncluded`, `blouseLength`, `weightGrams`, `craftOrigin`, `state`, `district`, `weaverDetails`, `mrp`, `sellingPrice`, `gstPercent`, `stockQuantity`, `lowStockThreshold`, `dispatchDays`, `deliveryEstimateDays`, `washCare`, `isActive`, `isFeatured`, `isNewArrival`, `isBestSeller`, `isTodaysDeal`, `isLiveSpecial`, `isTopSelection`, `publishedAt`, `deletedAt`, `metaTitle`, `metaDescription`, `avgRating`, `reviewCount`, `viewCount`, `soldCount`, `createdAt`, `updatedAt`) VALUES
('prodmtsq62o22qht6e2l3o', 'PTH-YL-001', 'Yeola Pure Silk Paithani – Peacock Motif', 'yeola-pure-silk-paithani-peacock-motif', 'Authentic Pure Silk saree in maroon, handcrafted in Yeola.', 'This Yeola Pure Silk Paithani – Peacock Motif is a part of our curated Maharashtrian saree collection. Woven from pure silk, it features peacock detailing and comes with an unstitched blouse piece. Sourced directly from artisans in Yeola, Nashik district.', NULL, 'Pure Silk', 'Handloom', 1, 'Muniya Border', 'Peacock Pallu', 'Peacock', 'Maroon', NULL, 5.5, 1, 0.8, 650, 'Yeola', 'Maharashtra', 'Nashik', 'Handwoven by local artisan weaver families.', 24999, 18999, 5, 8, 5, 2, 7, 'Dry clean only. Store in a muslin cloth away from direct sunlight.', 1, 1, 1, 0, 0, 0, 0, '2026-09-08 13:48:24', NULL, NULL, NULL, '4.34', 8, 0, 34, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('prodmtsq62o22s4c49fa7c', 'PTH-YL-002', 'Bangdi Mor Paithani – Semi Silk', 'bangdi-mor-paithani-semi-silk', 'Authentic Semi Silk saree in bottle green, handcrafted in Yeola.', 'This Bangdi Mor Paithani – Semi Silk is a part of our curated Maharashtrian saree collection. Woven from semi silk, it features bangdi mor detailing and comes with an unstitched blouse piece. Sourced directly from artisans in Yeola, Nashik district.', NULL, 'Semi Silk', 'Handloom', 1, 'Bangdi Mor Border', 'Traditional Maharashtrian Pallu', 'Bangdi Mor', 'Bottle Green', NULL, 5.5, 1, 0.8, 650, 'Yeola', 'Maharashtra', 'Nashik', 'Handwoven by local artisan weaver families.', 21999, 16999, 5, 12, 5, 2, 7, 'Dry clean only. Store in a muslin cloth away from direct sunlight.', 1, 0, 0, 1, 0, 0, 0, '2026-09-08 13:48:24', NULL, NULL, NULL, '4.59', 14, 0, 58, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('prodmtsq62o22usze0evr6', 'PTH-AS-003', 'Asawali Paithani Silk – Wedding Edit', 'asawali-paithani-silk-wedding-edit', 'Authentic Pure Silk saree in wine, handcrafted in Paithan.', 'This Asawali Paithani Silk – Wedding Edit is a part of our curated Maharashtrian saree collection. Woven from pure silk, it features asawali detailing and comes with an unstitched blouse piece. Sourced directly from artisans in Paithan, Chhatrapati Sambhajinagar district.', NULL, 'Pure Silk', 'Handloom', 1, 'Zari Border', 'Asawali Pallu', 'Asawali', 'Wine', NULL, 5.5, 1, 0.8, 650, 'Paithan', 'Maharashtra', 'Chhatrapati Sambhajinagar', 'Handwoven by local artisan weaver families.', 29999, 23999, 5, 5, 5, 2, 7, 'Dry clean only. Store in a muslin cloth away from direct sunlight.', 1, 1, 0, 0, 0, 0, 0, '2026-09-08 13:48:24', NULL, NULL, NULL, '4.27', 5, 0, 21, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('prodmtsq62o22wdvxt0dju', 'PTH-NR-004', 'Narali Border Paithani – Kesari', 'narali-border-paithani-kesari', 'Authentic Tissue Silk saree in kesari (saffron), handcrafted in Yeola.', 'This Narali Border Paithani – Kesari is a part of our curated Maharashtrian saree collection. Woven from tissue silk, it features lotus detailing and comes with an unstitched blouse piece. Sourced directly from artisans in Yeola, Nashik district.', NULL, 'Tissue Silk', 'Handloom', 1, 'Narali Border', 'Lotus Pallu', 'Lotus', 'Kesari (Saffron)', NULL, 5.5, 1, 0.8, 650, 'Yeola', 'Maharashtra', 'Nashik', 'Handwoven by local artisan weaver families.', 19999, 15499, 5, 10, 5, 2, 7, 'Dry clean only. Store in a muslin cloth away from direct sunlight.', 1, 0, 1, 0, 0, 0, 0, '2026-09-08 13:48:24', NULL, NULL, NULL, '4.36', 3, 0, 15, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('prodmtsq62o22yqpr3cqov', 'NAU-RW-001', 'Peacock Motif Nauvari – Ready to Wear', 'peacock-motif-nauvari-ready-to-wear', 'Authentic Cotton Silk saree in rani pink, handcrafted in Kolhapur.', 'This Peacock Motif Nauvari – Ready to Wear is a part of our curated Maharashtrian saree collection. Woven from cotton silk, it features peacock detailing and comes with an unstitched blouse piece. Sourced directly from artisans in Kolhapur, Kolhapur district.', NULL, 'Cotton Silk', 'Machine Made', 0, 'Temple Border', NULL, 'Peacock', 'Rani Pink', NULL, 5.5, 1, 0.8, 650, 'Kolhapur', 'Maharashtra', 'Kolhapur', NULL, 8999, 6499, 5, 20, 5, 2, 7, 'Dry clean only. Store in a muslin cloth away from direct sunlight.', 1, 0, 1, 0, 0, 0, 0, '2026-09-08 13:48:24', NULL, NULL, NULL, '4.31', 11, 0, 47, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('prodmtsq62o230ta45lin3', 'NAU-CT-002', 'Traditional Cotton Nauvari – Kashta Style', 'traditional-cotton-nauvari-kashta-style', 'Authentic Cotton saree in turquoise, handcrafted in Solapur.', 'This Traditional Cotton Nauvari – Kashta Style is a part of our curated Maharashtrian saree collection. Woven from cotton, it features contrast border detailing and comes with an unstitched blouse piece. Sourced directly from artisans in Solapur, Solapur district.', NULL, 'Cotton', 'Handloom', 1, 'Contrast Border', NULL, NULL, 'Turquoise', NULL, 5.5, 1, 0.8, 650, 'Solapur', 'Maharashtra', 'Solapur', 'Handwoven by local artisan weaver families.', 4299, 3299, 5, 25, 5, 2, 7, 'Dry clean only. Store in a muslin cloth away from direct sunlight.', 1, 0, 0, 0, 0, 0, 0, '2026-09-08 13:48:24', NULL, NULL, NULL, '4.21', 15, 0, 62, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('prodmtsq62o232p2na04ep', 'NAU-SK-003', 'Silk Nauvari – Festive Collection', 'silk-nauvari-festive-collection', 'Authentic Silk Blend saree in emerald green, handcrafted in Pune.', 'This Silk Nauvari – Festive Collection is a part of our curated Maharashtrian saree collection. Woven from silk blend, it features zari border detailing and comes with an unstitched blouse piece. Sourced directly from artisans in Pune, Pune district.', NULL, 'Silk Blend', 'Machine Made', 0, 'Zari Border', NULL, NULL, 'Emerald Green', NULL, 5.5, 1, 0.8, 650, 'Pune', 'Maharashtra', 'Pune', NULL, 6499, 4999, 5, 14, 5, 2, 7, 'Dry clean only. Store in a muslin cloth away from direct sunlight.', 1, 0, 0, 1, 0, 0, 0, '2026-09-08 13:48:24', NULL, NULL, NULL, '4.90', 9, 0, 39, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('prodmtsq62o2348t8nbq0g', 'NPT-HL-001', 'Narayan Peth Handloom Cotton Saree', 'narayan-peth-handloom-cotton-saree', 'Authentic Cotton saree in mustard yellow, handcrafted in Narayan Peth, Pune.', 'This Narayan Peth Handloom Cotton Saree is a part of our curated Maharashtrian saree collection. Woven from cotton, it features plain border detailing and comes with an unstitched blouse piece. Sourced directly from artisans in Narayan Peth, Pune, Pune district.', NULL, 'Cotton', 'Handloom', 1, 'Plain Border', NULL, NULL, 'Mustard Yellow', NULL, 5.5, 1, 0.8, 650, 'Narayan Peth, Pune', 'Maharashtra', 'Pune', 'Handwoven by local artisan weaver families.', 6999, 5299, 5, 16, 5, 2, 7, 'Dry clean only. Store in a muslin cloth away from direct sunlight.', 1, 0, 1, 0, 0, 0, 0, '2026-09-08 13:48:24', NULL, NULL, NULL, '4.35', 4, 0, 18, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('prodmtsq62o236f9o6stpd', 'SLP-CT-001', 'Solapuri Cotton Handloom – Daily Wear', 'solapuri-cotton-handloom-daily-wear', 'Authentic Cotton saree in beige, handcrafted in Solapur.', 'This Solapuri Cotton Handloom – Daily Wear is a part of our curated Maharashtrian saree collection. Woven from cotton, it features plain border detailing and comes with an unstitched blouse piece. Sourced directly from artisans in Solapur, Solapur district.', NULL, 'Cotton', 'Handloom', 1, 'Plain Border', NULL, NULL, 'Beige', NULL, 5.5, 1, 0.8, 650, 'Solapur', 'Maharashtra', 'Solapur', 'Handwoven by local artisan weaver families.', 4299, 3299, 5, 30, 5, 2, 7, 'Dry clean only. Store in a muslin cloth away from direct sunlight.', 1, 0, 0, 1, 0, 0, 0, '2026-09-08 13:48:24', NULL, NULL, NULL, '4.35', 17, 0, 71, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('prodmtsq62o338dtz0hvwi', 'SLP-CT-002', 'Solapuri Cotton – Office Wear Stripes', 'solapuri-cotton-office-wear-stripes', 'Authentic Cotton saree in peacock blue, handcrafted in Solapur.', 'This Solapuri Cotton – Office Wear Stripes is a part of our curated Maharashtrian saree collection. Woven from cotton, it features stripes detailing and comes with an unstitched blouse piece. Sourced directly from artisans in Solapur, Solapur district.', NULL, 'Cotton', 'Handloom', 1, 'Contrast Border', NULL, 'Stripes', 'Peacock Blue', NULL, 5.5, 1, 0.8, 650, 'Solapur', 'Maharashtra', 'Solapur', 'Handwoven by local artisan weaver families.', 3799, 2899, 5, 22, 5, 2, 7, 'Dry clean only. Store in a muslin cloth away from direct sunlight.', 1, 0, 0, 0, 0, 0, 0, '2026-09-08 13:48:24', NULL, NULL, NULL, '4.61', 7, 0, 28, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('prodmtsq62o33adeampfwa', 'HDL-KH-001', 'Khun Fabric Handloom Saree', 'khun-fabric-handloom-saree', 'Authentic Khun Fabric saree in purple, handcrafted in Kolhapur.', 'This Khun Fabric Handloom Saree is a part of our curated Maharashtrian saree collection. Woven from khun fabric, it features temple border detailing and comes with an unstitched blouse piece. Sourced directly from artisans in Kolhapur, Kolhapur district.', NULL, 'Khun Fabric', 'Handloom', 1, 'Temple Border', NULL, NULL, 'Purple', NULL, 5.5, 1, 0.8, 650, 'Kolhapur', 'Maharashtra', 'Kolhapur', 'Handwoven by local artisan weaver families.', 7499, 5999, 5, 9, 5, 2, 7, 'Dry clean only. Store in a muslin cloth away from direct sunlight.', 1, 1, 0, 0, 0, 0, 0, '2026-09-08 13:48:24', NULL, NULL, NULL, '4.73', 3, 0, 12, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('prodmtsq62o33ciez5q6ra', 'HDL-IL-002', 'Ilkal Handloom Silk Saree', 'ilkal-handloom-silk-saree', 'Authentic Art Silk saree in royal blue, handcrafted in Solapur border region.', 'This Ilkal Handloom Silk Saree is a part of our curated Maharashtrian saree collection. Woven from art silk, it features temple border detailing and comes with an unstitched blouse piece. Sourced directly from artisans in Solapur border region, Solapur district.', NULL, 'Art Silk', 'Handloom', 1, 'Temple Border', NULL, NULL, 'Royal Blue', NULL, 5.5, 1, 0.8, 650, 'Solapur border region', 'Maharashtra', 'Solapur', 'Handwoven by local artisan weaver families.', 8999, 6999, 5, 11, 5, 2, 7, 'Dry clean only. Store in a muslin cloth away from direct sunlight.', 1, 0, 0, 0, 0, 0, 0, '2026-09-08 13:48:24', NULL, NULL, NULL, '4.41', 2, 0, 9, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('prodmtsq62o33epu80kx6n', 'DSG-EM-001', 'Designer Embroidered Georgette Saree', 'designer-embroidered-georgette-saree', 'Authentic Georgette saree in magenta, handcrafted in Mumbai.', 'This Designer Embroidered Georgette Saree is a part of our curated Maharashtrian saree collection. Woven from georgette, it features embroidery detailing and comes with an unstitched blouse piece. Sourced directly from artisans in Mumbai, Mumbai district.', NULL, 'Georgette', 'Machine Made', 0, NULL, NULL, 'Embroidery', 'Magenta', NULL, 5.5, 1, 0.8, 650, 'Mumbai', 'Maharashtra', 'Mumbai', NULL, 12999, 9499, 5, 13, 5, 2, 7, 'Dry clean only. Store in a muslin cloth away from direct sunlight.', 1, 0, 1, 0, 0, 0, 0, '2026-09-08 13:48:24', NULL, NULL, NULL, '4.43', 6, 0, 24, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('prodmtsq62o33g8w15czj9', 'DSG-PT-002', 'Designer Party Wear Satin Silk Saree', 'designer-party-wear-satin-silk-saree', 'Authentic Satin saree in black, handcrafted in Mumbai.', 'This Designer Party Wear Satin Silk Saree is a part of our curated Maharashtrian saree collection. Woven from satin, it features stone work detailing and comes with an unstitched blouse piece. Sourced directly from artisans in Mumbai, Mumbai district.', NULL, 'Satin', 'Machine Made', 0, NULL, NULL, 'Stone Work', 'Black', NULL, 5.5, 1, 0.8, 650, 'Mumbai', 'Maharashtra', 'Mumbai', NULL, 10999, 7999, 5, 17, 5, 2, 7, 'Dry clean only. Store in a muslin cloth away from direct sunlight.', 1, 0, 0, 0, 0, 0, 0, '2026-09-08 13:48:24', NULL, NULL, NULL, '4.76', 7, 0, 31, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('prodmtsq62o33i88jd66yl', 'MWB-BR-001', 'Maharashtrian Bridal Paithani – Premium', 'maharashtrian-bridal-paithani-premium', 'Authentic Pure Silk saree in red, handcrafted in Yeola.', 'This Maharashtrian Bridal Paithani – Premium is a part of our curated Maharashtrian saree collection. Woven from pure silk, it features antique gold border detailing and comes with an unstitched blouse piece. Sourced directly from artisans in Yeola, Nashik district.', NULL, 'Pure Silk', 'Handloom', 1, 'Antique Gold Border', 'Rich Zari Pallu', NULL, 'Red', NULL, 5.5, 1, 0.8, 650, 'Yeola', 'Maharashtra', 'Nashik', 'Handwoven by local artisan weaver families.', 34999, 27999, 5, 4, 5, 2, 7, 'Dry clean only. Store in a muslin cloth away from direct sunlight.', 1, 1, 0, 0, 0, 0, 0, '2026-09-08 13:48:24', NULL, NULL, NULL, '4.50', 1, 0, 7, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('prodmtsq62o33k9xr3dm6f', 'MHD-FS-001', 'Maharashtrian Festive Silk Saree', 'maharashtrian-festive-silk-saree', 'Authentic Pure Silk saree in parrot green, handcrafted in Paithan.', 'This Maharashtrian Festive Silk Saree is a part of our curated Maharashtrian saree collection. Woven from pure silk, it features zari border detailing and comes with an unstitched blouse piece. Sourced directly from artisans in Paithan, Chhatrapati Sambhajinagar district.', NULL, 'Pure Silk', 'Handloom', 1, 'Zari Border', NULL, NULL, 'Parrot Green', NULL, 5.5, 1, 0.8, 650, 'Paithan', 'Maharashtra', 'Chhatrapati Sambhajinagar', 'Handwoven by local artisan weaver families.', 15999, 12499, 5, 18, 5, 2, 7, 'Dry clean only. Store in a muslin cloth away from direct sunlight.', 1, 0, 0, 0, 0, 0, 0, '2026-09-08 13:48:24', NULL, NULL, NULL, '4.46', 6, 0, 26, '2026-09-08 13:48:24', '2026-09-08 13:48:24');

INSERT IGNORE INTO `productimage` (`id`, `productId`, `url`, `thumbnailUrl`, `altText`, `sortOrder`, `isPrimary`, `createdAt`) VALUES
('imgmtsq62o22r7ub05fcy', 'prodmtsq62o22qht6e2l3o', 'https://images.unsplash.com/photo-1588140686379-1b76a52103dc?auto=format&fit=crop&w=1000&q=80', NULL, 'Yeola Pure Silk Paithani – Peacock Motif', 0, 1, '2026-09-08 13:48:24'),
('imgmtsq62o22t1r4ut6vn', 'prodmtsq62o22s4c49fa7c', 'https://images.unsplash.com/photo-1717585679395-bbe39b5fb6bc?auto=format&fit=crop&w=1000&q=80', NULL, 'Bangdi Mor Paithani – Semi Silk', 0, 1, '2026-09-08 13:48:24'),
('imgmtsq62o22vc7vgvlvp', 'prodmtsq62o22usze0evr6', 'https://images.unsplash.com/photo-1769500804057-ca1391bf4617?auto=format&fit=crop&w=1000&q=80', NULL, 'Asawali Paithani Silk – Wedding Edit', 0, 1, '2026-09-08 13:48:24'),
('imgmtsq62o22x6nnwexx2', 'prodmtsq62o22wdvxt0dju', 'https://images.unsplash.com/photo-1734527225029-a202aec0ad98?auto=format&fit=crop&w=1000&q=80', NULL, 'Narali Border Paithani – Kesari', 0, 1, '2026-09-08 13:48:24'),
('imgmtsq62o22z6qjgviot', 'prodmtsq62o22yqpr3cqov', 'https://images.unsplash.com/photo-1594761253360-2a487accc7bc?auto=format&fit=crop&w=1000&q=80', NULL, 'Peacock Motif Nauvari – Ready to Wear', 0, 1, '2026-09-08 13:48:24'),
('imgmtsq62o231byngefvv', 'prodmtsq62o230ta45lin3', 'https://images.unsplash.com/photo-1617331721458-bd3bd3f9c7f8?auto=format&fit=crop&w=1000&q=80', NULL, 'Traditional Cotton Nauvari – Kashta Style', 0, 1, '2026-09-08 13:48:24'),
('imgmtsq62o233s7eocqi6', 'prodmtsq62o232p2na04ep', 'https://images.unsplash.com/photo-1697347811496-c57e2ddc0b94?auto=format&fit=crop&w=1000&q=80', NULL, 'Silk Nauvari – Festive Collection', 0, 1, '2026-09-08 13:48:24'),
('imgmtsq62o235zq7b9u4s', 'prodmtsq62o2348t8nbq0g', 'https://images.unsplash.com/photo-1676696706907-0e04665b80bd?auto=format&fit=crop&w=1000&q=80', NULL, 'Narayan Peth Handloom Cotton Saree', 0, 1, '2026-09-08 13:48:24'),
('imgmtsq62o337mn2l7eo2', 'prodmtsq62o236f9o6stpd', 'https://images.unsplash.com/photo-1676696706907-0e04665b80bd?auto=format&fit=crop&w=1000&q=80', NULL, 'Solapuri Cotton Handloom – Daily Wear', 0, 1, '2026-09-08 13:48:24'),
('imgmtsq62o339c1k1gumj', 'prodmtsq62o338dtz0hvwi', 'https://images.unsplash.com/photo-1745482036066-5d215ed6b910?auto=format&fit=crop&w=1000&q=80', NULL, 'Solapuri Cotton – Office Wear Stripes', 0, 1, '2026-09-08 13:48:24'),
('imgmtsq62o33bfakvhkyz', 'prodmtsq62o33adeampfwa', 'https://images.unsplash.com/photo-1768341395956-fed92f537228?auto=format&fit=crop&w=1000&q=80', NULL, 'Khun Fabric Handloom Saree', 0, 1, '2026-09-08 13:48:24'),
('imgmtsq62o33dr8he08gx', 'prodmtsq62o33ciez5q6ra', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80', NULL, 'Ilkal Handloom Silk Saree', 0, 1, '2026-09-08 13:48:24'),
('imgmtsq62o33fn94z4ghb', 'prodmtsq62o33epu80kx6n', 'https://images.unsplash.com/photo-1742891603547-950f510710d7?auto=format&fit=crop&w=1000&q=80', NULL, 'Designer Embroidered Georgette Saree', 0, 1, '2026-09-08 13:48:24'),
('imgmtsq62o33he4vfr3vo', 'prodmtsq62o33g8w15czj9', 'https://images.unsplash.com/photo-1676893140066-df87af3bc566?auto=format&fit=crop&w=1000&q=80', NULL, 'Designer Party Wear Satin Silk Saree', 0, 1, '2026-09-08 13:48:24'),
('imgmtsq62o33j44mi3tql', 'prodmtsq62o33i88jd66yl', 'https://images.unsplash.com/photo-1769500804057-ca1391bf4617?auto=format&fit=crop&w=1000&q=80', NULL, 'Maharashtrian Bridal Paithani – Premium', 0, 1, '2026-09-08 13:48:24'),
('imgmtsq62o33l0doh83hx', 'prodmtsq62o33k9xr3dm6f', 'https://images.unsplash.com/photo-1745482036066-5d215ed6b910?auto=format&fit=crop&w=1000&q=80', NULL, 'Maharashtrian Festive Silk Saree', 0, 1, '2026-09-08 13:48:24');

INSERT IGNORE INTO `productcategory` (`productId`, `categoryId`) VALUES
('prodmtsq62o22qht6e2l3o', 'catgmtsq62bg14mhddv2q'),
('prodmtsq62o22s4c49fa7c', 'catgmtsq62bg14mhddv2q'),
('prodmtsq62o22usze0evr6', 'catgmtsq62bg14mhddv2q'),
('prodmtsq62o22wdvxt0dju', 'catgmtsq62bg14mhddv2q'),
('prodmtsq62o22yqpr3cqov', 'catgmtsq62bgfcapidc4c'),
('prodmtsq62o230ta45lin3', 'catgmtsq62bgfcapidc4c'),
('prodmtsq62o232p2na04ep', 'catgmtsq62bgfcapidc4c'),
('prodmtsq62o2348t8nbq0g', 'catgmtsq62bgmxn6d51mi'),
('prodmtsq62o236f9o6stpd', 'catgmtsq62bgnfqck1h1n'),
('prodmtsq62o338dtz0hvwi', 'catgmtsq62bgnfqck1h1n'),
('prodmtsq62o33i88jd66yl', 'catgmtsq62bgq2s29i2a3'),
('prodmtsq62o33k9xr3dm6f', 'catgmtsq62bhsr3zpvtn5');

INSERT IGNORE INTO `user` (`id`, `name`, `email`, `phone`, `passwordHash`, `role`, `isEmailVerified`, `isPhoneVerified`, `avatarUrl`, `isActive`, `createdAt`, `updatedAt`) VALUES
('usrmtsq630n3mkpqouyiu', 'Anjali Deshmukh', 'anjali.deshmukh@example.com', '9822011122', '$2a$12$5SAEy1kvguLB9povb9hiR.NP/UlEnu/0T.KwYFcK3gMqnnFFddyCS', 'CUSTOMER', 1, 1, NULL, 1, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('usrmtsq630n3ponwhwdhl', 'Snehal Patil', 'snehal.patil@example.com', '9822033344', '$2a$12$5SAEy1kvguLB9povb9hiR.NP/UlEnu/0T.KwYFcK3gMqnnFFddyCS', 'CUSTOMER', 1, 1, NULL, 1, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('usrmtsq630n3sd4sla4vl', 'Radhika Kulkarni', 'radhika.kulkarni@example.com', '9822055566', '$2a$12$5SAEy1kvguLB9povb9hiR.NP/UlEnu/0T.KwYFcK3gMqnnFFddyCS', 'CUSTOMER', 1, 1, NULL, 1, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('usrmtsq630n3veon4ghae', 'Ashwini Joshi', 'ashwini.joshi@example.com', '9822077788', '$2a$12$5SAEy1kvguLB9povb9hiR.NP/UlEnu/0T.KwYFcK3gMqnnFFddyCS', 'CUSTOMER', 1, 1, NULL, 1, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('usrmtsq630n3ysiq35oxp', 'Meera Bhosale', 'meera.bhosale@example.com', '9822099900', '$2a$12$5SAEy1kvguLB9povb9hiR.NP/UlEnu/0T.KwYFcK3gMqnnFFddyCS', 'CUSTOMER', 1, 1, NULL, 1, '2026-09-08 13:48:24', '2026-09-08 13:48:24');

INSERT IGNORE INTO `address` (`id`, `userId`, `type`, `fullName`, `phone`, `line1`, `line2`, `landmark`, `city`, `district`, `state`, `pincode`, `country`, `isDefault`, `createdAt`, `updatedAt`) VALUES
('addrmtsq630n3nwz4i5foe', 'usrmtsq630n3mkpqouyiu', 'HOME', 'Anjali Deshmukh', '9822011122', '668, Shivaji Nagar', NULL, NULL, 'Pune', 'Pune', 'Maharashtra', '411001', 'India', 1, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('addrmtsq630n3q6n9uz9p3', 'usrmtsq630n3ponwhwdhl', 'HOME', 'Snehal Patil', '9822033344', '520, Shivaji Nagar', NULL, NULL, 'Nashik', 'Nashik', 'Maharashtra', '422001', 'India', 1, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('addrmtsq630n3tudjhg6gs', 'usrmtsq630n3sd4sla4vl', 'HOME', 'Radhika Kulkarni', '9822055566', '102, Shivaji Nagar', NULL, NULL, 'Mumbai', 'Mumbai', 'Maharashtra', '400001', 'India', 1, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('addrmtsq630n3wzfqwb6t1', 'usrmtsq630n3veon4ghae', 'HOME', 'Ashwini Joshi', '9822077788', '228, Shivaji Nagar', NULL, NULL, 'Kolhapur', 'Kolhapur', 'Maharashtra', '416001', 'India', 1, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('addrmtsq630n3z2tv4akld', 'usrmtsq630n3ysiq35oxp', 'HOME', 'Meera Bhosale', '9822099900', '633, Shivaji Nagar', NULL, NULL, 'Nagpur', 'Nagpur', 'Maharashtra', '440001', 'India', 1, '2026-09-08 13:48:24', '2026-09-08 13:48:24');

INSERT IGNORE INTO `wallet` (`id`, `userId`, `balance`, `updatedAt`) VALUES
('walmtsq630n3o6bqcy6rt', 'usrmtsq630n3mkpqouyiu', 0, '2026-09-08 13:48:24'),
('walmtsq630n3rrx34ti21', 'usrmtsq630n3ponwhwdhl', 0, '2026-09-08 13:48:24'),
('walmtsq630n3usbufsoe1', 'usrmtsq630n3sd4sla4vl', 0, '2026-09-08 13:48:24'),
('walmtsq630n3x8ofsu4ls', 'usrmtsq630n3veon4ghae', 0, '2026-09-08 13:48:24'),
('walmtsq630n4004g2h0xs', 'usrmtsq630n3ysiq35oxp', 0, '2026-09-08 13:48:24');

INSERT IGNORE INTO `order` (`id`, `orderNumber`, `userId`, `addressId`, `status`, `paymentMethod`, `paymentStatus`, `razorpayOrderId`, `razorpayPaymentId`, `subtotal`, `discountAmount`, `taxAmount`, `shippingAmount`, `totalAmount`, `couponId`, `giftWrap`, `gstInvoiceNumber`, `trackingNumber`, `courierName`, `cancelReason`, `createdAt`, `updatedAt`) VALUES
('ordmtsq630o41j8ngplki', 'ANS1000', 'usrmtsq630n3mkpqouyiu', 'addrmtsq630n3nwz4i5foe', 'DELIVERED', 'COD', 'PAID', NULL, NULL, 23999, 0, 1200, 0, 25199, NULL, 0, NULL, NULL, NULL, NULL, '2026-08-31 13:48:24', '2026-08-31 13:48:24'),
('ordmtsq630o44g0pb7ue3', 'ANS1001', 'usrmtsq630n3ponwhwdhl', 'addrmtsq630n3q6n9uz9p3', 'DELIVERED', 'RAZORPAY', 'PAID', NULL, NULL, 6499, 0, 325, 0, 6824, NULL, 0, NULL, NULL, NULL, NULL, '2026-09-01 13:48:24', '2026-09-01 13:48:24'),
('ordmtsq630o47crclzqq4', 'ANS1002', 'usrmtsq630n3sd4sla4vl', 'addrmtsq630n3tudjhg6gs', 'DELIVERED', 'RAZORPAY', 'PAID', NULL, NULL, 27999, 0, 1400, 0, 29399, NULL, 0, NULL, NULL, NULL, NULL, '2026-09-02 13:48:24', '2026-09-02 13:48:24'),
('ordmtsq630o4a29qav7bt', 'ANS1003', 'usrmtsq630n3veon4ghae', 'addrmtsq630n3wzfqwb6t1', 'SHIPPED', 'COD', 'PAID', NULL, NULL, 9499, 0, 475, 0, 9974, NULL, 0, NULL, NULL, NULL, NULL, '2026-09-03 13:48:24', '2026-09-03 13:48:24'),
('ordmtsq630o4dorbpd5nx', 'ANS1004', 'usrmtsq630n3ysiq35oxp', 'addrmtsq630n3z2tv4akld', 'PACKED', 'RAZORPAY', 'PAID', NULL, NULL, 9499, 0, 475, 0, 9974, NULL, 0, NULL, NULL, NULL, NULL, '2026-09-04 13:48:24', '2026-09-04 13:48:24'),
('ordmtsq630o4ga6njn58w', 'ANS1005', 'usrmtsq630n3mkpqouyiu', 'addrmtsq630n3nwz4i5foe', 'CONFIRMED', 'RAZORPAY', 'PAID', NULL, NULL, 3299, 0, 165, 99, 3563, NULL, 0, NULL, NULL, NULL, NULL, '2026-09-05 13:48:24', '2026-09-05 13:48:24'),
('ordmtsq630o4jk4wdfhr5', 'ANS1006', 'usrmtsq630n3ponwhwdhl', 'addrmtsq630n3q6n9uz9p3', 'PENDING', 'COD', 'PENDING', NULL, NULL, 9499, 0, 475, 0, 9974, NULL, 0, NULL, NULL, NULL, NULL, '2026-09-06 13:48:24', '2026-09-06 13:48:24'),
('ordmtsq630o4myjpmz99z', 'ANS1007', 'usrmtsq630n3sd4sla4vl', 'addrmtsq630n3tudjhg6gs', 'CANCELLED', 'RAZORPAY', 'REFUNDED', NULL, NULL, 7999, 0, 400, 0, 8399, NULL, 0, NULL, NULL, NULL, NULL, '2026-09-07 13:48:24', '2026-09-07 13:48:24');

INSERT IGNORE INTO `orderitem` (`id`, `orderId`, `productId`, `variantId`, `productName`, `sku`, `quantity`, `unitPrice`, `totalPrice`) VALUES
('oimtsq630o42upmif590', 'ordmtsq630o41j8ngplki', 'prodmtsq62o22usze0evr6', NULL, 'Asawali Paithani Silk – Wedding Edit', 'PTH-AS-003', 1, 23999, 23999),
('oimtsq630o45e8lp5eoh', 'ordmtsq630o44g0pb7ue3', 'prodmtsq62o22yqpr3cqov', NULL, 'Peacock Motif Nauvari – Ready to Wear', 'NAU-RW-001', 1, 6499, 6499),
('oimtsq630o48suii45po', 'ordmtsq630o47crclzqq4', 'prodmtsq62o33i88jd66yl', NULL, 'Maharashtrian Bridal Paithani – Premium', 'MWB-BR-001', 1, 27999, 27999),
('oimtsq630o4b0trvw5ph', 'ordmtsq630o4a29qav7bt', 'prodmtsq62o33epu80kx6n', NULL, 'Designer Embroidered Georgette Saree', 'DSG-EM-001', 1, 9499, 9499),
('oimtsq630o4ex57h9pzh', 'ordmtsq630o4dorbpd5nx', 'prodmtsq62o33epu80kx6n', NULL, 'Designer Embroidered Georgette Saree', 'DSG-EM-001', 1, 9499, 9499),
('oimtsq630o4h90e0ftic', 'ordmtsq630o4ga6njn58w', 'prodmtsq62o230ta45lin3', NULL, 'Traditional Cotton Nauvari – Kashta Style', 'NAU-CT-002', 1, 3299, 3299),
('oimtsq630o4krw0ew8fy', 'ordmtsq630o4jk4wdfhr5', 'prodmtsq62o33epu80kx6n', NULL, 'Designer Embroidered Georgette Saree', 'DSG-EM-001', 1, 9499, 9499),
('oimtsq630o4nszvtus6e', 'ordmtsq630o4myjpmz99z', 'prodmtsq62o33g8w15czj9', NULL, 'Designer Party Wear Satin Silk Saree', 'DSG-PT-002', 1, 7999, 7999);

INSERT IGNORE INTO `orderstatushistory` (`id`, `orderId`, `status`, `note`, `changedById`, `createdAt`) VALUES
('oshmtsq630o433tnmh1lg', 'ordmtsq630o41j8ngplki', 'DELIVERED', 'Order placed', NULL, '2026-08-31 13:48:24'),
('oshmtsq630o460cspbnag', 'ordmtsq630o44g0pb7ue3', 'DELIVERED', 'Order placed', NULL, '2026-09-01 13:48:24'),
('oshmtsq630o494ow5m9z1', 'ordmtsq630o47crclzqq4', 'DELIVERED', 'Order placed', NULL, '2026-09-02 13:48:24'),
('oshmtsq630o4c14hrsza2', 'ordmtsq630o4a29qav7bt', 'SHIPPED', 'Order placed', NULL, '2026-09-03 13:48:24'),
('oshmtsq630o4fdv9sn7tr', 'ordmtsq630o4dorbpd5nx', 'PACKED', 'Order placed', NULL, '2026-09-04 13:48:24'),
('oshmtsq630o4id33d9zsa', 'ordmtsq630o4ga6njn58w', 'CONFIRMED', 'Order placed', NULL, '2026-09-05 13:48:24'),
('oshmtsq630o4l55krfrnx', 'ordmtsq630o4jk4wdfhr5', 'PENDING', 'Order placed', NULL, '2026-09-06 13:48:24'),
('oshmtsq630o4oacemg1u5', 'ordmtsq630o4myjpmz99z', 'CANCELLED', 'Order placed', NULL, '2026-09-07 13:48:24');

-- Bump soldCount for products used in demo orders
UPDATE `product` SET `soldCount` = `soldCount` + 1 WHERE `id` = 'prodmtsq62o22usze0evr6';
UPDATE `product` SET `soldCount` = `soldCount` + 1 WHERE `id` = 'prodmtsq62o22yqpr3cqov';
UPDATE `product` SET `soldCount` = `soldCount` + 1 WHERE `id` = 'prodmtsq62o33i88jd66yl';
UPDATE `product` SET `soldCount` = `soldCount` + 3 WHERE `id` = 'prodmtsq62o33epu80kx6n';
UPDATE `product` SET `soldCount` = `soldCount` + 1 WHERE `id` = 'prodmtsq62o230ta45lin3';
UPDATE `product` SET `soldCount` = `soldCount` + 1 WHERE `id` = 'prodmtsq62o33g8w15czj9';

INSERT IGNORE INTO `review` (`id`, `productId`, `userId`, `rating`, `title`, `comment`, `imageUrls`, `status`, `isFeatured`, `createdAt`, `updatedAt`) VALUES
('revmtsq630o4pl3thgnux', 'prodmtsq62o22qht6e2l3o', 'usrmtsq630n3mkpqouyiu', 5, 'Absolutely stunning!', 'The zari work and finishing felt truly handwoven. Wore it for my daughter\'s wedding and got so many compliments.', NULL, 'APPROVED', 1, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('revmtsq630o4qsrmmtmbi', 'prodmtsq62o22s4c49fa7c', 'usrmtsq630n3ponwhwdhl', 5, 'Perfect fit and drape', 'Bought this for Gudi Padwa and the fit and drape were perfect. Delivery was quick and packaging felt premium.', NULL, 'APPROVED', 1, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('revmtsq630o4rkzn13oos', 'prodmtsq62o22usze0evr6', 'usrmtsq630n3sd4sla4vl', 4, 'Great quality', 'Authentic fabric, exactly as pictured. Customer support helped me pick the right blouse size over WhatsApp.', NULL, 'APPROVED', 0, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('revmtsq630o4sh043dbgp', 'prodmtsq62o22wdvxt0dju', 'usrmtsq630n3veon4ghae', 5, 'Worth every rupee', 'This is my third purchase from Anandi Sarees. Quality never disappoints.', NULL, 'APPROVED', 0, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('revmtsq630o4tpp83wdmm', 'prodmtsq62o22yqpr3cqov', 'usrmtsq630n3ysiq35oxp', 4, 'Beautiful colors', 'The color was even richer in person than in the photos. Slight delay in delivery but worth the wait.', NULL, 'APPROVED', 0, '2026-09-08 13:48:24', '2026-09-08 13:48:24'),
('revmtsq630o4utripw6xj', 'prodmtsq62o230ta45lin3', 'usrmtsq630n3mkpqouyiu', 5, 'Absolutely stunning!', 'The zari work and finishing felt truly handwoven. Wore it for my daughter\'s wedding and got so many compliments.', NULL, 'APPROVED', 0, '2026-09-08 13:48:24', '2026-09-08 13:48:24');

INSERT IGNORE INTO `coupon` (`id`, `code`, `type`, `value`, `minOrderAmount`, `maxDiscount`, `usageLimit`, `usedCount`, `isFestival`, `isActive`, `startsAt`, `expiresAt`, `createdAt`) VALUES
('cpnmtsq630o4vjstqqo3d', 'WELCOME10', 'PERCENTAGE', 10, 2999, 1500, 500, 0, 0, 1, NULL, NULL, '2026-09-08 13:48:24'),
('cpnmtsq630o4wk3d1x8mw', 'GUDIPADWA25', 'PERCENTAGE', 25, 4999, 5000, 200, 0, 1, 1, '2026-09-08 13:48:24', '2026-10-08 13:48:24', '2026-09-08 13:48:24'),
('cpnmtsq630o4xs8czsvo8', 'FLAT500', 'FLAT', 500, 3999, NULL, 1000, 0, 0, 1, NULL, NULL, '2026-09-08 13:48:24'),
('cpnmtsq630o4y2obknugq', 'WELCOME15', 'PERCENTAGE', 15, 0, 2000, NULL, 0, 0, 1, NULL, NULL, '2026-09-08 13:48:24');

INSERT IGNORE INTO `banner` (`id`, `title`, `imageUrl`, `linkUrl`, `placement`, `sortOrder`, `isActive`, `startsAt`, `endsAt`, `createdAt`) VALUES
('banmtsq630o4zcmn9o5ps', 'Gudi Padwa Special Collection', 'https://images.unsplash.com/photo-1734527225029-a202aec0ad98?auto=format&fit=crop&w=1800&q=80', '/collection/gudi-padwa', 'HOMEPAGE_SLIDER', 1, 1, NULL, NULL, '2026-09-08 13:48:24'),
('banmtsq630o50ncx6s8my', 'Festive Collection – Up to 25% Off', 'https://images.unsplash.com/photo-1745482036066-5d215ed6b910?auto=format&fit=crop&w=1800&q=80', '/collection/festive', 'FESTIVAL_BANNER', 2, 1, NULL, NULL, '2026-09-08 13:48:24'),
('banmtsq630o51p2g06tlg', 'Bridal Paithani Edit', 'https://images.unsplash.com/photo-1769500804057-ca1391bf4617?auto=format&fit=crop&w=1800&q=80', '/category/paithani', 'COLLECTION_BANNER', 3, 1, NULL, NULL, '2026-09-08 13:48:24');

INSERT IGNORE INTO `testimonial` (`id`, `name`, `location`, `rating`, `message`, `imageUrl`, `isFeatured`, `createdAt`) VALUES
('tstmtsq630o5222ynsnnw', 'Anjali Deshmukh', 'Pune, Maharashtra', 5, 'The Yeola Paithani I ordered for my daughter\'s wedding was beyond beautiful.', NULL, 1, '2026-09-08 13:48:24'),
('tstmtsq630o53mjto378a', 'Snehal Patil', 'Nashik, Maharashtra', 5, 'Bought a Nauvari for Gudi Padwa and the fit and drape were perfect.', NULL, 1, '2026-09-08 13:48:24'),
('tstmtsq630o54lcmw6jir', 'Radhika Kulkarni', 'Mumbai, Maharashtra', 5, 'Authentic Solapuri cotton sarees, exactly as pictured.', NULL, 0, '2026-09-08 13:48:24');

INSERT IGNORE INTO `blogpost` (`id`, `title`, `slug`, `excerpt`, `contentHtml`, `coverImageUrl`, `categoryName`, `tags`, `metaTitle`, `metaDescription`, `isPublished`, `publishedAt`, `createdAt`, `updatedAt`) VALUES
('blgmtsq630p55qu0yz5e5', 'The Art of Paithani: A Weaver\'s Journey from Yeola', 'art-of-paithani-yeola-weavers', 'Discover how Yeola\'s master weavers create every Paithani saree by hand, thread by thread.', '<p>Every Paithani saree begins its journey on a traditional handloom in Yeola, Maharashtra...</p>', 'https://images.unsplash.com/photo-1594761253360-2a487accc7bc?auto=format&fit=crop&w=1200&q=80', 'Craftsmanship', 'paithani,handloom,yeola', NULL, NULL, 1, '2026-09-08 13:48:24', '2026-09-08 13:48:24', '2026-09-08 13:48:24');

SET FOREIGN_KEY_CHECKS=1;
-- Super admin login: admin@anandisaree.com / ChangeMe123!  -- CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN
-- Demo customer login (any of the 5 customer emails above) / Customer@123

