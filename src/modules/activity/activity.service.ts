import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ActivityListQueryDto } from './dto/activity-list-query.dto';

@Injectable()
export class ActivityService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  // 🔹 CREATE
  async create(dto: CreateActivityDto, userId: string) {
    if (dto.customerId) {
      const customer = await this.prisma.customer.findFirst({
        where: { id: dto.customerId, deletedAt: null },
      });
      if (!customer) throw new NotFoundException('Customer not found');
    }

    if (dto.taskId) {
      const task = await this.prisma.task.findFirst({
        where: { id: dto.taskId, deletedAt: null },
      });
      if (!task) throw new NotFoundException('Task not found');
    }

    const activity = await this.prisma.activity.create({
      data: {
        userId: userId,
        createdByUserId: userId,
        customerId: dto.customerId ?? null,
        taskId: dto.taskId ?? null,
        type: dto.type,
        title: dto.title,
        description: dto.description,
      },
    });

    return this.toResponse(activity);
  }

  // 🔹 LIST (TIMELINE)
  async list(userId: string, query: ActivityListQueryDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 20);

    const where: any = { deletedAt: null };

    const me = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: { role: true },
    });

    if (me?.role !== 'ADMIN') {
      where.OR = [
        { createdByUserId: userId }, // kendi yazdıkları
        { userId: userId },          // actor olarak kendi
        { task: { assignedUserId: userId } }, // kendisine atanan taskların logları
      ];
    }

    if (query.customerId) where.customerId = query.customerId;
    if (query.taskId) where.taskId = query.taskId;
    if (query.type) where.type = query.type;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.activity.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          createdByUser: {
            select: {
              id: true,
              username: true,
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.activity.count({ where }),
    ]);

    const safeTotal = total ?? 0;

    return {
      meta: {
        page,
        limit,
        total: safeTotal,
        totalPages: Math.ceil(safeTotal / limit),
      },
      data: items.map((a) => this.toResponse(a)),
    };
  }

  // 🔹 GET BY ID (DETAIL)
  async getById(id: string, userId: string) {
    const activity: any = await this.prisma.activity.findFirst({
      where: {
        id,
        deletedAt: null,
        createdByUserId: userId,
      },
      include: {
        customer: {
          select: { id: true, fullName: true, email: true },
        },
        task: {
          select: { id: true, title: true, status: true, customerId: true },
        },
        createdByUser: {
          select: {
            id: true,
            username: true,
            email: true,
            profile: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    const createdByFullName =
      activity.createdByUser?.profile?.firstName || activity.createdByUser?.profile?.lastName
        ? `${activity.createdByUser?.profile?.firstName ?? ''} ${activity.createdByUser?.profile?.lastName ?? ''}`.trim()
        : null;

    return {
      id: activity.id,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      createdAt: activity.createdAt,

      customer: activity.customer, // {id, fullName, email}
      task: activity.task,         // {id, title, status, customerId}
      createdByUser: activity.createdByUser
        ? {
          id: activity.createdByUser.id,
          username: activity.createdByUser.username,
          email: activity.createdByUser.email,
          fullName: createdByFullName, // profile'dan türetilmiş
        }
        : null,
    };
  }


  // 🔹 UPDATE
  async update(id: string, userId: string, dto: UpdateActivityDto) {
    const updated = await this.prisma.activity.updateMany({
      where: {
        id,
        createdByUserId: userId,
        deletedAt: null,
      },
      data: dto,
    });

    if (updated.count === 0) {
      throw new NotFoundException('Activity not found');
    }

    return { success: true };
  }

  // 🔹 DELETE (SOFT)
  async delete(id: string, userId: string) {
    const deleted = await this.prisma.activity.updateMany({
      where: {
        id,
        createdByUserId: userId,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });

    if (deleted.count === 0) {
      throw new NotFoundException('Activity not found');
    }
  }

  private toResponse(a: any) {
    const fullName =
      a?.createdByUser?.profile?.firstName || a?.createdByUser?.profile?.lastName
        ? `${a.createdByUser?.profile?.firstName ?? ''} ${a.createdByUser?.profile?.lastName ?? ''}`.trim()
        : null;

    return {
      id: a.id,
      customerId: a.customerId,
      taskId: a.taskId,
      type: a.type,
      title: a.title,
      description: a.description,
      createdAt: a.createdAt,

      // ✅ UI için: kullanıcı bilgisi (bozmaz, sadece ek alan)
      createdByUser: a.createdByUser
        ? {
          id: a.createdByUser.id,
          username: a.createdByUser.username,
          email: a.createdByUser.email,
          fullName: fullName || a.createdByUser.username,
          avatarUrl: a.createdByUser.profile?.avatarUrl ?? null,
        }
        : null,
    };
  }

}
