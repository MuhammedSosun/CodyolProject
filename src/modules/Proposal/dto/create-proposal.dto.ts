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
} from 'class-validator';
import { ProposalStatus } from '@prisma/client';

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

  // ➕ Mevcut yapıya uygun şekilde content (not) alanı eklendi
  @ApiPropertyOptional({
    example: 'Teklif detayları ve notlar buraya gelecek.',
    description: 'Teklif tanımı veya not içeriği',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    example: '150000.00',
    description: 'Teklif toplam tutarı',
  })
  @IsOptional()
  @IsNumberString()
  totalAmount?: string;
}