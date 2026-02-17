import { IsDateString, IsOptional, IsString, IsIn, IsNumber } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  customerId?: string | null;

  @IsOptional()
  @IsIn(['WEB', 'MOBIL', 'YAZILIM', 'TASARIM', 'DIGER'])
  type?: string;

  @IsOptional()
  @IsIn(['TEKLIF', 'GELISTIRME', 'TEST'])
  status?: string;

  @IsOptional()
  @IsNumber()
  price?: number | null;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsDateString()
  deliveryDate?: string | null;
}
