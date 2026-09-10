-- Fills the genuinely empty tables on production: Banner, Testimonial, BlogPost.
-- Categories, Occasions, LandingPages, Users, and Products already exist on
-- production (69 products, 6 users) and are left untouched.
-- Uses correct PascalCase table names matching Prisma/hostinger_full_setup.sql.
-- Safe to re-run: INSERT IGNORE + unique-ish generated ids.

INSERT IGNORE INTO `Banner` (`id`, `title`, `imageUrl`, `linkUrl`, `placement`, `sortOrder`, `isActive`, `startsAt`, `endsAt`, `createdAt`) VALUES
('ban_gudipadwa_slider01', 'Gudi Padwa Special Collection', 'https://images.unsplash.com/photo-1734527225029-a202aec0ad98?auto=format&fit=crop&w=1800&q=80', '/collection/gudi-padwa', 'HOMEPAGE_SLIDER', 1, 1, NULL, NULL, CURRENT_TIMESTAMP(3)),
('ban_festive25off_ban02', 'Festive Collection – Up to 25% Off', 'https://images.unsplash.com/photo-1745482036066-5d215ed6b910?auto=format&fit=crop&w=1800&q=80', '/collection/festive', 'FESTIVAL_BANNER', 2, 1, NULL, NULL, CURRENT_TIMESTAMP(3)),
('ban_bridalpaithani003', 'Bridal Paithani Edit', 'https://images.unsplash.com/photo-1769500804057-ca1391bf4617?auto=format&fit=crop&w=1800&q=80', '/category/paithani', 'COLLECTION_BANNER', 3, 1, NULL, NULL, CURRENT_TIMESTAMP(3));

INSERT IGNORE INTO `Testimonial` (`id`, `name`, `location`, `message`, `rating`, `imageUrl`, `isFeatured`, `createdAt`) VALUES
('tst_anjalideshmukh001', 'Anjali Deshmukh', 'Pune, Maharashtra', 'The Yeola Paithani I ordered for my daughter''s wedding was beyond beautiful.', 5, NULL, 1, CURRENT_TIMESTAMP(3)),
('tst_snehalpatil000002', 'Snehal Patil', 'Nashik, Maharashtra', 'Bought a Nauvari for Gudi Padwa and the fit and drape were perfect.', 5, NULL, 1, CURRENT_TIMESTAMP(3)),
('tst_radhikakulkarni03', 'Radhika Kulkarni', 'Mumbai, Maharashtra', 'Authentic Solapuri cotton sarees, exactly as pictured.', 5, NULL, 0, CURRENT_TIMESTAMP(3));

INSERT IGNORE INTO `BlogPost` (`id`, `title`, `slug`, `excerpt`, `contentHtml`, `coverImageUrl`, `categoryName`, `tags`, `metaTitle`, `metaDescription`, `isPublished`, `publishedAt`, `createdAt`, `updatedAt`) VALUES
('blg_artofpaithaniyl01', 'The Art of Paithani: A Weaver''s Journey from Yeola', 'art-of-paithani-yeola-weavers', 'Discover how Yeola''s master weavers create every Paithani saree by hand, thread by thread.', '<p>Every Paithani saree begins its journey on a traditional handloom in Yeola, Maharashtra...</p>', 'https://images.unsplash.com/photo-1594761253360-2a487accc7bc?auto=format&fit=crop&w=1200&q=80', 'Craftsmanship', 'paithani,handloom,yeola', NULL, NULL, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
