import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength, IsDateString, IsUUID } from 'class-validator';
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

    @ApiPropertyOptional({ example: '2025-01-20T17:00:00Z' })
    @IsOptional()
    @IsDateString()
    dueDate?: string;

    @ApiPropertyOptional({ example: 'customer-uuid' })
    @IsOptional()
    @IsUUID()
    customerId?: string | null;
}
