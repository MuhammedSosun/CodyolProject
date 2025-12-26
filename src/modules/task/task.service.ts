import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { TaskStatus } from '@prisma/client';
@Injectable()
export class TaskService {
    constructor(
        private readonly repo: TaskRepository,
        private readonly prisma: PrismaService,
    ) { }

    async create(dto: CreateTaskDto): Promise<TaskResponseDto> {
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

        const task = await this.repo.create({
            organization: { connect: { id: dto.organizationId } },
            ...(dto.customerId
                ? { customer: { connect: { id: dto.customerId } } }
                : {}),
            title: dto.title,
            description: dto.description,
            status: TaskStatus.OPEN,
            dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        });

        return this.toResponse(task);
    }

    async update(
        id: string,
        organizationId: string,
        dto: UpdateTaskDto,
    ): Promise<TaskResponseDto> {
        const current = await this.repo.findByIdAndOrg(id, organizationId);
        if (!current) throw new NotFoundException('Task not found');

        if (dto.status) {
            this.validateStatusTransition(current.status, dto.status);
        }

        if (dto.customerId !== undefined) {
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
        }

        const data: Record<string, unknown> = {};
        if (dto.title !== undefined) data.title = dto.title;
        if (dto.description !== undefined) data.description = dto.description;
        if (dto.status !== undefined) data.status = dto.status;
        if (dto.dueDate !== undefined)
            data.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;

        if (dto.customerId !== undefined) {
            data.customer = dto.customerId
                ? { connect: { id: dto.customerId } }
                : { disconnect: true };
        }

        const updated = await this.repo.updateSafe(id, organizationId, data);
        if (!updated) throw new NotFoundException('Task not found');

        return this.toResponse(updated);
    }

    async delete(id: string, organizationId: string): Promise<void> {
        const deleted = await this.repo.softDeleteSafe(id, organizationId);
        if (!deleted) throw new NotFoundException('Task not found');
    }

    private validateStatusTransition(
        current: TaskStatus,
        next: TaskStatus,
    ) {
        const allowed: Record<TaskStatus, TaskStatus[]> = {
            OPEN: [TaskStatus.IN_PROGRESS, TaskStatus.DONE],
            IN_PROGRESS: [TaskStatus.DONE],
            DONE: [],
        };

        if (!allowed[current].includes(next)) {
            throw new ConflictException(
                `Invalid status transition: ${current} → ${next}`,
            );
        }
    }

    private toResponse(t: any): TaskResponseDto {
        return {
            id: t.id,
            organizationId: t.organizationId,
            customerId: t.customerId,
            title: t.title,
            description: t.description,
            status: t.status,
            dueDate: t.dueDate,
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
        };
    }
    async list(query: any) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        const allowedSortBy: (
            'createdAt' | 'updatedAt' | 'dueDate' | 'title'
        )[] = ['createdAt', 'updatedAt', 'dueDate', 'title'];

        const sortBy = allowedSortBy.includes(query.sortBy)
            ? query.sortBy
            : 'createdAt';

        const order = query.order === 'asc' ? 'asc' : 'desc';

        const { items, total } = await this.repo.list({
            page,
            limit,
            sortBy,
            order,
            organizationId: query.organizationId,
            customerId: query.customerId,
            status: query.status,
            overdue: query.overdue === 'true',
            today: query.today === 'true',
        });

        return {
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            data: items.map((t) => this.toResponse(t)),
        };
    }

}
