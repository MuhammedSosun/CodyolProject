import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionListQueryDto } from './dto/transaction-list-query.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

// ✅ 1. ADIM: Oluşturduğun Enum'ları buraya import et
import { TransactionType, PaymentMethod } from './enums/transaction.enums';

@Injectable()
export class TransactionService {
  constructor(
    private readonly repo: TransactionRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateTransactionDto, user: any) {
    // Proposal kontrol mantığın aynen kalıyor
    let resolvedCustomerId = dto.customerId ?? null;

    if (dto.proposalId) {
      const proposal = await this.prisma.proposal.findFirst({
        where: { id: dto.proposalId, deletedAt: null },
        select: { id: true, customerId: true },
      });

      if (!proposal) throw new NotFoundException('Proposal not found');
      if (!proposal.customerId)
        throw new BadRequestException('Proposal has no customer');

      resolvedCustomerId = proposal.customerId;
    }

    // ✅ 2. ADIM: 'as any' yerine Enum kullanıyoruz
    // Eğer DTO'dan gelen veri string ise, onu Enum tipine zorlayabilirsin
    const data: Prisma.TransactionCreateInput = {
      type: dto.type as TransactionType, // 'as any' yerine
      amount: new Prisma.Decimal(dto.amount),
      paidAmount: new Prisma.Decimal(dto.paidAmount ?? '0'),
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      currency: dto.currency ?? 'TRY',
      date: dto.date ? new Date(dto.date) : new Date(),
      description: dto.description ?? null,
      category: dto.category ?? null,

      // Varsayılan değer ataması ve tip güvenliği
      paymentMethod: (dto.paymentMethod ??
        PaymentMethod.BANK_TRANSFER) as PaymentMethod,
      referenceNo: dto.referenceNo ?? null,

      createdByUser: { connect: { id: user.id } },

      ...(resolvedCustomerId
        ? { customer: { connect: { id: resolvedCustomerId } } }
        : {}),

      ...(dto.proposalId
        ? { proposal: { connect: { id: dto.proposalId } } }
        : {}),
    };

    return this.repo.create(data);
  }

  async list(query: TransactionListQueryDto) {
    return this.repo.list(query);
  }

  async summary(dateFrom?: string, dateTo?: string) {
    const result = await this.repo.summary(dateFrom, dateTo);

    // ✅ Frontend statsRes.data.data olarak okuyabilsin diye 'data' içinde dönüyoruz
    return {
      data: {
        totalSales: result.totalSales,
        totalCollected: result.totalCollected,
        pendingPayment: result.pendingPayment,
        totalExpense: result.totalExpense,
        currency: result.currency,
      },
    };
  }

  async update(id: string, dto: UpdateTransactionDto) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new NotFoundException('Transaction not found');

    // ✅ 3. ADIM: Update kısmında da 'as any' temizliği
    const data: Prisma.TransactionUpdateInput = {
      ...(dto.type ? { type: dto.type as TransactionType } : {}),
      ...(dto.amount ? { amount: new Prisma.Decimal(dto.amount) } : {}),
      ...(dto.paidAmount ? { paidAmount: new Prisma.Decimal(dto.paidAmount) } : {}),
      ...(dto.dueDate ? { dueDate: new Date(dto.dueDate) } : {}),
      ...(dto.currency ? { currency: dto.currency } : {}),
      ...(dto.date ? { date: new Date(dto.date) } : {}),
      ...(dto.description !== undefined
        ? { description: dto.description ?? null }
        : {}),
      ...(dto.category !== undefined ? { category: dto.category ?? null } : {}),

      ...(dto.paymentMethod
        ? { paymentMethod: dto.paymentMethod as PaymentMethod }
        : {}),

      ...(dto.referenceNo !== undefined
        ? { referenceNo: dto.referenceNo ?? null }
        : {}),
      ...(dto.customerId
        ? { customer: { connect: { id: dto.customerId } } }
        : {}),
      ...(dto.proposalId
        ? { proposal: { connect: { id: dto.proposalId } } }
        : {}),
    };

    return this.repo.update(id, data);
  }

  async getById(id: string) {
    const tx = await this.repo.findById(id);
    if (!tx) {
      throw new NotFoundException('Transaction not found');
    }
    return tx;
  }

  async remove(id: string) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new NotFoundException('Transaction not found');

    return this.repo.softDelete(id);
  }
}