import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { ActivityRepository } from './activity.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ActivityController],
  providers: [
    ActivityService,
    ActivityRepository,
    PrismaService, // 🔥 EKLENDİ
  ],
  exports: [ActivityService],
})
export class ActivityModule {}
