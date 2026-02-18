import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';

export class CreateTaskDto {
  @ApiProperty({
    example: 'user-uuid',
    description: 'Görevin atanacağı kullanıcı',
  })
  @IsUUID()
  assignedUserId: string;

  @ApiPropertyOptional({ example: 'customer-uuid' })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  // ✅ FIX: Project.id = cuid() olduğu için UUID değil
  @ApiPropertyOptional({ example: 'project-cuid' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  projectId?: string;

  @ApiProperty({ example: 'Teklif hazırlığı' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  title: string;

  @ApiPropertyOptional({
    example: 'Teklif hazırlık süreci açıklaması',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
    example: TaskStatus.NEW,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ example: '2025-01-10' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2025-01-20' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
