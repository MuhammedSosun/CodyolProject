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

  update(id: string, dto: UpdateProposalDto, userId: string) {
    return this.repo.update(id, userId, dto);
  }

  delete(id: string, userId: string) {
    return this.repo.softDelete(id, userId);
  }

  async list(userId: string, query: ProposalListQueryDto) {
    const result = await this.repo.findForList(userId, query);

    return {
      ...result,
      items: result.items.map((p) => ({
        id: p.id,
        title: p.title,
        totalAmount: p.totalAmount,
        currency: p.currency,
        status: p.status,
        createdAt: p.createdAt,
        customerName: p.customer?.fullName,
        customerEmail: p.customer?.email,
      })),
    };
  }
}
