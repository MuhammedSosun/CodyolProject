import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType, PaymentMethod } from '../enums/transaction.enums';
import { IsNumberString } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ enum: TransactionType, example: TransactionType.INCOME })
  @IsEnum(TransactionType)
  type: TransactionType;

  // Prisma Decimal için en güvenlisi string
  @ApiProperty({ example: '12500.00', description: 'Decimal string' })
  @IsNotEmpty()
  @IsNumberString()
  amount: string;

  @ApiPropertyOptional({ example: 'TRY' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
  example: '2026-01-10T00:00:00.000Z',
  description: 'İşlem tarihi',
})
@IsDateString({}, { message: 'Geçerli bir tarih girilmelidir.' })
@IsNotEmpty({ message: 'Tarih zorunludur.' })
date: string;


  @ApiProperty({
  example: 'Web sitesi ödeme',
  description: 'Açıklama',
})
@IsString()
@IsNotEmpty({ message: 'Açıklama zorunludur.' })
description: string;


  @ApiProperty({
  example: 'Satış',
  description: 'İşlem kategorisi',
})
@IsString()
@IsNotEmpty({ message: 'Kategori zorunludur.' })
category: string;


  @ApiProperty({
  enum: PaymentMethod,
  example: PaymentMethod.BANK_TRANSFER,
  description: 'Ödeme yöntemi',
})
@IsEnum(PaymentMethod, {
  message: 'Geçerli bir ödeme yöntemi seçilmelidir.',
})
@IsNotEmpty({ message: 'Ödeme yöntemi zorunludur.' })
paymentMethod: PaymentMethod;


  @ApiPropertyOptional({ example: 'DEKONT-123' })
  @IsOptional()
  @IsString()
  referenceNo?: string;

  @ApiPropertyOptional({ example: 'customer-uuid' })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional({ example: 'proposal-uuid' })
  @IsOptional()
  @IsUUID()
  proposalId?: string;
}
