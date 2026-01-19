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

@Injectable()
export class TransactionService {
  constructor(private readonly repo: TransactionRepository) {}

  async create(dto: CreateTransactionDto, user: any) {
    const data: Prisma.TransactionCreateInput = {
      type: dto.type as any,
      amount: new Prisma.Decimal(dto.amount),
      currency: dto.currency ?? 'TRY',
      date: dto.date ? new Date(dto.date) : new Date(),
      description: dto.description ?? null,
      category: dto.category ?? null,
      paymentMethod: (dto.paymentMethod ?? 'BANK_TRANSFER') as any,
      referenceNo: dto.referenceNo ?? null,

      createdByUser: { connect: { id: user.id } },

      ...(dto.customerId
        ? { customer: { connect: { id: dto.customerId } } }
        : {}),
      ...(dto.proposalId
        ? { proposal: { connect: { id: dto.proposalId } } }
        : {}),
    };

    // Basit güvenlik: müşteri ve teklif aynı anda verildiyse (opsiyonel)
    // İstersen buna izin ver; CRM’de bazen mantıklı.
    return this.repo.create(data);
  }

  async list(query: TransactionListQueryDto) {
    return this.repo.list(query);
  }

  async summary(dateFrom?: string, dateTo?: string) {
    return this.repo.summary(dateFrom, dateTo);
  }

  async update(id: string, dto: UpdateTransactionDto) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new NotFoundException('Transaction not found');

    const data: Prisma.TransactionUpdateInput = {
      ...(dto.type ? { type: dto.type as any } : {}),
      ...(dto.amount ? { amount: new Prisma.Decimal(dto.amount) } : {}),
      ...(dto.currency ? { currency: dto.currency } : {}),
      ...(dto.date ? { date: new Date(dto.date) } : {}),
      ...(dto.description !== undefined
        ? { description: dto.description ?? null }
        : {}),
      ...(dto.category !== undefined ? { category: dto.category ?? null } : {}),
      ...(dto.paymentMethod ? { paymentMethod: dto.paymentMethod as any } : {}),
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
