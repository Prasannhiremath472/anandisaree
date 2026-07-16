import type { UserRole } from "../types/shared";

/** Any of these roles can access the admin panel. */
export const ADMIN_ROLES: UserRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "INVENTORY_MANAGER",
  "ORDER_MANAGER",
  "CUSTOMER_SUPPORT",
  "MARKETING_MANAGER",
  "CONTENT_MANAGER",
];

/** Roles allowed to manage products/inventory. */
export const INVENTORY_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER"];

/** Roles allowed to manage orders. */
export const ORDER_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "ORDER_MANAGER"];

/** Roles allowed to manage marketing content (coupons, banners, newsletter, blog). */
export const MARKETING_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "MARKETING_MANAGER", "CONTENT_MANAGER"];

/** Roles allowed to manage customer-facing support items (reviews, tickets). */
export const SUPPORT_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"];
