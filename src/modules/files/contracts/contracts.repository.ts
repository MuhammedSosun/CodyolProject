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
        customer: true,
      },
    });
  }

  findFirst(where: Prisma.ContractFileWhereInput) {
    return this.prisma.contractFile.findFirst({
      where,
      include: {
        customer: true,
      },
    });
  }

  async list(where: Prisma.ContractFileWhereInput, page: number, limit: number) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.contractFile.findMany({
        where,
        include: {
          customer: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.contractFile.count({ where }),
    ]);

    return { items, total };
  }

  // ✅ scalar alanlar için (title/status/date/desc/fileUrl vb)
  updateMany(where: Prisma.ContractFileWhereInput, data: Prisma.ContractFileUpdateManyMutationInput) {
    return this.prisma.contractFile.updateMany({ where, data });
  }

  // ✅ relation (customer connect/disconnect) gibi update'ler için
  update(where: Prisma.ContractFileWhereUniqueInput, data: Prisma.ContractFileUpdateInput) {
    return this.prisma.contractFile.update({
      where,
      data,
      include: {
        customer: true,
      },
    });
  }
}
