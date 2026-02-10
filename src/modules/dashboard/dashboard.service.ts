import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CustomerStatus } from '../customer/enums/customer-status.enum';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getCustomerStats() {
    const activeStatuses: CustomerStatus[] = [
      CustomerStatus.NEW,
      CustomerStatus.CONTACTED,
      CustomerStatus.OFFER_SENT,
      CustomerStatus.WAITING_APPROVAL,
      CustomerStatus.APPROVED,
      CustomerStatus.WON,
    ];

    // Kurumsal: tek seferde paralel say
    const [total, active, contacted, lost] = await Promise.all([
      this.prisma.customer.count({
        where: { deletedAt: null },
      }),

      this.prisma.customer.count({
        where: { deletedAt: null, status: { in: activeStatuses } },
      }),

      this.prisma.customer.count({
        where: { deletedAt: null, status: CustomerStatus.CONTACTED },
      }),

      this.prisma.customer.count({
        where: { deletedAt: null, status: CustomerStatus.LOST },
      }),
    ]);

    return { total, active, contacted, lost };
  }
}
