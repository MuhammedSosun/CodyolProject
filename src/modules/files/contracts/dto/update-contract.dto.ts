import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { FileStatus } from '@prisma/client';

export class UpdateContractDto {
  @ApiPropertyOptional({ maxLength: 160 })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  title?: string;

  // ✅ Firma değiştirilebilir
  @ApiPropertyOptional({
    description: 'Customer ID (Firma)',
    example: 'b3f2a2d1-3e4f-4f9a-9b12-123456789abc',
  })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  // ✅ Başlangıç tarihi
  @ApiPropertyOptional({
    example: '2026-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  // ✅ Bitiş tarihi
  @ApiPropertyOptional({
    example: '2026-12-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  // ✅ Açıklama
  @ApiPropertyOptional({
    example: 'Güncellenmiş sözleşme açıklaması',
  })
  @IsOptional()
  @IsString()
  description?: string;

  // ✅ Status
  @ApiPropertyOptional({ enum: FileStatus })
  @IsOptional()
  @IsEnum(FileStatus)
  status?: FileStatus;

  /**
   * Eğer file upload yapılmazsa
   * manuel URL güncellenebilir.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fileUrl?: string;
}
