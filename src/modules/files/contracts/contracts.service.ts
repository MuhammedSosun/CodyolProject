import { Injectable, NotFoundException } from '@nestjs/common';
import { ContractsRepository } from './contracts.repository';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { ContractListQueryDto } from './dto/contract-list-query.dto';

@Injectable()
export class ContractsService {
  constructor(private readonly repo: ContractsRepository) { }

  async create(userId: string, dto: CreateContractDto) {
    const item = await this.repo.create({
      createdByUser: { connect: { id: userId } },
      title: dto.title,
      fileUrl: dto.fileUrl,
      status: dto.status ?? 'ACTIVE',
    });

    return this.toResponse(item);
  }

  async list(userId: string, query: ContractListQueryDto) {
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
    if (!item) throw new NotFoundException('Contract not found');
    return this.toResponse(item);
  }

  async update(userId: string, id: string, dto: UpdateContractDto) {
    const updated = await this.repo.updateMany(
      { id, createdByUserId: userId, deletedAt: null },
      dto,
    );

    if (updated.count === 0) throw new NotFoundException('Contract not found');
    return { success: true };
  }

  async delete(userId: string, id: string) {
    const deleted = await this.repo.updateMany(
      { id, createdByUserId: userId, deletedAt: null },
      { deletedAt: new Date() },
    );

    if (deleted.count === 0) throw new NotFoundException('Contract not found');
  }

  private toResponse(x: any) {
    return {
      id: x.id,
      title: x.title,
      fileUrl: x.fileUrl,
      status: x.status,
      createdAt: x.createdAt,
    };
  }
}