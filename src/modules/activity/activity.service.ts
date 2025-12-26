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
    ) { }

    async create(dto: CreateActivityDto): Promise<ActivityResponseDto> {
        const org = await this.prisma.organization.findFirst({
            where: {
                id: dto.organizationId,
                deletedAt: null,
                isActive: true,
            },
        });
        if (!org) throw new NotFoundException('Organization not found');

        if (dto.customerId) {
            const customer = await this.prisma.customer.findFirst({
                where: {
                    id: dto.customerId,
                    organizationId: dto.organizationId,
                    deletedAt: null,
                },
            });
            if (!customer) throw new NotFoundException('Customer not found');
        }

        if (dto.taskId) {
            const task = await this.prisma.task.findFirst({
                where: {
                    id: dto.taskId,
                    organizationId: dto.organizationId,
                    deletedAt: null,
                },
            });
            if (!task) throw new NotFoundException('Task not found');
        }

        const activity = await this.repo.create({
            organization: { connect: { id: dto.organizationId } },
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

    async delete(id: string, organizationId: string): Promise<void> {
        const deleted = await this.repo.softDeleteSafe(id, organizationId);
        if (!deleted) throw new NotFoundException('Activity not found');
    }

    async list(query: ActivityListQueryDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;

        const { items, total } = await this.repo.list({
            page,
            limit,
            organizationId: query.organizationId,
            customerId: query.customerId,
            taskId: query.taskId,
            type: query.type,
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

    private toResponse(a: any): ActivityResponseDto {
        return {
            id: a.id,
            organizationId: a.organizationId,
            customerId: a.customerId,
            taskId: a.taskId,
            type: a.type,
            title: a.title,
            description: a.description,
            createdAt: a.createdAt,
        };
    }
}
