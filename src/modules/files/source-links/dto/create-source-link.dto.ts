import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { SourceLinkType } from '@prisma/client';

export class CreateSourceLinkDto {
  @ApiProperty({ maxLength: 160, example: 'Frontend Repo' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  title: string;

  @ApiProperty({ example: 'https://github.com/codyol/frontend' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ enum: SourceLinkType })
  @IsOptional()
  @IsEnum(SourceLinkType)
  type?: SourceLinkType;
}
