import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class LicensesRepository {
  constructor(private readonly prisma: PrismaService) { }

  create(data: Prisma.LicenseCreateInput) {
    return this.prisma.license.create({ data });
  }

  findFirst(where: Prisma.LicenseWhereInput) {
    return this.prisma.license.findFirst({ where });
  }

  async list(where: Prisma.LicenseWhereInput, page: number, limit: number) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.license.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.license.count({ where }),
    ]);

    return { items, total };
  }

  updateMany(where: Prisma.LicenseWhereInput, data: Prisma.LicenseUpdateManyMutationInput) {
    return this.prisma.license.updateMany({ where, data });
  }
}