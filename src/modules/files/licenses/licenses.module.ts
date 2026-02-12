import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../prisma/prisma.module';
import { LicensesController } from './licenses.controller';
import { LicensesService } from './licenses.service';
import { LicensesRepository } from './licenses.repository';

@Module({
  imports: [PrismaModule],
  controllers: [LicensesController],
  providers: [LicensesService, LicensesRepository],
  exports: [LicensesService],
})
export class LicensesModule { }