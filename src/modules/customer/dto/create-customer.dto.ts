import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, IsUrl, Matches, MaxLength } from 'class-validator';
import { CustomerStatus } from '@prisma/client';

export class CreateCustomerDto {
    @ApiPropertyOptional({ maxLength: 160 })
    @IsString()
    @MaxLength(160)
    fullName: string;

    @ApiProperty({
  example: 'ornek@firma.com',
  description: 'Müşteri email adresi (zorunlu)',
})
@IsEmail({}, { message: 'Geçerli bir email adresi giriniz' })
email: string;


    @ApiPropertyOptional({
  example: '+905551112233',
  description: 'Telefon numarası E.164 formatında',
})
@IsOptional()
@Matches(/^\+?[1-9]\d{7,14}$/, {
  message: 'Telefon numarası geçerli bir formatta değil',
})
phone?: string;


    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    companyName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    vatNumber?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    taxOffice?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    bankName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    iban?: string;

   

@ApiPropertyOptional({
  example: 'codyol.com.tr',
  description: 'Geçerli bir domain (www ve http zorunlu değil)',
})
@IsOptional()
@Matches(
  /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
  {
    message: 'Website geçerli bir domain formatında olmalıdır',
  },
)
website?: string;





    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({ maxLength: 1000 })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    designation?: string;

    @ApiPropertyOptional({ enum: CustomerStatus })
    @IsOptional()
    @IsEnum(CustomerStatus)
    status?: CustomerStatus;
}