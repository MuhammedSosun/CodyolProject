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
  @ApiProperty({ example: 'org-uuid' })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  // 🔹 YENİ (zorunlu – Prisma’ya göre)
  @ApiProperty({ example: 'user-uuid', description: 'Sorumlu kullanıcı' })
  @IsUUID()
  @IsNotEmpty()
  assignedUserId: string;

  @ApiPropertyOptional({ example: 'customer-uuid' })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiProperty({ example: 'Teklif hazırlığı' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  title: string;

  @ApiPropertyOptional({
    example: 'XYZ İnşaat için teklif dosyası hazırlanacak.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  // 🔁 OPEN → NEW
  @ApiPropertyOptional({ enum: TaskStatus, example: TaskStatus.NEW })
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
}
