import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LeaveStatus } from '@prisma/client';

@Injectable()
export class LeavesService {
  constructor(private prisma: PrismaService) {}

  // 🔴 Bekleyen izinler
  findPending() {
    return this.prisma.leave.findMany({
      where: { status: LeaveStatus.PENDING },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        employee: true,
        start: true,
        end: true,
        status: true,
        createdAt: true,
      
      },
    });
  }

  // 🟢 Onaylanan izinler
  findApproved() {
    return this.prisma.leave.findMany({
      where: { status: LeaveStatus.APPROVED },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        employee: true,
        start: true,
        end: true,
        status: true,
        createdAt: true,
      },
    });
  }

  // ✅ Onayla
  approve(id: number) {
    return this.prisma.leave.update({
      where: { id },
      data: { status: LeaveStatus.APPROVED },
    });
  }

  // ❌ Reddet
  reject(id: number) {
    return this.prisma.leave.update({
      where: { id },
      data: { status: LeaveStatus.REJECTED },
    });
  }
}
