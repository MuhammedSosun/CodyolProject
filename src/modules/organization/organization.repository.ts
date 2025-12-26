import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrganizationRepository {
    constructor(private readonly prisma: PrismaService) { }

    create(data: Prisma.OrganizationCreateInput) {
        return this.prisma.organization.create({ data });
    }

    findById(id: string) {
        return this.prisma.organization.findFirst({
            where: { id, deletedAt: null },
        });
    }

    findBySlug(slug: string) {
        return this.prisma.organization.findFirst({
            where: { slug, deletedAt: null },
        });
    }

    findAll() {
        return this.prisma.organization.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });
    }

    update(id: string, data: Prisma.OrganizationUpdateArgs['data']) {
        return this.prisma.organization.update({ where: { id }, data });
    }


    softDelete(id: string) {
        return this.prisma.organization.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                isActive: false,
            },
        });
    }
    async updateSafe(
        id: string,
        data: Prisma.OrganizationUpdateArgs['data'],
    ) {
        const result = await this.prisma.organization.updateMany({
            where: {
                id,
                deletedAt: null,
            },
            data,
        });

        if (result.count === 0) {
            return null;
        }

        return this.findById(id);
    }
    async setActive(id: string, isActive: boolean) {
        const result = await this.prisma.organization.updateMany({
            where: {
                id,
                deletedAt: null,
            },
            data: { isActive },
        });

        if (result.count === 0) {
            return null;
        }

        return this.findById(id);
    }
    findBySlugPublic(slug: string) {
        return this.prisma.organization.findFirst({
            where: { slug, deletedAt: null },
        });
    }

}
