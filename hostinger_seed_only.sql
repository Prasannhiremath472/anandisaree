-- ============================================================
-- Seed data: categories, occasions, landing pages, admin user
-- Generated to match prisma/schema.prisma exactly
-- ============================================================

-- Categories (Maharashtrian, with parent/child tree)

INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catac0c2fe9287c6f8f844eec1d', 'Paithani Sarees', 'paithani', 'Traditional hand-woven Paithani sarees', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat1d8432a2802ccd2f6d8a8385', 'Yeola Paithani', 'paithani-yeola-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat0c2c168b641c792a551c651f', 'Pure Silk Paithani', 'paithani-pure-silk-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat85a6beb69999a34e37221508', 'Handloom Paithani', 'paithani-handloom-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catdd7982fd3b4715473e1a729d', 'Semi Paithani', 'paithani-semi-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catf2207f71be9d58e4d0dae4a6', 'Tissue Paithani', 'paithani-tissue-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catd9c8c5ba977bf69a175ee8f8', 'Muniya Border Paithani', 'paithani-muniya-border-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catdb6fd6f9acdd408d64d6bb8d', 'Bangdi Mor Paithani', 'paithani-bangdi-mor-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cataebfc7107d7774587c56857f', 'Lotus Paithani', 'paithani-lotus-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat21732964c818d83414d6266b', 'Peacock Design Paithani', 'paithani-peacock-design-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catce6713074b2d504b05aa8f90', 'Ajanta Lotus Paithani', 'paithani-ajanta-lotus-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat268980060dbaa27f35279019', 'Asawali Paithani', 'paithani-asawali-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat4533da184b764822f93de426', 'Narali Border Paithani', 'paithani-narali-border-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catcfba50f0a5af6ca4fe70c5e7', 'Kalamkari Paithani', 'paithani-kalamkari-paithani', 'MAHARASHTRIAN', 'catac0c2fe9287c6f8f844eec1d', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat9f64a14429b81fbe3555dffd', 'Nauvari Sarees (9 Yards)', 'nauvari', 'Traditional nine-yard Maharashtrian sarees', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat170172cfb2e5847f951d8da4', 'Kashta Sarees', 'nauvari-kashta-sarees', 'MAHARASHTRIAN', 'cat9f64a14429b81fbe3555dffd', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat99ee91db086a3a7f04cb53bc', 'Traditional Maharashtrian Nauvari', 'nauvari-traditional-maharashtrian-nauvari', 'MAHARASHTRIAN', 'cat9f64a14429b81fbe3555dffd', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cate465eaa7a5453db5be959168', 'Cotton Nauvari', 'nauvari-cotton-nauvari', 'MAHARASHTRIAN', 'cat9f64a14429b81fbe3555dffd', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat18315d309d338200c0866852', 'Silk Nauvari', 'nauvari-silk-nauvari', 'MAHARASHTRIAN', 'cat9f64a14429b81fbe3555dffd', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat4c36d9f406ed5dc330278bf6', 'Ready-to-Wear Nauvari', 'nauvari-ready-to-wear-nauvari', 'MAHARASHTRIAN', 'cat9f64a14429b81fbe3555dffd', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat0e9e4a027b518c2e23724e06', 'Peshwai Sarees', 'peshwai', 'Peshwai era inspired sarees', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat1e05a65039db3566df93fa5c', 'Narayan Peth Sarees', 'narayan-peth', 'Narayan Peth handloom sarees', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat0c43100e58c05264f574fd05', 'Solapuri Cotton Sarees', 'solapuri-cotton', 'Solapur cotton weaves', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat2e81ea8bf3b5dcfc461ba652', 'Ilkal Sarees', 'ilkal', 'Traditional Ilkal weave', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat0252aab030b61ac05782d7c7', 'Khun Fabric Sarees', 'khun-fabric', 'Khun fabric blouse & saree pieces', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat88d30078665d8ccfeac18de2', 'Maharashtrian Bridal Sarees', 'maharashtrian-bridal', 'Bridal collection for Maharashtrian weddings', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat7468ca188a1d6acdc54c7583', 'Maharashtrian Wedding Collection', 'maharashtrian-wedding', 'Wedding function sarees', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat6a2df202a417f2a614a04d54', 'Maharashtrian Festive Collection', 'maharashtrian-festive', 'Festival wear sarees', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catd5703f01063d81a2903a9969', 'Maharashtrian Haldi Collection', 'maharashtrian-haldi', 'Haldi ceremony sarees', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catdedcd7352898f1fd737aa02e', 'Maharashtrian Reception Collection', 'maharashtrian-reception', 'Reception sarees', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat0efedb1d846c90c8722f5c35', 'Maharashtrian Traditional Wear', 'maharashtrian-traditional', 'Everyday traditional wear', 'MAHARASHTRIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

