import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.TaskUncheckedCreateInput) {
    return this.prisma.task.create({
      data,
      include: {
        customer: true,
      },
    });
  }

  findByIdAndOrg(id: string, organizationId: string) {
    return this.prisma.task.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
      include: {
        customer: true,
        // assignedUser: true
      },
    });
  }

  async updateSafe(
    id: string,
    organizationId: string,
    data: Prisma.TaskUpdateInput,
  ) {
    const result = await this.prisma.task.updateMany({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
      data,
    });

    if (result.count === 0) return null;

    return this.findByIdAndOrg(id, organizationId);
  }

  list(where: Prisma.TaskWhereInput, skip: number, take: number) {
    return this.prisma.task.findMany({
      where: {
        ...where,
        deletedAt: null,
      },
      skip,
      take,
      include: {
        customer: true,
        // assignedUser: true
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
