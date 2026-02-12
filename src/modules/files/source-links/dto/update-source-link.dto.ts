import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { SourceLinkType } from '@prisma/client';

export class UpdateSourceLinkDto {
  @ApiPropertyOptional({ maxLength: 160 })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({ enum: SourceLinkType })
  @IsOptional()
  @IsEnum(SourceLinkType)
  type?: SourceLinkType;
}