import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsUUID, ArrayUnique } from "class-validator";

export class UpdateTeamMembersDto {
  @ApiProperty({
    example: [
      "c3c7b9a4-9d6e-4b8c-9c2e-1f7e4f0d1234"
    ],
    description: "Eklenecek / çıkarılacak kullanıcı ID listesi",
  })
  @IsArray()
  @ArrayUnique()
  @IsUUID("4", { each: true })
  memberIds: string[];
}
