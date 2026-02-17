import { IsOptional, IsString } from 'class-validator';

export class CreateProgramCardDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  assigneeUserId?: string;
}
