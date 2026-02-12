import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { FileStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';

export class LicenseListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: FileStatus })
  @IsOptional()
  @IsEnum(FileStatus)
  status?: FileStatus;

  @ApiPropertyOptional({ description: 'Title içinde arama' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;
}
