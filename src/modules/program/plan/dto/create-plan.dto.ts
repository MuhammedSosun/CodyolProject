import { IsDateString, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export enum ProgramStatus {
  NEXT = 'NEXT', // Sıradaki işler
  IN_PROGRESS = 'IN_PROGRESS', // Yapılıyor
  WAITING = 'WAITING', // Beklemede
  DONE = 'DONE', // Tamamlanan
}

export enum ProgramType {
  MOBIL = 'MOBIL',
  WEB = 'WEB',
  TASARIM = 'TASARIM',
  BACKEND = 'BACKEND',
  FRONTEND = 'FRONTEND',
  DIGER = 'DIGER',
}

export enum ProgramStage {
  ANALIZ = 'ANALIZ',
  TASARIM = 'TASARIM',
  KODLAMA = 'KODLAMA',
  TEST = 'TEST',
  YAYIN = 'YAYIN',
  DIGER = 'DIGER',
}

export class CreatePlanDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsEnum(ProgramType)
  @IsOptional()
  type?: ProgramType;

  @IsString()
  @IsOptional()
  projectName?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(ProgramStage)
  @IsOptional()
  stage?: ProgramStage;

  @IsEnum(ProgramStatus)
  @IsOptional()
  status?: ProgramStatus;

  @IsString()
  @IsOptional()
  assigneeId?: string;
}
