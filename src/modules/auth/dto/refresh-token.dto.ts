import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
    @ApiProperty({
        example: 'b8c9d9d0-4b4a-4a7f-9d35-123456789abc',
        description: 'Refresh token',
    })
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}
