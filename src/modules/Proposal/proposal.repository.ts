import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { ProposalListQueryDto } from './dto/proposal-list-query.dto';

@Injectable()
export class ProposalRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateProposalDto, userId: string) {
    return this.prisma.proposal.create({
      data: {
        title: dto.title,
        customerId: dto.customerId,
        validUntil: new Date(dto.validUntil),
        status: dto.status,
        totalAmount: dto.totalAmount, 
        // ➕ Yeni: Not içeriğini veritabanına kaydeder
        content: dto.content, 
        createdByUserId: userId,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.proposal.findMany({
      where: {
        createdByUserId: userId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string, userId: string) {
    return this.prisma.proposal.findFirst({
      where: {
        id,
        createdByUserId: userId,
        deletedAt: null,
      },
      include: {
        customer: true // Detay sayfasında müşteri bilgilerinin gelmesi için
      }
    });
  }

  update(id: string, userId: string, dto: UpdateProposalDto) {
    // 💡 updateMany yerine update kullanımı Prisma'nın DTO'daki 'content' ve 'customerId' 
    // gibi yeni alanları doğru işlemesini sağlar.
    return this.prisma.proposal.update({
      where: { 
        id,
      },
      data: {
        ...dto,
        // Tarih formatı string gelirse Date nesnesine çeviriyoruz
        validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
      },
    });
  }

  softDelete(id: string, userId: string) {
    return this.prisma.proposal.updateMany({
      where: {
        id,
        createdByUserId: userId,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
  }

  async findForList(userId: string, query: ProposalListQueryDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
      status,
      search,
    } = query;

    const where: any = {
      createdByUserId: userId,
      deletedAt: null,
    };

    if (status) where.status = status;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        {
          customer: {
            fullName: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.proposal.findMany({
        where,
        include: {
          customer: {
            select: { fullName: true, email: true },
          },
        },
        orderBy: { [sortBy]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.proposal.count({ where }),
    ]);

    return { items, total, page, limit };
  }
}