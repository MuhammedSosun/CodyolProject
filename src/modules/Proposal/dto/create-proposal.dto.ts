import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  MaxLength,
  IsNumberString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProposalStatus } from '@prisma/client';

// Teklif kalemleri için gerekli alt sınıf
export class CreateProposalItemDto {
  @ApiProperty({ example: 'Yazılım Geliştirme' })
  @IsString()
  @IsNotEmpty()
  product: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  qty: number;

  @ApiProperty({ example: 5000 })
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 20 })
  @IsNotEmpty()
  tax: number;
}

export class CreateProposalDto {
  @ApiProperty({
    example: 'Web Sitesi Geliştirme Teklifi',
    description: 'Teklif başlığı',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @ApiProperty({
    example: 'customer-uuid',
    description: 'Teklifin ait olduğu müşteri ID',
  })
  @IsUUID()
  customerId: string;

  @ApiProperty({
    example: '2025-03-01T23:59:59Z',
    description: 'Teklifin geçerlilik tarihi',
  })
  @IsDateString()
  validUntil: string;

  @ApiPropertyOptional({
    enum: ProposalStatus,
    example: ProposalStatus.DRAFT,
    description: 'Teklif durumu (boş bırakılırsa DRAFT)',
  })
  @IsOptional()
  @IsEnum(ProposalStatus)
  status?: ProposalStatus;

  @ApiPropertyOptional({
    example: '150000.00',
    description: 'Teklif toplam tutarı',
  })
  @IsOptional()
  @IsNumberString()
  totalAmount?: string;

  // ✅ Repository'de hata veren eksik alan eklendi:
  @ApiProperty({
    type: [CreateProposalItemDto],
    description: 'Teklif kalemleri listesi',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProposalItemDto)
  items: CreateProposalItemDto[];
}