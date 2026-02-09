import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  MaxLength,
  IsNumber,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProposalStatus } from '@prisma/client';
import { CreateProposalItemDto } from './create-proposal.dto'; // Kalem yapısını buradan alıyoruz

export class UpdateProposalDto {
  @ApiPropertyOptional({
    example: 'Güncellenmiş Teklif Başlığı',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  // ✅ Repository'de hata veren eksik alan: customerId
  @ApiPropertyOptional({
    example: 'customer-uuid',
    description: 'Yeni müşteri ID',
  })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional({
    example: '2025-04-01T23:59:59Z',
    description: 'Yeni geçerlilik tarihi',
  })
  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @ApiPropertyOptional({
    enum: ProposalStatus,
    example: ProposalStatus.SENT,
    description: 'Teklif durumu',
  })
  @IsOptional()
  @IsEnum(ProposalStatus)
  status?: ProposalStatus;

  @ApiPropertyOptional({
    example: 175000.50,
    description: 'Teklif toplam tutarı',
  })
  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  // ✅ Repository'de hata veren eksik alan: items
  @ApiPropertyOptional({
    type: [CreateProposalItemDto],
    description: 'Teklif kalemleri listesi',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProposalItemDto)
  items?: CreateProposalItemDto[];
}