import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { CustomerStatus } from '../enums/customer-status.enum';

export class UpdateCustomerDto {
    @ApiPropertyOptional({ maxLength: 80 })
    @IsOptional()
    @IsString()
    @MaxLength(80)
    firstName?: string;

    @ApiPropertyOptional({ maxLength: 80 })
    @IsOptional()
    @IsString()
    @MaxLength(80)
    lastName?: string;

    @ApiPropertyOptional({ example: 'ahmet@example.com' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ maxLength: 40 })
    @IsOptional()
    @IsString()
    @MaxLength(40)
    phone?: string;

    @ApiPropertyOptional({ enum: CustomerStatus })
    @IsOptional()
    @IsEnum(CustomerStatus)
    status?: CustomerStatus;
}
