import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class UpdateProfileDto {
    @ApiPropertyOptional({ example: 'Ahmet' })
    @IsOptional()
    @IsString()
    @MaxLength(80)
    firstName?: string;

    @ApiPropertyOptional({ example: 'Yılmaz' })
    @IsOptional()
    @IsString()
    @MaxLength(80)
    lastName?: string;



    @ApiPropertyOptional({ example: '+90 555 123 45 67' })
    @IsOptional()
    @IsString()
    @MaxLength(40)
    phone?: string;

    @ApiPropertyOptional({ example: 'Sales Manager' })
    @IsOptional()
    @IsString()
    @MaxLength(120)
    position?: string;

    @ApiPropertyOptional({
        example: 'CRM süreçlerinden sorumluyum.',
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    bio?: string;
}
