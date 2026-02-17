import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'eski_sifre_123' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: 'yeni_sifre_456' })
  @IsString()
  @MinLength(6, { message: 'Yeni şifre en az 6 karakter olmalıdır.' })
  newPassword: string;
}