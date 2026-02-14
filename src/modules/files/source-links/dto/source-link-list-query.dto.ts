import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { SourceLinkType } from '@prisma/client';
import { PaginationQueryDto } from '../../../../common/pagination/pagination-query.dto';

export class SourceLinkListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: SourceLinkType })
  @IsOptional()
  @IsEnum(SourceLinkType)
  type?: SourceLinkType;

  @ApiPropertyOptional({ description: 'Başlık içinde arama' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;
}