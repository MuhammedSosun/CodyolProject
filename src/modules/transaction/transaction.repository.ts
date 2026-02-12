import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { TransactionListQueryDto } from './dto/transaction-list-query.dto';
import { TransactionType } from './enums/transaction.enums';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.TransactionCreateInput) {
    return this.prisma.transaction.create({ data });
  }

  update(id: string, data: Prisma.TransactionUpdateInput) {
    return this.prisma.transaction.update({
      where: { id },
      data,
    });
  }

  softDelete(id: string) {
    return this.prisma.transaction.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  findById(id: string) {
    return this.prisma.transaction.findFirst({
      where: { id, deletedAt: null },
      include: {
        customer: {
          select: { id: true, fullName: true, companyName: true },
        },
        proposal: {
          select: { id: true, title: true, status: true },
        },
        createdByUser: {
          select: { id: true, username: true, email: true },
        },
      },
    });
  }

  async list(query: TransactionListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.TransactionWhereInput = {
      deletedAt: null,
      ...(query.type ? { type: query.type as any } : {}),
      ...(query.category ? { category: query.category } : {}),
      ...(query.q
        ? {
            OR: [
              { description: { contains: query.q, mode: 'insensitive' } },
              { category: { contains: query.q, mode: 'insensitive' } },
              { referenceNo: { contains: query.q, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(query.dateFrom || query.dateTo
        ? {
            date: {
              ...(query.dateFrom ? { gte: new Date(query.dateFrom) } : {}),
              ...(query.dateTo ? { lte: new Date(query.dateTo) } : {}),
            },
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: limit,
        include: {
          customer: {
            select: { id: true, fullName: true, companyName: true },
          },
          proposal: {
            select: { id: true, title: true, status: true },
          },
          createdByUser: {
            select: { id: true, username: true },
          },
        },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return { items, page, limit, total };
  }

  async summary(dateFrom?: string, dateTo?: string) {
    const dateFilter: Prisma.DateTimeFilter | undefined =
      dateFrom || dateTo
        ? {
            ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
            ...(dateTo ? { lte: new Date(dateTo) } : {}),
          }
        : undefined;

    const baseWhere: Prisma.TransactionWhereInput = {
      deletedAt: null,
      ...(dateFilter ? { date: dateFilter } : {}),
    };

    const [incomeAgg, expenseAgg] = await this.prisma.$transaction([
      this.prisma.transaction.aggregate({
        where: { ...baseWhere, type: TransactionType.INCOME as any },
        _sum: { amount: true, paidAmount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { ...baseWhere, type: TransactionType.EXPENSE as any },
        _sum: { amount: true },
      }),
    ]);

    const incomeTotal = incomeAgg._sum.amount ?? new Prisma.Decimal(0);
    const incomeCollected = incomeAgg._sum.paidAmount ?? new Prisma.Decimal(0);
    const expenseTotal = expenseAgg._sum.amount ?? new Prisma.Decimal(0);

    // ✅ Servisin beklediği yeni alan isimleriyle döndürüyoruz
    return {
      totalSales: incomeTotal.toFixed(2),
      totalCollected: incomeCollected.toFixed(2),
      pendingPayment: incomeTotal.minus(incomeCollected).toFixed(2),
      totalExpense: expenseTotal.toFixed(2),
      currency: 'TRY',
    };
  }
}