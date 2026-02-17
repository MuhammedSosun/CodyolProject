import { Injectable, NotFoundException } from '@nestjs/common';
import { ProposalRepository } from './proposal.repository';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { ProposalListQueryDto } from './dto/proposal-list-query.dto';

@Injectable()
export class ProposalService {
  constructor(private readonly repo: ProposalRepository) {}

  create(dto: CreateProposalDto, userId: string) {
    return this.repo.create(dto, userId);
  }

  findAll(userId: string) {
    return this.repo.findAll(userId);
  }

  async findOne(id: string, userId: string) {
    const proposal = await this.repo.findById(id, userId);
    if (!proposal) throw new NotFoundException('Teklif bulunamadı');
    return proposal;
  }

  async update(id: string, userId: string, dto: UpdateProposalDto) {
    const updated = await this.repo.updateSafe(id, userId, dto);
    if (!updated) throw new NotFoundException('Teklif bulunamadı');
    return updated;
  }

  async delete(id: string, userId: string) {
    const ok = await this.repo.softDeleteSafe(id, userId);
    if (!ok) throw new NotFoundException('Teklif bulunamadı');
    return { ok: true };
  }

  async list(userId: string, query: ProposalListQueryDto) {
    const result = await this.repo.findForList(userId, query);

    return {
      ...result,
      items: result.items.map((p: any) => ({
        id: p.id,
        customerId: p.customer?.id,
        title: p.title,
        totalAmount: p.totalAmount,
        currency: p.currency,
        status: p.status,
        createdAt: p.createdAt,
        validUntil: p.validUntil,
        customerName: p.customer?.fullName,
        customerEmail: p.customer?.email,
        // ✅ Repository'de eklediğimiz kalem sayısını buraya yansıtabiliriz
        itemsCount: p._count?.items || 0, 
      })),
    };
  }
}