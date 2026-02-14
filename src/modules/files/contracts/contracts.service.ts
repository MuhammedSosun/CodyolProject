import { Injectable, NotFoundException } from '@nestjs/common';
import { ContractsRepository } from './contracts.repository';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { ContractListQueryDto } from './dto/contract-list-query.dto';

@Injectable()
export class ContractsService {
  constructor(private readonly repo: ContractsRepository) { }

  async create(userId: string, dto: CreateContractDto, file?: Express.Multer.File) {
    console.log("=== CONTRACT CREATE START ===");
    console.log("userId:", userId);
    console.log("dto:", dto);
    console.log("file exists?:", !!file);

    if (file) {
      console.log("file.originalname:", file.originalname);
      console.log("file.mimetype:", file.mimetype);
      console.log("file.size:", file.size);
      console.log("file.filename:", (file as any).filename);
      console.log("file.path:", (file as any).path);
    } else {
      console.log("⚠️ FILE IS UNDEFINED");
    }

    const data: any = {
      createdByUser: { connect: { id: userId } },
      title: dto.title,
      status: dto.status ?? ('ACTIVE' as any),
      description: dto.description ?? null,
      startDate: dto.startDate ? new Date(dto.startDate) : null,
      endDate: dto.endDate ? new Date(dto.endDate) : null,
    };

    if (dto.customerId) {
      console.log("Connecting customer:", dto.customerId);
      data.customer = { connect: { id: dto.customerId } };
    }

    const fileUrl = this.resolveFileUrl(dto, file);

    console.log("Generated fileUrl:", fileUrl);

    if (fileUrl) data.fileUrl = fileUrl;

    if (file) {
      data.fileName = file.originalname ?? null;
      data.mimeType = file.mimetype ?? null;
      data.size = typeof file.size === 'number' ? file.size : null;
    }

    console.log("Final Prisma data:", JSON.stringify(data, null, 2));

    const item = await this.repo.create(data);

    console.log("Saved item:", item);
    console.log("=== CONTRACT CREATE END ===");

    return this.toResponse(item);
  }


  async list(userId: string, query: ContractListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: any = { createdByUserId: userId, deletedAt: null };

    if (query.status) where.status = query.status;
    if (query.q) where.title = { contains: query.q, mode: 'insensitive' };

    if (query.customerId) {
      // customer relation varsa:
      where.customer = { is: { id: query.customerId } };
      // eğer schema’da direkt customerId varsa bunun yerine:
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

    // fileUrl: dto.fileUrl varsa onu, yoksa file varsa upload url üret
    const fileUrl = this.resolveFileUrl(dto, file);
    if (fileUrl !== undefined) patch.fileUrl = fileUrl ?? null;

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

  private resolveFileUrl(dto: { fileUrl?: string }, file?: Express.Multer.File): string | undefined {
    console.log("resolveFileUrl called");
    console.log("dto.fileUrl:", dto?.fileUrl);

    if (dto?.fileUrl) {
      console.log("Using dto.fileUrl");
      return dto.fileUrl;
    }

    if (!file) {
      console.log("No file provided, returning undefined");
      return undefined;
    }

    console.log("File filename:", (file as any).filename);

    const rel = `/uploads/contracts/${(file as any).filename}`;
    const base = process.env.FILE_BASE_URL;

    console.log("Base URL:", base);
    console.log("Relative path:", rel);

    const finalUrl = base ? `${base}${rel}` : rel;

    console.log("Final URL:", finalUrl);

    return finalUrl;
  }

}
