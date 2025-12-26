import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
} from 'class-validator';
import { OrganizationType } from '../enums/organization-type.enum';

export class UpdateOrganizationDto {
    @ApiPropertyOptional({
        example: 'Yeni Organizasyon Adı',
        maxLength: 120,
    })
    @IsOptional()
    @IsString()
    @MaxLength(120)
    name?: string;

    @ApiPropertyOptional({
        example: 'yeni-slug',
        maxLength: 80,
    })
    @IsOptional()
    @IsString()
    @MaxLength(80)
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message:
            'slug sadece küçük harf, sayı ve "-" içermeli (örn: yapay-zeka-kulubu)',
    })
    slug?: string;

    @ApiPropertyOptional({
        enum: OrganizationType,
        example: OrganizationType.COMPANY,
    })
    @IsOptional()
    @IsEnum(OrganizationType)
    organizationType?: OrganizationType;

    @ApiPropertyOptional({ maxLength: 180 })
    @IsOptional()
    @IsString()
    @MaxLength(180)
    legalName?: string;

    @ApiPropertyOptional({ maxLength: 120 })
    @IsOptional()
    @IsString()
    @MaxLength(120)
    industry?: string;

    @ApiPropertyOptional({ maxLength: 200 })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    website?: string;

    @ApiPropertyOptional({ maxLength: 120 })
    @IsOptional()
    @IsEmail()
    @MaxLength(120)
    email?: string;

    @ApiPropertyOptional({ maxLength: 40 })
    @IsOptional()
    @IsString()
    @MaxLength(40)
    phone?: string;
}
