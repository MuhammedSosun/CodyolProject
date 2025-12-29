import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus as PrismaTaskStatus } from '@prisma/client';

@Injectable()
export class TaskService {

  constructor(
    private readonly repo: TaskRepository,
    private readonly prisma: PrismaService,
  ) { }

  async create(
    dto: CreateTaskDto,
    organizationId: string,
    assignedUserId: string,
  ) {
    if (dto.customerId) {
      const customer = await this.prisma.customer.findFirst({
        where: {
          id: dto.customerId,
          organizationId,
          deletedAt: null,
        },
      });
      if (!customer) throw new NotFoundException('Customer not found');
    }

    const task = await this.repo.create({
      title: dto.title,
      description: dto.description,
      startDate: dto.startDate ? new Date(dto.startDate) : null,
      endDate: dto.endDate ? new Date(dto.endDate) : null,
      status: (dto.status ?? 'NEW') as PrismaTaskStatus,

      organizationId,
      assignedUserId,
      customerId: dto.customerId ?? null,
    });

    return this.toResponse(task);
  }

  async findOne(id: string, organizationId: string) {
    const task = await this.repo.findByIdAndOrg(id, organizationId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.toResponse(task);
  }



  async list(
    organizationId: string,
    query: any,
  ) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);

    const where: any = {
      organizationId,
    };

    if (query.customerId) where.customerId = query.customerId;
    if (query.assignedUserId) where.assignedUserId = query.assignedUserId;
    if (query.status) where.status = query.status;

    const items = await this.repo.list(
      where,
      (page - 1) * limit,
      limit,
    );

    return {
      meta: { page, limit },
      data: items.map((t) => this.toResponse(t)),
    };
  }


  async update(
    id: string,
    organizationId: string,
    dto: UpdateTaskDto,
  ) {
    const current = await this.repo.findByIdAndOrg(id, organizationId);
    if (!current) throw new NotFoundException('Task not found');

    const data: any = {};

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.startDate !== undefined)
      data.startDate = dto.startDate
        ? new Date(dto.startDate)
        : null;
    if (dto.endDate !== undefined)
      data.endDate = dto.endDate ? new Date(dto.endDate) : null;

    if (dto.status !== undefined) {
      data.status = dto.status as PrismaTaskStatus;
    }

    if (dto.assignedUserId !== undefined) {
      data.assignedUser = {
        connect: { id: dto.assignedUserId },
      };
    }

    if (dto.customerId !== undefined) {
      data.customer = dto.customerId
        ? { connect: { id: dto.customerId } }
        : { disconnect: true };
    }

    const updated = await this.repo.updateSafe(
      id,
      organizationId,
      data,
    );

    if (!updated) throw new NotFoundException('Task not found');

    return this.toResponse(updated);
  }

  async delete(id: string, organizationId: string) {
    const result = await this.prisma.task.updateMany({
      where: { id, organizationId, deletedAt: null },
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
      organizationId: t.organizationId,
      customerId: t.customerId,
      assignedUserId: t.assignedUserId,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    };
  }
}
