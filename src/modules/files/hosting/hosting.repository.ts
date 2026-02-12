import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class HostingRepository {
  constructor(private readonly prisma: PrismaService) { }

  create(data: Prisma.HostingInfoCreateInput) {
    return this.prisma.hostingInfo.create({ data });
  }

  findFirst(where: Prisma.HostingInfoWhereInput) {
    return this.prisma.hostingInfo.findFirst({ where });
  }

  async list(where: Prisma.HostingInfoWhereInput, page: number, limit: number) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.hostingInfo.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.hostingInfo.count({ where }),
    ]);

    return { items, total };
  }

  updateMany(where: Prisma.HostingInfoWhereInput, data: Prisma.HostingInfoUpdateManyMutationInput) {
    return this.prisma.hostingInfo.updateMany({ where, data });
  }
}