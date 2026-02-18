import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectRepository } from './project.repository';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository, PrismaService],
  exports: [ProjectService],
})
export class ProjectModule { }
