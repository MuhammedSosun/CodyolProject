import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsIn } from 'class-validator';
import { ProposalStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/pagination/pagination-query.dto';

export class ProposalListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: ['createdAt', 'updatedAt', 'title', 'status'],
    example: 'createdAt',
  })
  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'title', 'status'])
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'status';

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  @ApiPropertyOptional({
    enum: ProposalStatus,
    example: ProposalStatus.SENT,
  })
  @IsOptional()
  @IsEnum(ProposalStatus)
  status?: ProposalStatus;

  @ApiPropertyOptional({
    example: 'web',
    description: 'Teklif başlığı veya müşteri adına göre arama',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
