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

        // ✅ Kalemleri ProposalItem tablosuna tek tek ve ilişkili olarak kaydeder
        items: {
          create: dto.items.map((item) => ({
            description: item.product, // Frontend'den gelen 'product' adını veritabanındaki 'description' ile eşleştiriyoruz
            quantity: Number(item.qty),
            unitPrice: new Prisma.Decimal(item.price),
            taxRate: Number(item.tax),
          })),
        },
      },
      // ✅ İşlem bittikten sonra kalemleri de cevap olarak dönmesi için ekliyoruz
      include: {
        items: true,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.proposal.findMany({
      where: { createdByUserId: userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string, userId: string) {
  return this.prisma.proposal.findFirst({
    where: { 
      id, 
      createdByUserId: userId, 
      deletedAt: null 
    },
    include: {
      // 1. Müşteri bilgilerini getir
      customer: {
        select: {
          id: true,
          fullName: true,
          email: true,
          companyName: true,
          phone: true,
        },
      },
      // 2. ✅ Teklif kalemlerini (items) dahil et
      items: {
        select: {
          id: true,
          description: true,
          quantity: true,
          unitPrice: true,
          taxRate: true,
        },
        orderBy: {
          createdAt: 'asc', // Kalemleri eklenme sırasına göre diz
        },
      },
    },
  });
}

  async updateSafe(id: string, userId: string, dto: UpdateProposalDto) {
  // 1. Yetki ve kayıt kontrolü
  const current = await this.prisma.proposal.findFirst({
    where: { id, createdByUserId: userId, deletedAt: null },
  });
  
  if (!current) return null;

  // 2. Güncelleme işlemi
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
      
      // ✅ Kalemleri (items) güncelleme mantığı
      items: {
        // Önce bu teklife ait eski kalemlerin tamamını siler
        deleteMany: {}, 
        // DTO'dan gelen yeni kalemleri tek tek oluşturur
        create: dto.items?.map((item) => ({
          description: item.product, // Frontend 'product' gönderiyor, DB 'description' bekliyor
          quantity: Number(item.qty),
          unitPrice: new Prisma.Decimal(item.price),
          taxRate: Number(item.tax),
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
      // ✅ View ekranına güncel kalemlerin dönmesi için items'ı dahil ediyoruz
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
