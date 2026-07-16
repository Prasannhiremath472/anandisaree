import { query, queryOne, execute, QueryParams } from "../config/db";
import { ApiError } from "../utils/ApiError";
import { buildPaginatedResult, PaginationParams } from "../utils/pagination";

interface ListFilters {
  search?: string;
  isActive?: boolean;
}

export async function listCustomers(pagination: PaginationParams, filters: ListFilters) {
  const conditions: string[] = ["role = 'CUSTOMER'", "deletedAt IS NULL"];
  const params: QueryParams = [];

  if (filters.isActive !== undefined) {
    conditions.push("isActive = ?");
    params.push(filters.isActive);
  }
  if (filters.search) {
    conditions.push("(name LIKE ? OR email LIKE ? OR phone LIKE ?)");
    const like = `%${filters.search}%`;
    params.push(like, like, like);
  }

  const whereClause = conditions.join(" AND ");

  const rows = await query<Record<string, unknown>>(
    `SELECT id, name, email, phone, isActive, isEmailVerified, createdAt FROM \`User\`
     WHERE ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
    [...params, pagination.take, pagination.skip]
  );
  const totalRow = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM \`User\` WHERE ${whereClause}`,
    params
  );

  const userIds = rows.map((r) => r.id as string);
  const orderCounts = userIds.length
    ? await query<{ userId: string; count: number }>(
        `SELECT userId, COUNT(*) as count FROM \`Order\` WHERE userId IN (${userIds.map(() => "?").join(",")}) GROUP BY userId`,
        userIds
      )
    : [];

  const items = rows.map((row) => ({
    ...row,
    _count: { orders: orderCounts.find((o) => o.userId === row.id)?.count ?? 0 },
  }));

  return buildPaginatedResult(items, totalRow?.count ?? 0, pagination);
}

export async function getCustomerById(id: string) {
  const customer = await queryOne<Record<string, unknown>>(
    "SELECT * FROM `User` WHERE id = ? AND role = 'CUSTOMER' AND deletedAt IS NULL LIMIT 1",
    [id]
  );

  if (!customer) throw ApiError.notFound("Customer not found");

  const addresses = await query("SELECT * FROM `Address` WHERE userId = ?", [id]);
  const orders = await query(
    "SELECT * FROM `Order` WHERE userId = ? ORDER BY createdAt DESC LIMIT 10",
    [id]
  );
  const wallet = await queryOne("SELECT * FROM `Wallet` WHERE userId = ? LIMIT 1", [id]);

  const orderCountRow = await queryOne<{ count: number }>(
    "SELECT COUNT(*) as count FROM `Order` WHERE userId = ?",
    [id]
  );
  const reviewCountRow = await queryOne<{ count: number }>(
    "SELECT COUNT(*) as count FROM `Review` WHERE userId = ?",
    [id]
  );
  const wishlistCountRow = await queryOne<{ count: number }>(
    "SELECT COUNT(*) as count FROM `WishlistItem` WHERE userId = ?",
    [id]
  );

  const { passwordHash, ...safe } = customer;

  return {
    ...safe,
    addresses,
    orders,
    wallet,
    _count: {
      orders: orderCountRow?.count ?? 0,
      reviews: reviewCountRow?.count ?? 0,
      wishlist: wishlistCountRow?.count ?? 0,
    },
  };
}

export async function setCustomerStatus(id: string, isActive: boolean) {
  const customer = await queryOne("SELECT id FROM `User` WHERE id = ? AND role = 'CUSTOMER' LIMIT 1", [id]);
  if (!customer) throw ApiError.notFound("Customer not found");

  await execute("UPDATE `User` SET isActive = ?, updatedAt = NOW(3) WHERE id = ?", [isActive, id]);
  return queryOne("SELECT * FROM `User` WHERE id = ? LIMIT 1", [id]);
}
