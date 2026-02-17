import { IsDateString, IsOptional, IsString, IsIn, IsNumber } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsIn(['WEB', 'MOBIL', 'YAZILIM', 'TASARIM', 'DIGER'])
  type?: string;

  @IsOptional()
  @IsIn(['TEKLIF', 'GELISTIRME', 'TEST'])
  status?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsDateString()
  deliveryDate?: string;
}
