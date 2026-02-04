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
findByUser(username: string) {
  return this.prisma.leave.findMany({
    where: { employee: username },
    orderBy: { createdAt: 'desc' },
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
  
  
  // ➕ İzin oluştur (User tarafı)
create(data: {
  type: string;
  start: string;
  end: string;
  note?: string;
  employee: string;
}) {
  return this.prisma.leave.create({
    data: {
      employee: data.employee,
      type: data.type ?? 'İzin',
      start: new Date(data.start),
      end: new Date(data.end),
      status: LeaveStatus.PENDING,
    },
  });
}

}
