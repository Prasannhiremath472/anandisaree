-- Grants ADMIN role to Prasannhiremath333@gmail.com.
-- Since login is email-OTP only (no password), this account signs in by
-- requesting a code at /login and does not need a passwordHash.
--
-- Safe to re-run: if the account already exists, it promotes the role
-- instead of inserting a duplicate.

INSERT INTO `User` (id, name, email, role, isEmailVerified, isActive, createdAt, updatedAt)
SELECT UUID(), 'Anandi Sarees Admin', 'prasannhiremath333@gmail.com', 'ADMIN', 1, 1, NOW(3), NOW(3)
WHERE NOT EXISTS (
  SELECT 1 FROM `User` WHERE LOWER(email) = 'prasannhiremath333@gmail.com'
);

UPDATE `User`
SET role = 'ADMIN', isActive = 1
WHERE LOWER(email) = 'prasannhiremath333@gmail.com';

INSERT INTO `Wallet` (id, userId, updatedAt)
SELECT UUID(), u.id, NOW(3)
FROM `User` u
WHERE LOWER(u.email) = 'prasannhiremath333@gmail.com'
  AND NOT EXISTS (SELECT 1 FROM `Wallet` w WHERE w.userId = u.id);
