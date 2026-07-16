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
