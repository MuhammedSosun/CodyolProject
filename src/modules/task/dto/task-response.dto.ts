import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../enums/task-status.enum';

export class TaskResponseDto {
  @ApiProperty()
  id: string;

  // 🔹 YENİ (Task her zaman bir kullanıcıya atanır)
  @ApiProperty()
  assignedUserId: string;

  @ApiProperty()
  createdByUserId: string;

  @ApiProperty({ required: false })
  customerId?: string | null;

  // ✅ EKLENDİ: Proje alanı
  @ApiProperty({ required: false })
  projectId?: string | null;

  // ✅ EKLENDİ: Proje bilgisi (repo include ediyorsa gelir)
  @ApiProperty({
    required: false,
    nullable: true,
    example: { id: 'project-uuid', name: 'CRM Projesi', status: 'ACTIVE' },
  })
  project?: { id: string; name: string; status: string } | null;

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
