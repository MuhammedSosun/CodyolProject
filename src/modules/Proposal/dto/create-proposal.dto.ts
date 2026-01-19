import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  MaxLength,
  IsDecimal,
  IsNumberString,
} from 'class-validator';
import { ProposalStatus } from '@prisma/client';

export class CreateProposalDto {
  @ApiProperty({
    example: 'Web Sitesi Geliştirme Teklifi',
    description: 'Teklif başlığı',
    maxLength: 150,
    required: true,
  })
  @IsString({ message: 'Teklif başlığı metin olmalıdır.' })
  @IsNotEmpty({ message: 'Teklif başlığı zorunludur.' })
  @MaxLength(150, {
    message: 'Teklif başlığı en fazla 150 karakter olabilir.',
  })
  title: string;

  @ApiProperty({
  example: 'c1a2b3c4-1234-4567-890a-bcdef1234567',
  description: 'Teklifin ait olduğu müşteri ID',
})
@IsUUID('4', { message: 'Geçerli bir müşteri ID girilmelidir.' })
@IsNotEmpty({ message: 'Müşteri seçilmelidir.' })
customerId: string;


  @ApiProperty({
    example: '2025-03-01T23:59:59Z',
    description: 'Teklifin geçerlilik tarihi',
    required: true,
  })
  @IsDateString({}, { message: 'Geçerli bir tarih girilmelidir.' })
  @IsNotEmpty({ message: 'Geçerlilik tarihi zorunludur.' })
  validUntil: string;

  @ApiProperty({
    enum: ProposalStatus,
    example: ProposalStatus.DRAFT,
    description: 'Teklif durumu',
  })
  @IsEnum(ProposalStatus, {
    message: 'Geçerli bir teklif durumu seçilmelidir.',
  })
  status: ProposalStatus;

  @ApiProperty({
  example: '150000.00',
  description: 'Teklif toplam tutarı',
  required: true,
})
@IsNotEmpty({ message: 'Teklif toplam tutarı zorunludur.' })
@IsNumberString({}, { message: 'Teklif toplam tutarı sayı olmalıdır.' })
totalAmount: string;



}