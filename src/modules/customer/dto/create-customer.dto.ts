import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { CustomerStatus } from '../enums/customer-status.enum';

export class CreateCustomerDto {
    @ApiProperty({ example: 'org-uuid' })
    @IsString()
    @IsNotEmpty()
    organizationId: string;

    @ApiProperty({ example: 'Ahmet', maxLength: 80 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(80)
    firstName: string;

    @ApiProperty({ example: 'Yılmaz', maxLength: 80 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(80)
    lastName: string;

    @ApiPropertyOptional({ example: 'ahmet@example.com' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: '+90 555 555 55 55', maxLength: 40 })
    @IsOptional()
    @IsString()
    @MaxLength(40)
    phone?: string;

    @ApiPropertyOptional({ enum: CustomerStatus, example: CustomerStatus.LEAD })
    @IsOptional()
    @IsEnum(CustomerStatus)
    status?: CustomerStatus;
}
