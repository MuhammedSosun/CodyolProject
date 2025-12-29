import { Injectable, NotFoundException } from '@nestjs/common';
import { ProposalRepository } from './proposal.repository';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { ProposalListQueryDto } from './dto/proposal-list-query.dto';


@Injectable()
export class ProposalService {
    constructor(private readonly repo: ProposalRepository) { }

    create(dto: CreateProposalDto, organizationId: string, userId: string) {
        return this.repo.create({
            dto,
            organizationId,
            createdByUserId: userId,
        });
    }

    findAll(organizationId: string) {
        return this.repo.findAll(organizationId);
    }

    async findOne(id: string, organizationId: string) {
        const proposal = await this.repo.findById(id, organizationId);
        if (!proposal) {
            throw new NotFoundException('Teklif bulunamadı');
        }
        return proposal;
    }

    update(id: string, dto: UpdateProposalDto) {
        return this.repo.update(id, dto);
    }

    delete(id: string) {
        return this.repo.softDelete(id);
    }
    async list(
        organizationId: string,
        query: ProposalListQueryDto,
    ) {
        const result = await this.repo.findForList(organizationId, query);

        return {
            ...result,
            items: result.items.map((p) => ({
                id: p.id,
                title: p.title,
                totalAmount: p.totalAmount,
                currency: p.currency,
                status: p.status,
                createdAt: p.createdAt,
                customerName: p.customer.fullName,
                customerEmail: p.customer.email,
            })),
        };
    }
}
