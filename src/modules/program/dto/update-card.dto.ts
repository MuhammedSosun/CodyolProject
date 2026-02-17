import { IsOptional, IsString } from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  assigneeUserId?: string | null;
}
