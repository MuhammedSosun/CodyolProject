import { Module } from '@nestjs/common';
import { LeavesController } from './leaves.controller';
import { LeavesService } from './leaves.service';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // 🔥 BU SATIR ŞART
  controllers: [LeavesController],
  providers: [LeavesService],
})
export class LeavesModule {}
