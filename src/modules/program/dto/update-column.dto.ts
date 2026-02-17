import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProgramColumnDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
