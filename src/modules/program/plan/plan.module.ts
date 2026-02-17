import { Module } from '@nestjs/common';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [PlanService], // opsiyonel ama iyi
})
export class PlanModule {}
