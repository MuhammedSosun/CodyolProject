import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'admin' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: 'admin@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: '123456' })
    @IsString()
    @MinLength(6)
    password: string;
}
