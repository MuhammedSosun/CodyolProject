import { IsInt, Min } from 'class-validator';

export class MoveColumnDto {
  @IsInt()
  @Min(0)
  newOrder: number;
}
