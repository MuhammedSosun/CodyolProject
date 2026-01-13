import { Injectable, NotFoundException } from '@nestjs/common';
import { ActivityRepository } from './activity.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivityResponseDto } from './dto/activity-response.dto';
import { ActivityListQueryDto } from './dto/activity-list-query.dto';

@Injectable()
export class ActivityService {
  constructor(
    private readonly repo: ActivityRepository,
    private readonly prisma: PrismaService,
  ) {}

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

    const activity = await this.repo.create({
      createdByUser: { connect: { id: userId } },
      ...(dto.customerId
        ? { customer: { connect: { id: dto.customerId } } }
        : {}),
      ...(dto.taskId
        ? { task: { connect: { id: dto.taskId } } }
        : {}),
      type: dto.type,
      title: dto.title,
      description: dto.description,
    });

    return this.toResponse(activity);
  }

  async delete(id: string, userId: string) {
    const deleted = await this.repo.softDeleteSafe(id, userId);
    if (!deleted) throw new NotFoundException('Activity not found');
  }

  async list(userId: string, query: ActivityListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const { items, total } = await this.repo.list({
      createdByUserId: userId,
      customerId: query.customerId,
      taskId: query.taskId,
      type: query.type,
      page,
      limit,
    });

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: items.map((a) => this.toResponse(a)),
    };
  }

  private toResponse(a: any) {
    return {
      id: a.id,
      customerId: a.customerId,
      taskId: a.taskId,
      type: a.type,
      title: a.title,
      description: a.description,
      createdAt: a.createdAt,
    };
  }
}
