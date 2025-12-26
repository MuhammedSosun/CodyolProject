import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
} from 'class-validator';
import { OrganizationType } from '../enums/organization-type.enum';

export class CreateOrganizationDto {
    @ApiProperty({
        example: 'Codyol Yazılım A.Ş.',
        description: 'Organizasyonun görünen adı',
        maxLength: 120,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    name: string;

    @ApiProperty({
        example: 'codyol-yazilim',
        description: 'URL ve sistem içi kullanım için benzersiz organizasyon anahtarı',
        maxLength: 80,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(80)
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message:
            'slug sadece küçük harf, sayı ve "-" içermeli (örn: codyol-yazilim)',
    })
    slug: string;

    @ApiProperty({
        enum: OrganizationType,
        example: OrganizationType.COMPANY,
        description: 'Organizasyonun tipi',
    })
    @IsEnum(OrganizationType)
    organizationType: OrganizationType;

    @ApiPropertyOptional({
        example: 'Codyol Yazılım ve Teknoloji Anonim Şirketi',
        description: 'Resmi / ticari ünvan',
        maxLength: 180,
    })
    @IsOptional()
    @IsString()
    @MaxLength(180)
    legalName?: string;

    @ApiPropertyOptional({
        example: 'Software & Technology',
        description: 'Faaliyet gösterilen sektör',
        maxLength: 120,
    })
    @IsOptional()
    @IsString()
    @MaxLength(120)
    industry?: string;

    @ApiPropertyOptional({
        example: 'https://www.codyol.com',
        description: 'Kurumsal web sitesi',
        maxLength: 200,
    })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    website?: string;

    @ApiPropertyOptional({
        example: 'info@codyol.com',
        description: 'Kurumsal e-posta adresi',
        maxLength: 120,
    })
    @IsOptional()
    @IsEmail()
    @MaxLength(120)
    email?: string;

    @ApiPropertyOptional({
        example: '+90 216 000 00 00',
        description: 'İletişim telefonu',
        maxLength: 40,
    })
    @IsOptional()
    @IsString()
    @MaxLength(40)
    phone?: string;

    @ApiProperty({
        example: 'auth-user-uuid',
        description: 'Organizasyonu oluşturan kullanıcı (Auth servisinden gelir)',
    })
    @IsString()
    @IsNotEmpty()
    ownerUserId: string;
}
