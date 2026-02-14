import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { FileStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../../common/pagination/pagination-query.dto';

export class ContractListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: FileStatus })
  @IsOptional()
  @IsEnum(FileStatus)
  status?: FileStatus;

  @ApiPropertyOptional({ description: 'Başlık içinde arama' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @ApiPropertyOptional({ description: 'Customer ID ile filtre' })
  @IsOptional()
  @IsString()
  customerId?: string;
}
