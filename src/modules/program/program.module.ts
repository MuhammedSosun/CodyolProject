import { Module } from '@nestjs/common';
import { ProgramController } from './program.controller';
import { ProgramService } from './program.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { PlanModule } from './plan/plan.module';

@Module({
  imports: [PrismaModule, PlanModule],
  controllers: [ProgramController],
  providers: [ProgramService],
})
export class ProgramModule {}
