import { Injectable, NotFoundException } from '@nestjs/common';
import { ProposalRepository } from './proposal.repository';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { ProposalListQueryDto } from './dto/proposal-list-query.dto';
import { ActivityService } from '../activity/activity.service';
import { ActivityType } from '@prisma/client';

@Injectable()
export class ProposalService {
  constructor(private readonly repo: ProposalRepository, private readonly activityService: ActivityService) { }

  async create(dto: CreateProposalDto, userId: string) {
    const created = await this.repo.create(dto, userId);

    await this.activityService.create(
      {
        customerId: created.customerId ?? undefined,
        type: ActivityType.NOTE,
        title: `Teklif oluşturuldu: ${created.title}`,
        description: created.totalAmount
          ? `Tutar: ${created.totalAmount} ${created.currency ?? ''}`.trim()
          : undefined,
      },
      userId,
    );

    return created;
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
    const current = await this.repo.findById(id, userId);
    if (!current) throw new NotFoundException('Teklif bulunamadı');

    const updated = await this.repo.updateSafe(id, userId, dto);
    if (!updated) throw new NotFoundException('Teklif bulunamadı');

    if (dto.status !== undefined && dto.status !== current.status) {
      await this.activityService.create(
        {
          customerId: updated.customerId ?? undefined,
          type: ActivityType.NOTE,
          title: `Teklif durumu güncellendi: ${updated.title}`,
          description: `Status: ${current.status} → ${updated.status}`,
        },
        userId,
      );
    } else {
      await this.activityService.create(
        {
          customerId: updated.customerId ?? undefined,
          type: ActivityType.NOTE,
          title: `Teklif güncellendi: ${updated.title}`,
        },
        userId,
      );
    }

    return updated;
  }

  async delete(id: string, userId: string) {
    const current = await this.repo.findById(id, userId);
    if (!current) throw new NotFoundException('Teklif bulunamadı');

    const ok = await this.repo.softDeleteSafe(id, userId);
    if (!ok) throw new NotFoundException('Teklif bulunamadı');

    await this.activityService.create(
      {
        customerId: current.customerId ?? undefined,
        type: ActivityType.NOTE,
        title: `Teklif silindi: ${current.title}`,
      },
      userId,
    );

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
