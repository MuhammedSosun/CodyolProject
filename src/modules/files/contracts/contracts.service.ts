import { Injectable, NotFoundException } from '@nestjs/common';
import { ContractsRepository } from './contracts.repository';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { ContractListQueryDto } from './dto/contract-list-query.dto';

@Injectable()
export class ContractsService {
  constructor(private readonly repo: ContractsRepository) { }

  async create(userId: string, dto: CreateContractDto, file?: Express.Multer.File) {
    const data: any = {
      createdByUser: { connect: { id: userId } },
      title: dto.title,
      status: (dto.status as any) ?? 'ACTIVE',

      description: dto.description ?? null,
      startDate: dto.startDate ? new Date(dto.startDate as any) : null,
      endDate: dto.endDate ? new Date(dto.endDate as any) : null,
    };

    // ✅ customer relation connect
    if (dto.customerId) {
      data.customer = { connect: { id: dto.customerId } };
    }

    const fileUrl = this.resolveFileUrl(dto as any, file);
    if (fileUrl) data.fileUrl = fileUrl;

    if (file) {
      data.fileName = file.originalname ?? null;
      data.mimeType = file.mimetype ?? null;
      data.size = typeof file.size === 'number' ? file.size : null;
    }

    const item = await this.repo.create(data);
    return this.toResponse(item);
  }

  async list(userId: string, query: ContractListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: any = { createdByUserId: userId, deletedAt: null };

    if (query.status) where.status = query.status;
    if (query.q) where.title = { contains: query.q, mode: 'insensitive' };

    // ✅ customerId filtresi relation üzerinden
    if ((query as any).customerId) {
      where.customer = { is: { id: (query as any).customerId } };
    }

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

  async update(userId: string, id: string, dto: UpdateContractDto, file?: Express.Multer.File) {
    // ✅ updateMany sadece scalar alanları kabul eder (relation kabul etmez)
    const scalarPatch: any = {};
    let relationPatch: any = null;

    if (dto.title !== undefined) scalarPatch.title = dto.title;
    if (dto.status !== undefined) scalarPatch.status = dto.status;

    if ((dto as any).description !== undefined) {
      scalarPatch.description = (dto as any).description ?? null;
    }

    if ((dto as any).startDate !== undefined) {
      scalarPatch.startDate = (dto as any).startDate ? new Date((dto as any).startDate) : null;
    }
    if ((dto as any).endDate !== undefined) {
      scalarPatch.endDate = (dto as any).endDate ? new Date((dto as any).endDate) : null;
    }

    // ✅ customer relation patch'i ayrı güncellenecek
    if ((dto as any).customerId !== undefined) {
      if ((dto as any).customerId) {
        relationPatch = { customer: { connect: { id: (dto as any).customerId } } };
      } else {
        relationPatch = { customer: { disconnect: true } };
      }
    }

    const fileUrl = this.resolveFileUrl(dto as any, file);
    if (fileUrl !== undefined) scalarPatch.fileUrl = fileUrl ?? null;

    if (file) {
      scalarPatch.fileName = file.originalname ?? null;
      scalarPatch.mimeType = file.mimetype ?? null;
      scalarPatch.size = typeof file.size === 'number' ? file.size : null;
    }

    // 1) scalar update
    const updated = await this.repo.updateMany(
      { id, createdByUserId: userId, deletedAt: null },
      scalarPatch,
    );

    if (updated.count === 0) throw new NotFoundException('Contract not found');

    // 2) relation update (customer connect/disconnect)
    if (relationPatch) {
      await this.repo.update({ id }, relationPatch);
    }

    return { success: true };
  }

  async delete(userId: string, id: string) {
    const deleted = await this.repo.updateMany(
      { id, createdByUserId: userId, deletedAt: null },
      { deletedAt: new Date() },
    );

    if (deleted.count === 0) throw new NotFoundException('Contract not found');
    return { success: true };
  }

  private toResponse(x: any) {
    return {
      id: x.id,
      title: x.title,

      customerId: x.customer?.id ?? null,
      customer: x.customer
        ? {
          id: x.customer.id,
          fullName: x.customer.fullName,
          companyName: x.customer.companyName ?? null,
        }
        : null,

      startDate: x.startDate ?? null,
      endDate: x.endDate ?? null,
      description: x.description ?? null,

      status: x.status,
      fileUrl: x.fileUrl ?? null,
      fileName: x.fileName ?? null,
      mimeType: x.mimeType ?? null,
      size: x.size ?? null,

      createdAt: x.createdAt,
      updatedAt: x.updatedAt,
    };
  }

  private resolveFileUrl(dto: any, file?: Express.Multer.File): string | undefined {
    if (dto?.fileUrl) return dto.fileUrl;
    if (!file) return undefined;

    const rel = `/uploads/contracts/${file.filename}`;
    const base = process.env.FILE_BASE_URL; // ör: http://localhost:3050
    return base ? `${base}${rel}` : rel;
  }
}
