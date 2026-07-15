"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORT_ROLES = exports.MARKETING_ROLES = exports.ORDER_ROLES = exports.INVENTORY_ROLES = exports.ADMIN_ROLES = void 0;
/** Any of these roles can access the admin panel. */
exports.ADMIN_ROLES = [
    "SUPER_ADMIN",
    "ADMIN",
    "INVENTORY_MANAGER",
    "ORDER_MANAGER",
    "CUSTOMER_SUPPORT",
    "MARKETING_MANAGER",
    "CONTENT_MANAGER",
];
/** Roles allowed to manage products/inventory. */
exports.INVENTORY_ROLES = ["SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER"];
/** Roles allowed to manage orders. */
exports.ORDER_ROLES = ["SUPER_ADMIN", "ADMIN", "ORDER_MANAGER"];
/** Roles allowed to manage marketing content (coupons, banners, newsletter, blog). */
exports.MARKETING_ROLES = ["SUPER_ADMIN", "ADMIN", "MARKETING_MANAGER", "CONTENT_MANAGER"];
/** Roles allowed to manage customer-facing support items (reviews, tickets). */
exports.SUPPORT_ROLES = ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT"];
//# sourceMappingURL=roles.js.map