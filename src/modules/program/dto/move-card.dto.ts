import { IsInt, IsString, Min } from 'class-validator';

export class MoveCardDto {
  @IsString()
  toColumnId: string;

  @IsInt()
  @Min(0)
  newOrder: number;
}
