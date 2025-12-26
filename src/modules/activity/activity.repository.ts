import { Injectable } from '@nestjs/common';
import { Prisma, Activity } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export type ActivityListParams = {
    organizationId?: string;
    customerId?: string;
    taskId?: string;
    type?: string;
    page: number;
    limit: number;
};

@Injectable()
export class ActivityRepository {
    constructor(private readonly prisma: PrismaService) { }

    create(data: Prisma.ActivityCreateArgs['data']) {
        return this.prisma.activity.create({ data });
    }

    async softDeleteSafe(id: string, organizationId: string) {
        const result = await this.prisma.activity.updateMany({
            where: { id, organizationId, deletedAt: null },
            data: { deletedAt: new Date() },
        });

        return result.count > 0;
    }

    async list(params: ActivityListParams): Promise<{ items: Activity[]; total: number }> {
        const { organizationId, customerId, taskId, type, page, limit } = params;

        const where: Prisma.ActivityWhereInput = {
            deletedAt: null,
        };

        if (organizationId) where.organizationId = organizationId;
        if (customerId) where.customerId = customerId;
        if (taskId) where.taskId = taskId;
        if (type) where.type = type as any;

        const [items, total] = await this.prisma.$transaction([
            this.prisma.activity.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.activity.count({ where }),
        ]);

        return { items, total };
    }
}
