import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [PrismaModule, ActivityModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule { }
