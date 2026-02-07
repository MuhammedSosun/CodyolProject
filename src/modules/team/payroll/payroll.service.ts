import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PayrollStatus } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';


@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  // 🟢 USER → kendi bordroları
  findByUser(userId: string) {
    return this.prisma.payroll.findMany({
      where: { userId },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  // 🟢 USER → bu ayki maaş
  findCurrent(userId: string) {
    const now = new Date();
    return this.prisma.payroll.findFirst({
      where: {
        userId,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      },
    });
  }

  // 🔴 ADMIN → bekleyen bordrolar
  findPending() {
    return this.prisma.payroll.findMany({
      where: { status: PayrollStatus.PENDING },
      include: {
        user: { include: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 🔴 ADMIN → ödenmiş bordrolar
  findPaid() {
    return this.prisma.payroll.findMany({
      where: { status: PayrollStatus.PAID },
      include: {
        user: { include: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 🔴 ADMIN → ödeme yap
  pay(id: string) {
    return this.prisma.payroll.update({
      where: { id },
      data: { status: PayrollStatus.PAID },
    });
  }// 🔴 ADMIN → tüm bordrolar
findAll() {
  return this.prisma.payroll.findMany({
    include: {
      user: { include: { profile: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// 🔴 ADMIN → bordro oluştur
async create(data: {
  userId: string;
  month: number;
  year: number;
  netSalary: number;
  note?: string;
}) {
  const exists = await this.prisma.payroll.findFirst({
    where: {
      userId: data.userId,
      month: data.month,
      year: data.year,
    },
  });

  if (exists) {
    throw new BadRequestException(
      'Bu kullanıcı için bu ay zaten bordro oluşturulmuş.'
    );
  }

  return this.prisma.payroll.create({
    data: {
      userId: data.userId,
      month: data.month,
      year: data.year,
      netSalary: data.netSalary,
      note: data.note,
    },
  });
}

}
