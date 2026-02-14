import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TransactionType } from '../enums/transaction.enums';
import { PaginationQueryDto } from '../../../common/pagination/pagination-query.dto'; // yolu sende nasılsa ona göre düzelt

export class TransactionListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: TransactionType,
    example: TransactionType.INCOME,
  })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @ApiPropertyOptional({ example: '2026-01-31' })
  @IsOptional()
  @IsString()
  dateTo?: string;

  @ApiPropertyOptional({ example: 'Satış' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'web' })
  @IsOptional()
  @IsString()
  q?: string;
}
