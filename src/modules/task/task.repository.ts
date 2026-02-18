import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TaskRepository {
  constructor(private readonly prisma: PrismaService) { }

  create(data: Prisma.TaskUncheckedCreateInput) {
    return this.prisma.task.create({
      data,
      include: {
        customer: true,
        project: true, // ✅ EKLENDİ
        assignedUser: { select: { id: true, username: true, email: true } }, // opsiyonel ama faydalı
        createdByUser: { select: { id: true, username: true, email: true } }, // opsiyonel
      },
    });
  }

  findById(id: string) {
    return this.prisma.task.findFirst({
      where: { id, deletedAt: null },
      include: {
        customer: true,
        project: true, // ✅ EKLENDİ
        assignedUser: { select: { id: true, username: true, email: true } },
        createdByUser: { select: { id: true, username: true, email: true } },
      },
    });
  }

  async updateSafe(id: string, data: Prisma.TaskUpdateInput) {
    try {
      await this.prisma.task.update({
        where: { id },
        data,
      });
      return this.findById(id);
    } catch (e) {
      return null;
    }
  }

  list(where: Prisma.TaskWhereInput, skip: number, take: number) {
    return this.prisma.task.findMany({
      where: { ...where, deletedAt: null },
      skip,
      take,
      include: {
        customer: true,
        project: true, // ✅ EKLENDİ
        assignedUser: { select: { id: true, username: true, email: true } },
        createdByUser: { select: { id: true, username: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
