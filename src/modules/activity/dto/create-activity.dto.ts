import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ActivityType } from '@prisma/client';

export class CreateActivityDto {
    @ApiProperty({ example: 'org-uuid' })
    @IsUUID()
    @IsNotEmpty()
    organizationId: string;

    @ApiPropertyOptional({ example: 'customer-uuid' })
    @IsOptional()
    @IsUUID()
    customerId?: string;

    @ApiPropertyOptional({ example: 'task-uuid' })
    @IsOptional()
    @IsUUID()
    taskId?: string;

    @ApiProperty({ enum: ActivityType, example: ActivityType.CALL })
    @IsEnum(ActivityType)
    type: ActivityType;

    @ApiProperty({ example: 'Telefon görüşmesi yapıldı', maxLength: 160 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(160)
    title: string;

    @ApiPropertyOptional({ example: 'Müşteriyle fiyat konuşuldu', maxLength: 1000 })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;
}
