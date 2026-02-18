import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProjectRepository } from './project.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectListQueryDto } from './dto/project-list-query.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly repo: ProjectRepository) { }

  async create(userId: string, dto: CreateProjectDto) {
    const item = await this.repo.create({
      name: dto.name,
      description: dto.description ?? null,
      status: dto.status ?? 'ACTIVE',
      createdByUserId: userId,
    });

    return this.toResponse(item);
  }

  async list(userId: string, query: ProjectListQueryDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 50);

    const where: Prisma.ProjectWhereInput = {
      deletedAt: null,
      createdByUserId: userId, // sadece kendi projelerin (istersen kaldırırız)
    };

    if (query.status) where.status = query.status;
    if (query.search) {
      where.name = { contains: query.search, mode: 'insensitive' };
    }

    const items = await this.repo.list(where, (page - 1) * limit, limit);

    return {
      meta: { page, limit },
      data: items.map((p) => this.toResponse(p)),
    };
  }

  private toResponse(p: any) {
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      status: p.status,
      createdByUserId: p.createdByUserId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  }
}
