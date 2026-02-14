import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength, IsUUID } from 'class-validator';
import { FileStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';

export class ContractListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: FileStatus })
  @IsOptional()
  @IsEnum(FileStatus)
  status?: FileStatus;

  @ApiPropertyOptional({
    description: 'Firma (Customer) filtresi',
    example: 'b3f2a2d1-3e4f-4f9a-9b12-123456789abc',
  })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional({ description: 'Başlık içinde arama' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;
}
