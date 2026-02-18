import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export enum ProjectStatusDto {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class CreateProjectDto {
  @ApiProperty({ example: 'Duralux Web Projesi' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name: string;

  @ApiPropertyOptional({ example: 'Web tarafı geliştirme işleri' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ enum: ProjectStatusDto, example: ProjectStatusDto.ACTIVE })
  @IsOptional()
  @IsEnum(ProjectStatusDto)
  status?: ProjectStatusDto;
}
