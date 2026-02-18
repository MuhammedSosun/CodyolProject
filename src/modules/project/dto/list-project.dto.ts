import { IsIn, IsOptional, IsString } from 'class-validator';

export type ProjectStatusQuery = 'all' | 'teklif' | 'gelistirme' | 'test';

export class ListProjectDto {
  @IsOptional()
  @IsIn(['all', 'teklif', 'gelistirme', 'test'])
  status?: ProjectStatusQuery = 'all';

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional() // ✅ Müşteri bazlı filtreleme için eklendi
  @IsString()
  customerId?: string;
}
