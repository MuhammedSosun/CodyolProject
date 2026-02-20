import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ActivityType, Prisma } from '@prisma/client';
import { ActivityService } from '../activity/activity.service';
import { TaskStatus } from './enums/task-status.enum';

@Injectable()
export class TaskService {
  constructor(
    private readonly repo: TaskRepository,
    private readonly prisma: PrismaService,
    private readonly activityService: ActivityService,
  ) { }

  // ✅ TASK CREATE
  async create(dto: CreateTaskDto, creatorUserId: string) {
    // 1) customer kontrolü
    if (dto.customerId) {
      const customer = await this.prisma.customer.findFirst({
        where: { id: dto.customerId, deletedAt: null },
      });
      if (!customer) throw new NotFoundException('Customer not found');
    }

    // ✅ project kontrolü (dto.projectId)
    if (dto.projectId) {
      const project = await this.prisma.project.findFirst({
        where: { id: dto.projectId, deletedAt: null },
        select: { id: true },
      });
      if (!project) throw new NotFoundException('Project not found');
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

      // ✅ projectId (dto.projectId)
      projectId: dto.projectId ?? null,
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

    // ✅ proje bazlı filtre
    if (query.projectId) where.projectId = query.projectId;

    // ✅ çalışan bazlı filtre
    if (query.assignedUserId) where.assignedUserId = query.assignedUserId;

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

    // ✅ project update (dto.projectId)
    if (dto.projectId !== undefined) {
      data.project = dto.projectId
        ? { connect: { id: dto.projectId } }
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

      // ✅ project bilgileri
      projectId: t.projectId ?? null,
      project: t.project
        ? {
          id: t.project.id,
          name: t.project.name,
        }
        : null,

      assignedUserId: t.assignedUserId,
      createdByUserId: t.createdByUserId,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      customer: t.customer
        ? {
          id: t.customer.id,
          fullName: t.customer.fullName ?? (t.customer as any).name ?? null,
          email: t.customer.email ?? null,
          phone: t.customer.phone ?? null,
        }
        : null,
    };
  }
  async getTeamProgress(creatorUserId: string, query: any) {
    const limit = Number(query.limit ?? 4);

    // 1) Toplam task sayısı (assignee bazlı)
    const totals = await this.prisma.task.groupBy({
      by: ['assignedUserId'],
      where: {
        deletedAt: null,
        createdByUserId: creatorUserId, // admin’in atadığı task’lar
        assignedUserId: { not: undefined },
      },
      _count: { _all: true },
    });

    // 2) Tamamlanan task sayısı
    const completed = await this.prisma.task.groupBy({
      by: ['assignedUserId'],
      where: {
        deletedAt: null,
        createdByUserId: creatorUserId,
        assignedUserId: { not: undefined },
        status: TaskStatus.COMPLETED,
      },
      _count: { _all: true },
    });

    // 3) Map (userId -> count)
    const totalMap = new Map<string, number>();
    totals.forEach((x: any) => totalMap.set(x.assignedUserId, x._count._all));

    const doneMap = new Map<string, number>();
    completed.forEach((x: any) => doneMap.set(x.assignedUserId, x._count._all));

    // 4) En çok task’ı olanlardan seç (limit kadar)
    const rows = [...totalMap.entries()]
      .map(([userId, total]) => ({
        userId,
        total,
        done: doneMap.get(userId) ?? 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);

    const userIds = rows.map((r) => r.userId);

    // 5) Kullanıcı + profile bilgileri
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds }, deletedAt: null },
      select: {
        id: true,
        username: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            position: true,
            department: true,
            avatarUrl: true,
          },
        },
      },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));
    const colors = ['#E92B63', '#3B82F6', '#F59E0B', '#10B981'];

    return {
      items: rows.map((r, idx) => {
        const u: any = userMap.get(r.userId);

        const fullName = [u?.profile?.firstName, u?.profile?.lastName]
          .filter(Boolean)
          .join(' ')
          .trim();

        const name = fullName || u?.username || '—';
        const position = u?.profile?.position || u?.profile?.department || '—';
        const thumbnail = u?.profile?.avatarUrl || null;

        const progress = r.total === 0 ? 0 : Math.round((r.done / r.total) * 100);

        return {
          id: r.userId,
          name,
          position,
          progress,
          done: r.done,
          total: r.total,
          color: colors[idx % colors.length],
          thumbnail,
        };
      }),
    };
  }

}
