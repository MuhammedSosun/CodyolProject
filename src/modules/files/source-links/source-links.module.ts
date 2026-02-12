import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../prisma/prisma.module';
import { SourceLinksController } from './source-links.controller';
import { SourceLinksService } from './source-links.service';
import { SourceLinksRepository } from './source-links.repository';

@Module({
  imports: [PrismaModule],
  controllers: [SourceLinksController],
  providers: [SourceLinksService, SourceLinksRepository],
  exports: [SourceLinksService],
})
export class SourceLinksModule { }