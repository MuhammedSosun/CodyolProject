import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { ProposalListQueryDto } from './dto/proposal-list-query.dto';
import { Prisma } from '@prisma/client';

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
        totalAmount: dto.totalAmount
          ? new Prisma.Decimal(dto.totalAmount)
          : undefined,
        createdByUserId: userId,

        // ✅ Yeni şemaya göre kalemleri ekliyoruz
        items: {
          create: dto.items?.map((item) => ({
            description: item.description,
            quantity: Number(item.quantity),
            unitPrice: new Prisma.Decimal(item.unitPrice),
            taxRate: Number(item.taxRate),
          })),
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            companyName: true,
            phone: true,
          },
        },
        // ✅ Cevapta kalemlerin de gelmesini sağlıyoruz
        items: true,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.proposal.findMany({
      where: { createdByUserId: userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { items: true } // Listede kalem sayısı gerekebilir diye ekledik
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
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            companyName: true,
            phone: true,
          },
        },
        // ✅ Teklif detayında kalemleri de getiriyoruz
        items: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async updateSafe(id: string, userId: string, dto: UpdateProposalDto) {
    const current = await this.prisma.proposal.findFirst({
      where: { id, createdByUserId: userId, deletedAt: null },
    });

    if (!current) return null;

    return this.prisma.proposal.update({
      where: { id },
      data: {
        title: dto.title,
        customerId: dto.customerId,
        status: dto.status,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
        totalAmount: dto.totalAmount
          ? new Prisma.Decimal(dto.totalAmount)
          : undefined,

        // ✅ Kalemleri güncelleme: Mevcutları silip yenileri ekleme (En güvenli yol)
        items: dto.items ? {
          deleteMany: {},
          create: dto.items.map((item) => ({
            description: item.description,
            quantity: Number(item.quantity),
            unitPrice: new Prisma.Decimal(item.unitPrice),
            taxRate: Number(item.taxRate),
          })),
        } : undefined,
      },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            companyName: true,
            phone: true,
          },
        },
        items: true,
      },
    });
  }

  async softDeleteSafe(id: string, userId: string) {
    const current = await this.prisma.proposal.findFirst({
      where: { id, createdByUserId: userId, deletedAt: null },
    });
    if (!current) return null;

    await this.prisma.proposal.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return true;
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

    const where: any = { createdByUserId: userId, deletedAt: null };
    if (status) where.status = status;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { customer: { fullName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.proposal.findMany({
        where,
        include: {
          customer: { select: { fullName: true, email: true } },
          _count: { select: { items: true } } // Kaç kalem olduğunu gösterir
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