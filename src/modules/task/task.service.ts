import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ActivityType, Prisma } from '@prisma/client';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly repo: TaskRepository,
    private readonly prisma: PrismaService,
    private readonly activityService: ActivityService,
  ) {}

  // ✅ TASK CREATE
  async create(dto: CreateTaskDto, creatorUserId: string) {
    // 1) customer kontrolü
    if (dto.customerId) {
      const customer = await this.prisma.customer.findFirst({
        where: { id: dto.customerId, deletedAt: null },
      });
      if (!customer) throw new NotFoundException('Customer not found');
    }

    // 2) assignee user kontrolü
    const assignee = await this.prisma.user.findFirst({
      where: { id: dto.assignedUserId, deletedAt: null },
      select: { id: true },
    });
    if (!assignee) throw new NotFoundException('Assigned user not found');

    // 3) task oluştur
    const task = await this.repo.create({
      title: dto.title,
      description: dto.description,
      startDate: dto.startDate ? new Date(dto.startDate) : null,
      endDate: dto.endDate ? new Date(dto.endDate) : null,

      // ✅ DEFAULT STATUS
      status: dto.status ?? 'NEW',

      assignedUserId: dto.assignedUserId,
      createdByUserId: creatorUserId,
      customerId: dto.customerId ?? null,
    });

    // 4) activity log
    if (task.customerId) {
      await this.activityService.create(
        {
          customerId: task.customerId,
          taskId: task.id,
          type: ActivityType.TASK_CREATED,
          title: `Görev oluşturuldu: ${task.title}`,
        },
        creatorUserId,
      );
    }

    return this.toResponse(task);
  }

  // ✅ TASK DETAIL
  async findOne(id: string, userId: string) {
    const task = await this.repo.findById(id);

    if (
      !task ||
      (task.assignedUserId !== userId && task.createdByUserId !== userId)
    ) {
      throw new NotFoundException('Task not found');
    }

    return this.toResponse(task);
  }

  // ✅ TASK LIST
  async list(userId: string, query: any) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);

    const where: Prisma.TaskWhereInput = {
      OR: [{ assignedUserId: userId }, { createdByUserId: userId }],
    };

    if (query.customerId) where.customerId = query.customerId;
    if (query.status) where.status = query.status;

    const items = await this.repo.list(where, (page - 1) * limit, limit);

    return {
      meta: { page, limit },
      data: items.map((t) => this.toResponse(t)),
    };
  }

  // ✅ TASK UPDATE
  async update(id: string, userId: string, dto: UpdateTaskDto) {
    const current = await this.repo.findById(id);
    if (
      !current ||
      (current.assignedUserId !== userId && current.createdByUserId !== userId)
    ) {
      throw new NotFoundException('Task not found');
    }

    const data: Prisma.TaskUpdateInput = {};

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.startDate !== undefined)
      data.startDate = dto.startDate ? new Date(dto.startDate) : null;
    if (dto.endDate !== undefined)
      data.endDate = dto.endDate ? new Date(dto.endDate) : null;

    // ✅ STATUS UPDATE (TYPE SAFE)
    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    if (dto.customerId !== undefined) {
      data.customer = dto.customerId
        ? { connect: { id: dto.customerId } }
        : { disconnect: true };
    }

    const updated = await this.repo.updateSafe(id, data);
    if (!updated) throw new NotFoundException('Task not found');

    // 🔥 STATUS DEĞİŞTİYSE ACTIVITY
    if (
      dto.status !== undefined &&
      dto.status !== current.status &&
      updated.customerId
    ) {
      await this.activityService.create(
        {
          customerId: updated.customerId,
          taskId: updated.id,
          type: ActivityType.TASK_STATUS_CHANGED,
          title: `Görev durumu güncellendi: ${updated.title}`,
        },
        userId,
      );
    }

    return this.toResponse(updated);
  }

  // ✅ TASK DELETE (soft)
  async delete(id: string, userId: string) {
    const result = await this.prisma.task.updateMany({
      where: {
        id,
        deletedAt: null,
        OR: [{ assignedUserId: userId }, { createdByUserId: userId }],
      },
      data: { deletedAt: new Date() },
    });

    if (result.count === 0) {
      throw new NotFoundException('Task not found');
    }
  }

  private toResponse(t: any) {
    return {
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      startDate: t.startDate,
      endDate: t.endDate,
      customerId: t.customerId,
      assignedUserId: t.assignedUserId,
      createdByUserId: t.createdByUserId,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      customer: t.customer
        ? {
            id: t.customer.id,
            fullName: t.customer.fullName ?? t.customer.name ?? null,
            email: t.customer.email ?? null,
            phone: t.customer.phone ?? null,
          }
        : null,
    };
  }
}
