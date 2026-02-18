import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Teklif revizyonu' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  // 🔹 YENİ (UI kolonları)
  @ApiPropertyOptional({ example: '2025-01-10' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2025-01-20' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  // 🔹 YENİ (atanan kullanıcı değiştirilebilir)
  @ApiPropertyOptional({ example: 'user-uuid' })
  @IsOptional()
  @IsUUID()
  assignedUserId?: string;

  @ApiPropertyOptional({ example: 'customer-uuid' })
  @IsOptional()
  @IsUUID()
  customerId?: string | null;

  // ✅ EKLENDİ: proje değiştirilebilir (null gönderilirse disconnect)
  @ApiPropertyOptional({ example: 'project-uuid' })
  @IsOptional()
  @IsUUID()
  projectId?: string | null;
}
