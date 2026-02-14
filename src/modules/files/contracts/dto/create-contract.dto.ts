import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { FileStatus } from '@prisma/client';

export class CreateContractDto {
  @ApiProperty({ maxLength: 160, example: 'Hizmet Sözleşmesi' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  title: string;

  // file upload varsa zorunlu olmamalı
  @ApiPropertyOptional({ example: 'https://cdn.site.com/contracts/abc.pdf' })
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiPropertyOptional({ description: 'Müşteri ID' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: '2026-02-14' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: FileStatus })
  @IsOptional()
  @IsEnum(FileStatus)
  status?: FileStatus;
}
