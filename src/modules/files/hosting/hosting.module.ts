import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../prisma/prisma.module';
import { HostingController } from './hosting.controller';
import { HostingService } from './hosting.service';
import { HostingRepository } from './hosting.repository';

@Module({
  imports: [PrismaModule],
  controllers: [HostingController],
  providers: [HostingService, HostingRepository],
  exports: [HostingService],
})
export class HostingModule { }