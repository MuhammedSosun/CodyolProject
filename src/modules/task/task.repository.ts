import { Injectable } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export type TaskListParams = {
    organizationId?: string;
    customerId?: string;
    status?: string;
    overdue?: boolean;
    today?: boolean;
    page: number;
    limit: number;
    sortBy: 'createdAt' | 'updatedAt' | 'dueDate' | 'title';
    order: 'asc' | 'desc';
};

@Injectable()
export class TaskRepository {
    constructor(private readonly prisma: PrismaService) { }

    create(data: Prisma.TaskCreateArgs['data']) {
        return this.prisma.task.create({ data });
    }

    findByIdAndOrg(id: string, organizationId: string) {
        return this.prisma.task.findFirst({
            where: { id, organizationId, deletedAt: null },
        });
    }

    async updateSafe(
        id: string,
        organizationId: string,
        data: Prisma.TaskUpdateArgs['data'],
    ) {
        const result = await this.prisma.task.updateMany({
            where: { id, organizationId, deletedAt: null },
            data,
        });

        if (result.count === 0) return null;
        return this.findByIdAndOrg(id, organizationId);
    }

    async softDeleteSafe(id: string, organizationId: string) {
        const result = await this.prisma.task.updateMany({
            where: { id, organizationId, deletedAt: null },
            data: { deletedAt: new Date() },
        });

        return result.count > 0;
    }

    async list(params: TaskListParams): Promise<{ items: Task[]; total: number }> {
        const {
            organizationId,
            customerId,
            status,
            overdue,
            today,
            page,
            limit,
            sortBy,
            order,
        } = params;

        const where: Prisma.TaskWhereInput = { deletedAt: null };

        if (organizationId) where.organizationId = organizationId;
        if (customerId) where.customerId = customerId;
        if (status) where.status = status as any;

        const now = new Date();

        if (overdue) {
            where.dueDate = { lt: now };
            where.status = { not: 'DONE' } as any;
        }

        if (today) {
            const start = new Date();
            start.setHours(0, 0, 0, 0);

            const end = new Date();
            end.setHours(23, 59, 59, 999);

            where.dueDate = { gte: start, lte: end };
        }

        const [items, total] = await this.prisma.$transaction([
            this.prisma.task.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { [sortBy]: order },
            }),
            this.prisma.task.count({ where }),
        ]);

        return { items, total };
    }
}
