import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CustomerStatus } from '../enums/customer-status.enum';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class CustomerListQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({ example: 'org-uuid' })
    @IsOptional()
    @IsString()
    organizationId?: string;

    @ApiPropertyOptional({ enum: CustomerStatus })
    @IsOptional()
    @IsEnum(CustomerStatus)
    status?: CustomerStatus;

    @ApiPropertyOptional({ example: 'mehmet' })
    @IsOptional()
    @IsString()
    search?: string; // name/email search
}
