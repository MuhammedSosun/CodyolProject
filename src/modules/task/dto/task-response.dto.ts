import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../enums/task-status.enum';

export class TaskResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  organizationId: string;

  // 🔹 YENİ (Task her zaman bir kullanıcıya atanır)
  @ApiProperty()
  assignedUserId: string;

  @ApiProperty({ required: false })
  customerId?: string | null;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string | null;

  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  // 🔹 YENİ (UI kolonları)
  @ApiProperty({ required: false })
  startDate?: Date | null;

  @ApiProperty({ required: false })
  endDate?: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
