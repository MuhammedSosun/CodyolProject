import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateTeamUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
