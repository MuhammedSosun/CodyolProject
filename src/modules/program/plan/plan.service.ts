import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ProgramStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { ListPlanDto, PlanStatusQuery } from './dto/list-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlanService {
    constructor(private readonly prisma: PrismaService) { }

    private normalizeStatus(input?: PlanStatusQuery): ProgramStatus | null {
        if (!input) return null;

        const s = String(input).trim();

        // all / Tümü
        if (['all', 'tumu', 'Tümü', 'TUMU'].includes(s)) return null;

        const map: Record<string, ProgramStatus> = {
            'Sıradaki işler': 'NEXT',
            'siradaki-isler': 'NEXT',
            NEXT: 'NEXT',

            'Yapılıyor': 'IN_PROGRESS',
            'yapiliyor': 'IN_PROGRESS',
            IN_PROGRESS: 'IN_PROGRESS',

            'Beklemede': 'WAITING',
            'beklemede': 'WAITING',
            WAITING: 'WAITING',

            'Tamamlanan': 'DONE',
            'tamamlanan': 'DONE',
            DONE: 'DONE',
        };

        const result = map[s];
        if (!result) throw new BadRequestException(`Geçersiz status filtresi: ${s}`);
        return result;
    }

    private getDateRange(time?: string): { start: Date; end: Date } | null {
        if (!time || time === 'all') return null;

        const now = new Date();
        const start = new Date(now);
        const end = new Date(now);

        if (time === 'today') {
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            return { start, end };
        }

        if (time === 'week') {
            // Pazartesi başlangıç (TR)
            const day = (now.getDay() + 6) % 7; // 0=Mon
            start.setDate(now.getDate() - day);
            start.setHours(0, 0, 0, 0);

            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            return { start, end };
        }

        if (time === 'month') {
            start.setDate(1);
            start.setHours(0, 0, 0, 0);

            end.setMonth(start.getMonth() + 1);
            end.setDate(0); // ayın son günü
            end.setHours(23, 59, 59, 999);
            return { start, end };
        }

        return null;
    }

    async list(dto: ListPlanDto) {
        const status = this.normalizeStatus(dto.status);
        const range = this.getDateRange(dto.time);

        const where: Prisma.ProgramPlanWhereInput = {};

        if (status) where.status = status;

        // ✅ Overlap filtresi: aralıkla çakışanları getir
        if (range) {
            where.AND = [{ startDate: { lte: range.end } }, { endDate: { gte: range.start } }];
        }

        if (dto.q?.trim()) {
            const q = dto.q.trim();
            where.OR = [
                { title: { contains: q, mode: 'insensitive' } },
                { projectName: { contains: q, mode: 'insensitive' } },
            ];
        }

        return this.prisma.programPlan.findMany({
            where,
            orderBy: [{ startDate: 'asc' }, { createdAt: 'desc' }],
            include: {
                // ✅ User modelinde name yok -> sadece id/email alıyoruz
                assignee: { select: { id: true, username: true, email: true } }
            },
        });
    }

    async create(dto: CreatePlanDto) {
        const start = new Date(dto.startDate);
        const end = new Date(dto.endDate);
        if (end < start) throw new BadRequestException('Bitiş tarihi başlangıçtan küçük olamaz');

        return this.prisma.programPlan.create({
            data: {
                title: dto.title,
                type: (dto.type ?? 'DIGER') as any,
                projectName: dto.projectName ?? null,
                startDate: start,
                endDate: end,
                stage: (dto.stage ?? 'DIGER') as any,
                status: (dto.status ?? 'NEXT') as any,
                assigneeId: dto.assigneeId ?? null, // create'de OK
            },
            include: {
                assignee: { select: { id: true, username: true, email: true } }
            },
        });
    }

    async update(id: string, dto: UpdatePlanDto) {
        const exists = await this.prisma.programPlan.findUnique({ where: { id } });
        if (!exists) throw new NotFoundException('Plan bulunamadı');

        const data: Prisma.ProgramPlanUpdateInput = {};

        if (dto.title !== undefined) data.title = dto.title;
        if (dto.type !== undefined) data.type = dto.type as any;
        if (dto.projectName !== undefined) data.projectName = dto.projectName ?? null;
        if (dto.stage !== undefined) data.stage = dto.stage as any;
        if (dto.status !== undefined) data.status = dto.status as any;

        // ✅ assigneeId update: connect / disconnect
        if (dto.assigneeId !== undefined) {
            const v = (dto.assigneeId ?? '').trim();
            data.assignee = v ? { connect: { id: v } } : { disconnect: true };
        }

        const nextStart = dto.startDate ? new Date(dto.startDate) : exists.startDate;
        const nextEnd = dto.endDate ? new Date(dto.endDate) : exists.endDate;

        if (dto.startDate !== undefined) data.startDate = nextStart;
        if (dto.endDate !== undefined) data.endDate = nextEnd;

        if (nextEnd < nextStart) throw new BadRequestException('Bitiş tarihi başlangıçtan küçük olamaz');

        return this.prisma.programPlan.update({
            where: { id },
            data,
            include: {
                assignee: { select: { id: true, username: true, email: true } }
            },
        });
    }

    async remove(id: string) {
        const exists = await this.prisma.programPlan.findUnique({ where: { id } });
        if (!exists) throw new NotFoundException('Plan bulunamadı');

        await this.prisma.programPlan.delete({ where: { id } });
        return { ok: true };
    }
}
