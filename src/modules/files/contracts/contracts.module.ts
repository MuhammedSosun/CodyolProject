import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../prisma/prisma.module';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { ContractsRepository } from './contracts.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ContractsController],
  providers: [ContractsService, ContractsRepository],
  exports: [ContractsService],
})
export class ContractsModule { }