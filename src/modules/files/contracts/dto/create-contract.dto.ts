import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { FileStatus } from '@prisma/client';

export class CreateContractDto {
  @ApiProperty({
    maxLength: 160,
    example: 'Hizmet Sözleşmesi',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  title: string;

  // ✅ Firma
  @ApiPropertyOptional({
    description: 'Customer ID (Firma)',
    example: 'b3f2a2d1-3e4f-4f9a-9b12-123456789abc',
  })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  // ✅ Başlangıç Tarihi
  @ApiPropertyOptional({
    example: '2026-01-01',
    description: 'ISO format date string',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  // ✅ Bitiş Tarihi
  @ApiPropertyOptional({
    example: '2026-12-31',
    description: 'ISO format date string',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  // ✅ Açıklama
  @ApiPropertyOptional({
    example: 'Bu sözleşme 1 yıl geçerlidir.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  // ✅ Status (ACTIVE / INACTIVE)
  @ApiPropertyOptional({ enum: FileStatus })
  @IsOptional()
  @IsEnum(FileStatus)
  status?: FileStatus;

  /**
   * Eğer frontend dosya yüklemiyorsa
   * direkt URL gönderebilir (opsiyonel yaptık).
   * File upload varsa buna gerek yok.
   */
  @ApiPropertyOptional({
    example: 'https://cdn.site.com/contracts/abc.pdf',
  })
  @IsOptional()
  @IsString()
  fileUrl?: string;
}
