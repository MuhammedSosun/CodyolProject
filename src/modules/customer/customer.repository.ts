import { Injectable } from '@nestjs/common';
import { Prisma, Customer } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export type CustomerListParams = {
  status?: string;
  search?: string;
  page: number;
  limit: number;
  sortBy: 'createdAt' | 'updatedAt' | 'fullName';
  order: 'asc' | 'desc';
};

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.CustomerCreateInput) {
    return this.prisma.customer.create({ data });
  }

  findById(id: string) {
    return this.prisma.customer.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async updateSafe(id: string, data: Prisma.CustomerUpdateInput) {
    const result = await this.prisma.customer.updateMany({
      where: { id, deletedAt: null },
      data,
    });

    if (result.count === 0) return null;
    return this.findById(id);
  }

  async softDeleteSafe(id: string) {
    const result = await this.prisma.customer.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    return result.count > 0;
  }

  async existsByEmail(email: string, excludeId?: string) {
    const found = await this.prisma.customer.findFirst({
      where: {
        email,
        deletedAt: null,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });

    return !!found;
  }

  async list(params: CustomerListParams) {
    const { status, search, page, limit, sortBy, order } = params;

    const where: Prisma.CustomerWhereInput = { deletedAt: null };

    if (status) where.status = status as any;

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return { items, total };
  }
}
