import { Injectable } from '@nestjs/common';
import { Prisma, ContractFile } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ContractsRepository {
  constructor(private readonly prisma: PrismaService) { }

  create(data: Prisma.ContractFileCreateInput) {
    return this.prisma.contractFile.create({ data });
  }

  findFirst(where: Prisma.ContractFileWhereInput) {
    return this.prisma.contractFile.findFirst({ where });
  }

  async list(where: Prisma.ContractFileWhereInput, page: number, limit: number) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.contractFile.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.contractFile.count({ where }),
    ]);

    return { items, total };
  }

  updateMany(where: Prisma.ContractFileWhereInput, data: Prisma.ContractFileUpdateManyMutationInput) {
    return this.prisma.contractFile.updateMany({ where, data });
  }
}