import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString, IsUUID, ArrayUnique } from "class-validator";

export class CreateTeamDto {
  @ApiProperty({
    example: "Frontend Ekibi",
    description: "Oluşturulacak ekibin adı",
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: [
    ],
    description: "Ekipte yer alacak kullanıcıların ID listesi",
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID("4", { each: true })
  memberIds?: string[];
}
