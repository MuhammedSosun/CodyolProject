import { Injectable, NotFoundException } from '@nestjs/common';
import { HostingRepository } from './hosting.repository';
import { CreateHostingDto } from './dto/create-hosting.dto';
import { UpdateHostingDto } from './dto/update-hosting.dto';
import { HostingListQueryDto } from './dto/hosting-list-query.dto';

@Injectable()
export class HostingService {
  constructor(private readonly repo: HostingRepository) { }

  async create(userId: string, dto: CreateHostingDto) {
    const item = await this.repo.create({
      createdByUser: { connect: { id: userId } },
      title: dto.title,
      provider: dto.provider ?? null,
      ip: dto.ip ?? null,
      domain: dto.domain ?? null,
      dbPassword: dto.dbPassword ?? null,
      note: dto.note ?? null,
      status: dto.status ?? 'ACTIVE',
    });

    return this.toResponse(item);
  }

  async list(userId: string, query: HostingListQueryDto) {
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
    if (!item) throw new NotFoundException('Hosting info not found');
    return this.toResponse(item);
  }

  async update(userId: string, id: string, dto: UpdateHostingDto) {
    const updated = await this.repo.updateMany(
      { id, createdByUserId: userId, deletedAt: null },
      dto,
    );

    if (updated.count === 0) throw new NotFoundException('Hosting info not found');
    return { success: true };
  }

  async delete(userId: string, id: string) {
    const deleted = await this.repo.updateMany(
      { id, createdByUserId: userId, deletedAt: null },
      { deletedAt: new Date() },
    );

    if (deleted.count === 0) throw new NotFoundException('Hosting info not found');
  }

  private toResponse(x: any) {
    return {
      id: x.id,
      title: x.title,
      provider: x.provider,
      ip: x.ip,
      domain: x.domain,
      dbPassword: x.dbPassword,
      note: x.note,
      status: x.status,
      createdAt: x.createdAt,
    };
  }
}