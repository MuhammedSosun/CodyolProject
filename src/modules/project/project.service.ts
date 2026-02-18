import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ProjectStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ListProjectDto, ProjectStatusQuery } from './dto/list-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
    constructor(private readonly prisma: PrismaService) { }

    private normalizeStatus(input?: ProjectStatusQuery): ProjectStatus | null {
        if (!input || input === 'all') return null;

        const map: Record<string, ProjectStatus> = {
            teklif: 'TEKLIF',
            gelistirme: 'GELISTIRME',
            test: 'TEST',
            TEKLIF: 'TEKLIF',
            GELISTIRME: 'GELISTIRME',
            TEST: 'TEST',
        };

        const res = map[String(input).trim()];
        if (!res) throw new BadRequestException(`Geçersiz status: ${input}`);
        return res;
    }

    async list(dto: ListProjectDto) {
        const status = this.normalizeStatus(dto.status);

        const where: Prisma.ProjectWhereInput = {
            deletedAt: null,
            ...(dto.customerId ? { customerId: dto.customerId } : {}),
        };

        if (status) where.status = status;

        if (dto.q?.trim()) {
            const q = dto.q.trim();
            where.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { customer: { fullName: { contains: q, mode: 'insensitive' } } },
                { customer: { companyName: { contains: q, mode: 'insensitive' } } },
            ];
        }

        const items = await this.prisma.project.findMany({
            where,
            orderBy: [{ updatedAt: 'desc' }],
            include: {
                customer: { select: { id: true, fullName: true, companyName: true } },
            },
        });

        const count = await this.prisma.project.count({ where });

        return { count, items };
    }

    async create(dto: CreateProjectDto) {
        return this.prisma.project.create({
            data: {
                name: dto.name,
                customerId: dto.customerId ?? null,
                type: (dto.type ?? 'DIGER') as any,
                status: (dto.status ?? 'TEKLIF') as any,
                price: dto.price as any,
                currency: dto.currency ?? 'TRY',
                deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : null,
            },
            include: {
                customer: { select: { id: true, fullName: true, companyName: true } },
            },
        });
    }

    async update(id: string, dto: UpdateProjectDto) {
        const exists = await this.prisma.project.findUnique({ where: { id } });
        if (!exists || exists.deletedAt) throw new NotFoundException('Proje bulunamadı');

        return this.prisma.project.update({
            where: { id },
            data: {
                name: dto.name ?? undefined,
                customerId: dto.customerId === undefined ? undefined : dto.customerId,
                type: dto.type as any,
                status: dto.status as any,
                price: dto.price as any,
                currency: dto.currency ?? undefined,
                deliveryDate:
                    dto.deliveryDate === undefined ? undefined : dto.deliveryDate ? new Date(dto.deliveryDate) : null,
            },
            include: {
                customer: { select: { id: true, fullName: true, companyName: true } },
            },
        });
    }

    async remove(id: string) {
        const exists = await this.prisma.project.findUnique({ where: { id } });
        if (!exists || exists.deletedAt) throw new NotFoundException('Proje bulunamadı');

        // soft delete
        await this.prisma.project.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        return { ok: true };
    }

    async getById(id: string) {
        const item = await this.prisma.project.findUnique({
            where: { id },
            include: {
                customer: { select: { id: true, fullName: true, companyName: true } },
            },
        });

        if (!item || item.deletedAt) throw new NotFoundException('Proje bulunamadı');
        return item;
    }

}
