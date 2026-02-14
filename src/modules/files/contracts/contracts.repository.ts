import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ContractsRepository {
  constructor(private readonly prisma: PrismaService) { }

  create(data: Prisma.ContractFileCreateInput) {
    return this.prisma.contractFile.create({
      data,
      include: {
        customer: true, // relation yoksa kaldır
      },
    });
  }

  findFirst(where: Prisma.ContractFileWhereInput) {
    return this.prisma.contractFile.findFirst({
      where,
      include: {
        customer: true, // relation yoksa kaldır
      },
    });
  }

  async list(where: Prisma.ContractFileWhereInput, page: number, limit: number) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.contractFile.findMany({
        where,
        include: { customer: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.contractFile.count({ where }),
    ]);

    return { items, total };
  }

  async updateOne(where: Prisma.ContractFileWhereInput, data: Prisma.ContractFileUpdateInput) {
    const existing = await this.prisma.contractFile.findFirst({ where });
    if (!existing) return null;

    return this.prisma.contractFile.update({
      where: { id: existing.id },
      data,
      include: { customer: true },
    });
  }
}
