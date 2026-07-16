/**
 * Local copies of types normally sourced from @anandi/shared. Duplicated here
 * (rather than depending on the workspace package) because Hostinger deploys
 * this backend folder in isolation with no monorepo/workspace context, so a
 * "*"-versioned local package dependency can't resolve during npm install.
 */

export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "INVENTORY_MANAGER"
  | "ORDER_MANAGER"
  | "CUSTOMER_SUPPORT"
  | "MARKETING_MANAGER"
  | "CONTENT_MANAGER"
  | "CUSTOMER";

export interface JwtPayload {
  userId: string;
  role: UserRole;
  email: string;
}
