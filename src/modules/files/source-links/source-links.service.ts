import { Injectable, NotFoundException } from '@nestjs/common';
import { SourceLinksRepository } from './source-links.repository';
import { CreateSourceLinkDto } from './dto/create-source-link.dto';
import { UpdateSourceLinkDto } from './dto/update-source-link.dto';
import { SourceLinkListQueryDto } from './dto/source-link-list-query.dto';

@Injectable()
export class SourceLinksService {
  constructor(private readonly repo: SourceLinksRepository) { }

  async create(userId: string, dto: CreateSourceLinkDto) {
    const item = await this.repo.create({
      createdByUser: { connect: { id: userId } },
      title: dto.title,
      url: dto.url,
      type: dto.type ?? 'OTHER',
    });

    return this.toResponse(item);
  }

  async list(userId: string, query: SourceLinkListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: any = { createdByUserId: userId, deletedAt: null };
    if (query.type) where.type = query.type;
    if (query.q) where.title = { contains: query.q, mode: 'insensitive' };

    const { items, total } = await this.repo.list(where, page, limit);

    return {
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      data: items.map((x) => this.toResponse(x)),
    };
  }

  async getById(userId: string, id: string) {
    const item = await this.repo.findFirst({ id, createdByUserId: userId, deletedAt: null });
    if (!item) throw new NotFoundException('Source link not found');
    return this.toResponse(item);
  }

  async update(userId: string, id: string, dto: UpdateSourceLinkDto) {
    const updated = await this.repo.updateMany(
      { id, createdByUserId: userId, deletedAt: null },
      dto,
    );

    if (updated.count === 0) throw new NotFoundException('Source link not found');
    return { success: true };
  }

  async delete(userId: string, id: string) {
    const deleted = await this.repo.updateMany(
      { id, createdByUserId: userId, deletedAt: null },
      { deletedAt: new Date() },
    );

    if (deleted.count === 0) throw new NotFoundException('Source link not found');
  }

  private toResponse(x: any) {
    return {
      id: x.id,
      title: x.title,
      url: x.url,
      type: x.type,
      createdAt: x.createdAt,
    };
  }
}