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
      status: (dto.status ?? 'ACTIVE') as any,
      description: dto.description ?? null,
      startDate: dto.startDate ? new Date(dto.startDate) : null,
      endDate: dto.endDate ? new Date(dto.endDate) : null,
    };

    // customer connect
    if (dto.customerId) {
      data.customer = { connect: { id: dto.customerId } };
    }

    // ✅ fileUrl üret (upload varsa kesin onu kullan)
    const fileUrl = this.resolveFileUrl(dto, file);
    if (fileUrl) data.fileUrl = fileUrl;

    // file meta
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

    if (query.customerId) {
      // relation varsa:
      where.customer = { is: { id: query.customerId } };
      // eğer schema’da direkt customerId varsa:
      // where.customerId = query.customerId;
    }

    const { items, total } = await this.repo.list(where, page, limit);

    return {
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      data: items.map((x: any) => this.toResponse(x)),
    };
  }

  async getById(userId: string, id: string) {
    const item = await this.repo.findFirst({ id, createdByUserId: userId, deletedAt: null });
    if (!item) throw new NotFoundException('Contract not found');
    return this.toResponse(item);
  }

  async update(userId: string, id: string, dto: UpdateContractDto, file?: Express.Multer.File) {
    const patch: any = {};

    if (dto.title !== undefined) patch.title = dto.title;
    if (dto.status !== undefined) patch.status = dto.status as any;

    if (dto.description !== undefined) patch.description = dto.description ?? null;
    if (dto.startDate !== undefined) patch.startDate = dto.startDate ? new Date(dto.startDate) : null;
    if (dto.endDate !== undefined) patch.endDate = dto.endDate ? new Date(dto.endDate) : null;

    // customer connect/disconnect
    if (dto.customerId !== undefined) {
      const v = (dto.customerId ?? '').trim();
      if (v) patch.customer = { connect: { id: v } };
      else patch.customer = { disconnect: true };
    }

    // ✅ fileUrl: upload varsa kesin onu kullan. upload yoksa dto.fileUrl sadece gerçek URL ise kabul et.
    const fileUrl = this.resolveFileUrl(dto, file);
    if (fileUrl !== undefined) {
      // undefined => dokunma
      // string => set et
      // null => sil (burada null dönmüyoruz)
      patch.fileUrl = fileUrl ?? null;
    }

    // file meta (sadece upload gelirse güncelle)
    if (file) {
      patch.fileName = file.originalname ?? null;
      patch.mimeType = file.mimetype ?? null;
      patch.size = typeof file.size === 'number' ? file.size : null;
    }

    const updated = await this.repo.updateOne(
      { id, createdByUserId: userId, deletedAt: null },
      patch,
    );

    if (!updated) throw new NotFoundException('Contract not found');
    return this.toResponse(updated);
  }

  async delete(userId: string, id: string) {
    const updated = await this.repo.updateOne(
      { id, createdByUserId: userId, deletedAt: null },
      { deletedAt: new Date() } as any,
    );

    if (!updated) throw new NotFoundException('Contract not found');
    return { success: true };
  }

  private toResponse(x: any) {
    return {
      id: x.id,
      title: x.title,

      customerId: x.customerId ?? x.customer?.id ?? null,
      customer: x.customer
        ? {
          id: x.customer.id,
          fullName: x.customer.fullName,
          companyName: x.customer.companyName ?? null,
        }
        : null,

      description: x.description ?? null,
      startDate: x.startDate ?? null,
      endDate: x.endDate ?? null,

      fileUrl: x.fileUrl ?? null,
      fileName: x.fileName ?? null,
      mimeType: x.mimeType ?? null,
      size: x.size ?? null,

      status: x.status,
      createdAt: x.createdAt,
      updatedAt: x.updatedAt,
    };
  }

  /**
   * ✅ KURAL:
   * - Upload (file) geldiyse HER ZAMAN uploads path üret
   * - Upload yoksa dto.fileUrl sadece gerçek http/https ise kabul et
   * - Sadece "abc.pdf" gibi filename gelirse kabul ETME (invalid URL üretir)
   *
   * Return:
   * - string  => set edilebilir
   * - undefined => hiç dokunma
   */
  private resolveFileUrl(dto: { fileUrl?: string }, file?: Express.Multer.File): string | undefined {
    // ✅ Upload geldiyse kesin path
    if (file && (file as any).filename) {
      const rel = `/uploads/contracts/${(file as any).filename}`;
      const base = process.env.FILE_BASE_URL; // optional
      return base ? `${base}${rel}` : rel;
    }

    // Upload yoksa dto.fileUrl opsiyonel
    const raw = (dto?.fileUrl ?? '').trim();
    if (!raw) return undefined;

    // sadece gerçek url ise kabul
    if (/^https?:\/\//i.test(raw)) return raw;

    // filename veya relative gibi şeyleri ignore et
    return undefined;
  }
}
