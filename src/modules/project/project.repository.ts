import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) { }

  create(data: Prisma.ProjectUncheckedCreateInput) {
    return this.prisma.project.create({ data });
  }

  list(where: Prisma.ProjectWhereInput, skip: number, take: number) {
    return this.prisma.project.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }
}
