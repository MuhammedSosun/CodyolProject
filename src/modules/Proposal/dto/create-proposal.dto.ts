import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  MaxLength,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProposalStatus } from '@prisma/client';

// Teklif kalemleri - Prisma şemasıyla tam uyumlu hale getirildi
export class CreateProposalItemDto {
  @ApiProperty({ example: 'Yazılım Geliştirme', description: 'Ürün veya hizmet adı' })
  @IsString()
  @IsNotEmpty()
  description: string; // Prisma: description

  @ApiProperty({ example: 1 })
  @IsNumber() // Sayısal doğrulama eklendi
  @IsNotEmpty()
  quantity: number; // Prisma: quantity

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @IsNotEmpty()
  unitPrice: number; // Prisma: unitPrice

  @ApiProperty({ example: 20, default: 20 })
  @IsNumber()
  @IsNotEmpty()
  taxRate: number; // Prisma: taxRate
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
  @IsString() // @IsNumberString yerine IsString daha güvenli olabilir Decimal için
  totalAmount?: string;

  @ApiProperty({
    type: [CreateProposalItemDto],
    description: 'Teklif kalemleri listesi',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProposalItemDto)
  items: CreateProposalItemDto[];
}