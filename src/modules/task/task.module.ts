import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskRepository } from './task.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [ActivityModule], // 🔥 ŞART
  controllers: [TaskController],
  providers: [
    TaskService,
    TaskRepository,
    PrismaService,
  ],
})
export class TaskModule {}
