import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../enums/task-status.enum';

export class TaskResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  assignedUserId: string;

  @ApiProperty()
  createdByUserId: string;

  @ApiProperty({ required: false })
  customerId?: string | null;

  @ApiProperty({ required: false })
  projectId?: string | null;

  @ApiProperty({ required: false, type: Object })
  project?: { id: string; name: string } | null;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string | null;

  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty({ required: false })
  startDate?: Date | null;

  @ApiProperty({ required: false })
  endDate?: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
