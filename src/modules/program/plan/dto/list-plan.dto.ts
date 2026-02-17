import { IsOptional, IsString } from 'class-validator';

export type TimeFilterQuery = 'today' | 'week' | 'month' | 'all';

/**
 * Frontend dropdown:
 * Tümü, Sıradaki işler, Yapılıyor, Beklemede, Tamamlanan
 *
 * Biz burada hem TR label/slug hem enum kabul ediyoruz.
 */
export type PlanStatusQuery =
  | 'all'
  | 'tumu'
  | 'Tümü'
  | 'siradaki-isler'
  | 'Sıradaki işler'
  | 'yapiliyor'
  | 'Yapılıyor'
  | 'beklemede'
  | 'Beklemede'
  | 'tamamlanan'
  | 'Tamamlanan'
  | 'NEXT'
  | 'IN_PROGRESS'
  | 'WAITING'
  | 'DONE';

export class ListPlanDto {
  @IsOptional()
  @IsString()
  time?: TimeFilterQuery;

  @IsOptional()
  @IsString()
  status?: PlanStatusQuery;

  @IsOptional()
  @IsString()
  q?: string;
}
