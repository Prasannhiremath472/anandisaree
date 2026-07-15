"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCustomers = listCustomers;
exports.getCustomerById = getCustomerById;
exports.setCustomerStatus = setCustomerStatus;
const prisma_1 = require("../config/prisma");
const ApiError_1 = require("../utils/ApiError");
const pagination_1 = require("../utils/pagination");
async function listCustomers(pagination, filters) {
    const where = {
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
        prisma_1.prisma.user.findMany({
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
        prisma_1.prisma.user.count({ where }),
    ]);
    return (0, pagination_1.buildPaginatedResult)(items, total, pagination);
}
async function getCustomerById(id) {
    const customer = await prisma_1.prisma.user.findFirst({
        where: { id, role: "CUSTOMER", deletedAt: null },
        include: {
            addresses: true,
            orders: { orderBy: { createdAt: "desc" }, take: 10 },
            wallet: true,
            _count: { select: { orders: true, reviews: true, wishlist: true } },
        },
    });
    if (!customer)
        throw ApiError_1.ApiError.notFound("Customer not found");
    const { passwordHash, ...safe } = customer;
    return safe;
}
async function setCustomerStatus(id, isActive) {
    const customer = await prisma_1.prisma.user.findFirst({ where: { id, role: "CUSTOMER" } });
    if (!customer)
        throw ApiError_1.ApiError.notFound("Customer not found");
    return prisma_1.prisma.user.update({ where: { id }, data: { isActive } });
}
//# sourceMappingURL=customer.service.js.map