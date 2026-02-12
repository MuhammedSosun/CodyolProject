import { Injectable, NotFoundException } from '@nestjs/common';
import { LicensesRepository } from './licenses.repository';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';
import { LicenseListQueryDto } from './dto/license-list-query.dto';

@Injectable()
export class LicensesService {
  constructor(private readonly repo: LicensesRepository) { }

  async create(userId: string, dto: CreateLicenseDto) {
    const item = await this.repo.create({
      createdByUser: { connect: { id: userId } },
      title: dto.title,
      provider: dto.provider ?? null,
      startDate: dto.startDate ? new Date(dto.startDate) : null,
      endDate: dto.endDate ? new Date(dto.endDate) : null,
      status: dto.status ?? 'ACTIVE',
      note: dto.note ?? null,
    });

    return this.toResponse(item);
  }

  async list(userId: string, query: LicenseListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: any = { createdByUserId: userId, deletedAt: null };
    if (query.status) where.status = query.status;
    if (query.q) where.title = { contains: query.q, mode: 'insensitive' };

    const { items, total } = await this.repo.list(where, page, limit);

    return {
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      data: items.map((x) => this.toResponse(x)),
    };
  }

  async getById(userId: string, id: string) {
    const item = await this.repo.findFirst({ id, createdByUserId: userId, deletedAt: null });
    if (!item) throw new NotFoundException('License not found');
    return this.toResponse(item);
  }

  async update(userId: string, id: string, dto: UpdateLicenseDto) {
    const data: any = { ...dto };
    if (dto.startDate !== undefined) data.startDate = dto.startDate ? new Date(dto.startDate) : null;
    if (dto.endDate !== undefined) data.endDate = dto.endDate ? new Date(dto.endDate) : null;

    const updated = await this.repo.updateMany(
      { id, createdByUserId: userId, deletedAt: null },
      data,
    );

    if (updated.count === 0) throw new NotFoundException('License not found');
    return { success: true };
  }

  async delete(userId: string, id: string) {
    const deleted = await this.repo.updateMany(
      { id, createdByUserId: userId, deletedAt: null },
      { deletedAt: new Date() },
    );

    if (deleted.count === 0) throw new NotFoundException('License not found');
  }

  private toResponse(x: any) {
    return {
      id: x.id,
      title: x.title,
      provider: x.provider,
      startDate: x.startDate,
      endDate: x.endDate,
      status: x.status,
      note: x.note,
      createdAt: x.createdAt,
    };
  }
}