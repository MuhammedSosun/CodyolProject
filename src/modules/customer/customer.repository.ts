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

  async list(params: CustomerListParams & { ownerUserId: string }) {
    const { status, search, page, limit, sortBy, order, ownerUserId } = params;

    const where = this.buildWhere({
      status,
      search,
      ownerUserId,
    });

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

  private buildWhere(filters: {
    status?: string;
    search?: string;
    ownerUserId: string;
  }): Prisma.CustomerWhereInput {
    const where: Prisma.CustomerWhereInput = {
      deletedAt: null,
      ownerUserId: filters.ownerUserId,
    };

    if (filters.status) {
      where.status = filters.status as any;
    }

    if (filters.search) {
      where.OR = [
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { companyName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }
}
