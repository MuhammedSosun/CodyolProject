import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { TransactionType, PaymentMethod } from '../enums/transaction.enums'; // 👈 Enum'ları buraya da çekiyoruz

export class CreateTransactionDto {
  @ApiProperty({ enum: TransactionType })
  @IsNotEmpty()
  @IsEnum(TransactionType) // 👈 Bu satır sayesinde Swagger ve Backend sadece INCOME/EXPENSE kabul eder
  type: TransactionType;

  @ApiProperty()
  @IsNotEmpty()
<<<<<<< HEAD
  @IsNumber() // Tutarın sayı olmasını zorunlu kılar
  amount: number;
=======
  @IsNumberString()
  amount: string;
  
  @ApiPropertyOptional({ example: '5000.00', description: 'Tahsil Edilen / Ödenen' })
  @IsOptional()
  @IsNumberString()
  paidAmount?: string; // ✅ Yeni

  @ApiPropertyOptional({ example: '2026-03-15T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string; // ✅ Yeni
>>>>>>> odemeekranibackendguncelllendi

  @ApiProperty({ required: false, default: 'TRY' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ enum: PaymentMethod, required: false })
  @IsOptional()
  @IsEnum(PaymentMethod) // 👈 Ödeme yöntemi kontrolü
  paymentMethod?: PaymentMethod;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  referenceNo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  proposalId?: string;
}