-- Categories (Pan-Indian, flat)

INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat16a46024d009cda71a64c44d', 'Banarasi Silk', 'banarasi-silk', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cate73329494067b11a1f32c079', 'Kanjivaram Silk', 'kanjivaram-silk', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catdba174d24ea55d8c4ce6a2e9', 'Patola', 'patola', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cate6645764cf0b6e3441f24bb1', 'Bandhani', 'bandhani', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat20bf90d4511630eaccda0c1e', 'Chanderi', 'chanderi', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat0ac53b2016a3ac72c2afae09', 'Maheshwari', 'maheshwari', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catfcc3abb0425c13da5bdc9ac9', 'Kota Doria', 'kota-doria', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat48deafdbe1aba5fd2e6571d8', 'Tussar Silk', 'tussar-silk', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catfe1a9b7e15642fd335995505', 'Organza', 'organza', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catf4f2e5719309c386f52bc303', 'Linen', 'linen', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat7737d54804a09ab000eece0f', 'Cotton', 'cotton', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat45245ff3c5a4a52f64bc0f06', 'Georgette', 'georgette', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cata7f0d378aa3b33547fbf3104', 'Chiffon', 'chiffon', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat5e15fe3e3e8b376cab682eb8', 'Crepe', 'crepe', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cata2d9d2e3e035160195ccbe8d', 'Satin Silk', 'satin-silk', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat7e1306d8dcf0ccfaf075009e', 'Soft Silk', 'soft-silk', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catabccc56a904339f6266b48f6', 'Tissue Silk', 'tissue-silk', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cata68e4a9e8ad5fade7e7cede9', 'Handloom Collection', 'handloom-collection', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat79ddcd19e56b1ec0248ddc17', 'Printed Sarees', 'printed-sarees', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat6dfb92fe1871773a7e5df177', 'Embroidered Sarees', 'embroidered-sarees', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat567a5e899b8b63ed999da57e', 'Party Wear Sarees', 'party-wear-sarees', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat6943d3a70e5b9a4bab693f0f', 'Office Wear Sarees', 'office-wear-sarees', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catf7fcf3ab11516afa9bea6c01', 'Casual Wear Sarees', 'casual-wear-sarees', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('catc9de8683e883ae29b53926cf', 'Designer Sarees', 'designer-sarees', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat961b2cca28c75105376c50b3', 'Wedding Collection', 'wedding-collection', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat86ff274465ce4cfa2911fdbb', 'Festive Collection', 'festive-collection', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `Category` (`id`, `name`, `slug`, `group`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cat6c7a5fdcc7d360ae7e3c3e71', 'Luxury Collection', 'luxury-collection', 'PAN_INDIAN', 1, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

-- Occasions

INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occc83cbb52f79eabd30fb9564d', 'Maharashtrian Wedding', 'maharashtrian-wedding');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occc89c96bae17c4ebb05066c87', 'Bride', 'bride');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occcca89b9dd1527851d61b2411', 'Bride\'s Mother', 'bride-s-mother');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occb50194374390d83a9374ab52', 'Haldi Ceremony', 'haldi-ceremony');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occcaac89b31b1a09d611416c45', 'Mehendi Ceremony', 'mehendi-ceremony');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ5032434bcb1be53890db1251', 'Sangeet', 'sangeet');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ5e2acefd72fc21af9c19abd2', 'Reception', 'reception');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occa98c54f0105cda9fbd2bb33c', 'Engagement', 'engagement');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ63da09304a9b429a9d0c8c23', 'Gudi Padwa', 'gudi-padwa');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ2c26712508a518aa4f703f5b', 'Ganesh Festival', 'ganesh-festival');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ83dd9c0e76e1a490c90ac914', 'Diwali', 'diwali');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ93d1b08162f02dbd9915cbff', 'Navratri', 'navratri');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ48f9fa47fd6b8922d5d9631a', 'Mangalagaur', 'mangalagaur');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ9a559d716a6a8b0a7c5bf3f6', 'Vat Pournima', 'vat-pournima');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ0968917c599d5b8676d37186', 'Traditional Functions', 'traditional-functions');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occae77e0583d11f9c879f86dc7', 'Office Wear', 'office-wear');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ9dbd7173a19df294b9a2002e', 'Daily Wear', 'daily-wear');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ2b2c75746b82b665c2a4fadb', 'Party Wear', 'party-wear');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ9937c782f8af0273d2496928', 'Temple Visit', 'temple-visit');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ8e96ffd23fcb1ace8b47c73e', 'Housewarming', 'housewarming');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occ523bdcefa368cf420f460c26', 'Baby Shower', 'baby-shower');
INSERT INTO `Occasion` (`id`, `name`, `slug`) VALUES ('occc1b97174a595fa471c65565c', 'Naming Ceremony', 'naming-ceremony');

-- SEO Landing Pages

INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lpa10d315f17cf0fa780108f74', 'buy-paithani-sarees-online', 'Buy Paithani Sarees Online', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp5cc36bf4f020b0594ee05ae2', 'pure-silk-paithani', 'Pure Silk Paithani', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp96b4e290c261942c6cd19049', 'yeola-paithani-collection', 'Yeola Paithani Collection', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp0da1b49d0ff73ed0d1f8d1b6', 'maharashtrian-wedding-sarees', 'Maharashtrian Wedding Sarees', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp6632183c501fd982bec2aedd', 'nauvari-sarees-online', 'Nauvari Sarees Online', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp6ef67515d8e3b39345370439', 'ready-to-wear-nauvari', 'Ready-to-Wear Nauvari', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp29bf0397fb36f67ec0b8581c', 'maharashtrian-bridal-collection', 'Maharashtrian Bridal Collection', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp2d4bbc2ed004df00b4d79afb', 'gudi-padwa-sarees', 'Gudi Padwa Sarees', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp1d44b3e3f755d8f0df71ce92', 'diwali-sarees', 'Diwali Sarees', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp757e190e6873dc5f77abe37a', 'ganesh-festival-sarees', 'Ganesh Festival Sarees', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp17af73465dfa95684054824a', 'narayan-peth-sarees', 'Narayan Peth Sarees', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lpf6e53ce134e0fde5801d4f72', 'solapuri-cotton-sarees', 'Solapuri Cotton Sarees', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lpae1eac635cad1b984a83c15c', 'traditional-maharashtrian-sarees', 'Traditional Maharashtrian Sarees', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp1ecbe4e28f0d35be9a4ab06f', 'best-saree-shop-in-maharashtra', 'Best Saree Shop in Maharashtra', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp16bacf18c074bccb7f603276', 'premium-paithani-collection', 'Premium Paithani Collection', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `LandingPage` (`id`, `slug`, `title`, `isActive`, `createdAt`, `updatedAt`) VALUES ('lp3134b7fa2761d876a4e3154f', 'handloom-maharashtra-sarees', 'Handloom Maharashtra Sarees', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `User` (`id`, `name`, `email`, `passwordHash`, `role`, `isEmailVerified`, `isPhoneVerified`, `isActive`, `createdAt`, `updatedAt`)
VALUES (
  'cljadminf045db863ad7dc68',
  'Super Admin',
  'admin@anandisaree.com',
  '$2a$12$CvtU.LiQ29HjkIlROUfloOZhnQ9YtYOm7EwHZWFr0UO7zKL3y/R3W',
  'SUPER_ADMIN',
  1,
  0,
  1,
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
);
