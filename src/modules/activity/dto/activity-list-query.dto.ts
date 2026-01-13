import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ActivityType } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class ActivityListQueryDto extends PaginationQueryDto {
   

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    customerId?: string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    taskId?: string;

    @ApiPropertyOptional({ enum: ActivityType })
    @IsOptional()
    @IsEnum(ActivityType)
    type?: ActivityType;
}
