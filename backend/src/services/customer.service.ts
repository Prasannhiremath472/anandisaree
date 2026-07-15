import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { buildPaginatedResult, PaginationParams } from "../utils/pagination";

interface ListFilters {
  search?: string;
  isActive?: boolean;
}

export async function listCustomers(pagination: PaginationParams, filters: ListFilters) {
  const where: Prisma.UserWhereInput = {
    role: "CUSTOMER",
    deletedAt: null,
    ...(filters.isActive !== undefined ? { isActive: filters.isActive } : {}),
    ...(filters.search
      ? {
          OR: [
            { name: { contains: filters.search } },
            { email: { contains: filters.search } },
            { phone: { contains: filters.search } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.take,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
        isEmailVerified: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return buildPaginatedResult(items, total, pagination);
}

export async function getCustomerById(id: string) {
  const customer = await prisma.user.findFirst({
    where: { id, role: "CUSTOMER", deletedAt: null },
    include: {
      addresses: true,
      orders: { orderBy: { createdAt: "desc" }, take: 10 },
      wallet: true,
      _count: { select: { orders: true, reviews: true, wishlist: true } },
    },
  });

  if (!customer) throw ApiError.notFound("Customer not found");

  const { passwordHash, ...safe } = customer;
  return safe;
}

export async function setCustomerStatus(id: string, isActive: boolean) {
  const customer = await prisma.user.findFirst({ where: { id, role: "CUSTOMER" } });
  if (!customer) throw ApiError.notFound("Customer not found");

  return prisma.user.update({ where: { id }, data: { isActive } });
}
