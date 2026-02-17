import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TransactionType } from '../enums/transaction.enums';
import { PaginationQueryDto } from '../../../common/pagination/pagination-query.dto'; // yolu sende nasılsa ona göre düzelt
import { PaymentMethod } from '@prisma/client';

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

  @ApiPropertyOptional({ example: '2026-02-01' })
  @IsOptional()
  @IsString()
  dueDateFrom?: string;

  @ApiPropertyOptional({ example: '2026-02-28' })
  @IsOptional()
  @IsString()
  dueDateTo?: string;

  @ApiPropertyOptional({ example: 'OVERDUE' })
  @IsOptional()
  @IsString()
  dueStatus?: 'OVERDUE' | 'PENDING' | 'PAID';

  @ApiPropertyOptional({ example: 'Satış' })
  @IsOptional()
  @IsString()
  category?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({ example: '1000' })
  @IsOptional()
  @IsNumberString()
  minAmount?: string;

  @ApiPropertyOptional({ example: '5000' })
  @IsOptional()
  @IsNumberString()
  maxAmount?: string;

  @ApiPropertyOptional({ example: 'true' })
  @IsOptional()
  isPaid?: string; // boolean string olarak al

  @ApiPropertyOptional({ example: 'web' })
  @IsOptional()
  @IsString()
  q?: string;
}
