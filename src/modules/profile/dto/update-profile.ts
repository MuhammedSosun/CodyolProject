import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsDateString } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Ahmet' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Yılmaz' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  lastName?: string;

  @ApiPropertyOptional({ example: '1990-01-01' })
@IsOptional()
@IsDateString()
birthDate?: string;   // 🔥 string olmalı


  @ApiPropertyOptional({ example: 'A Rh+' })
  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @ApiPropertyOptional({ example: 'https://cdn.com/avatar.png' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;


  @ApiPropertyOptional({ example: '2023-01-01' })
@IsOptional()
@IsDateString()
startDate?: string;   // 🔥 string olmalı



  @ApiPropertyOptional({ example: 'Yazılım geliştiriciyim.' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @ApiPropertyOptional({ example: '+90 555...' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'İstanbul, Türkiye' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'İstanbul' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'Senior Developer' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ example: 'IT' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ example: 'TR00 1111...' })
  @IsOptional()
  @IsString()
  iban?: string;

  @ApiPropertyOptional({ example: 'X Bankası' })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({ example: 'Mehmet Yılmaz' })
  @IsOptional()
  @IsString()
  emergencyPerson?: string;

  @ApiPropertyOptional({ example: '+90 544...' })
  @IsOptional()
  @IsString()
  emergencyPhone?: string;
}
