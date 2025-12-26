import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, IsUUID, IsDateString } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';

export class CreateTaskDto {
    @ApiProperty({ example: 'org-uuid' })
    @IsUUID()
    @IsNotEmpty()
    organizationId: string;

    @ApiPropertyOptional({ example: 'customer-uuid' })
    @IsOptional()
    @IsUUID()
    customerId?: string;

    @ApiProperty({ example: 'Teklif hazırlığı' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(160)
    title: string;

    @ApiPropertyOptional({ example: 'XYZ İnşaat için teklif dosyası hazırlanacak.' })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @ApiPropertyOptional({ enum: TaskStatus, example: TaskStatus.OPEN })
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @ApiPropertyOptional({ example: '2025-01-15T17:00:00Z' })
    @IsOptional()
    @IsDateString()
    dueDate?: string;
}
