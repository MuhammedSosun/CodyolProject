import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SourceLinksRepository {
  constructor(private readonly prisma: PrismaService) { }

  create(data: Prisma.SourceCodeLinkCreateInput) {
    return this.prisma.sourceCodeLink.create({ data });
  }

  findFirst(where: Prisma.SourceCodeLinkWhereInput) {
    return this.prisma.sourceCodeLink.findFirst({ where });
  }

  async list(where: Prisma.SourceCodeLinkWhereInput, page: number, limit: number) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.sourceCodeLink.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.sourceCodeLink.count({ where }),
    ]);
    return { items, total };
  }

  updateMany(where: Prisma.SourceCodeLinkWhereInput, data: Prisma.SourceCodeLinkUpdateManyMutationInput) {
    return this.prisma.sourceCodeLink.updateMany({ where, data });
  }
}