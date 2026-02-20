import { UseGuards } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsArray, IsUUID, ArrayUnique } from 'class-validator';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class UpdateTeamMembersDto {
  @ApiProperty({
    example: ['c3c7b9a4-9d6e-4b8c-9c2e-1f7e4f0d1234'],
    description: 'Eklenecek / çıkarılacak kullanıcı ID listesi',
  })
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  memberIds: string[];
}
