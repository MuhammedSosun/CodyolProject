import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEnum,
    IsOptional,
    IsString,
    IsDateString,
    MaxLength,
    IsNumber,
} from 'class-validator';
import { ProposalStatus } from '@prisma/client';

export class UpdateProposalDto {
    @ApiPropertyOptional({
        example: 'Güncellenmiş Teklif Başlığı',
        maxLength: 150,
    })
    @IsOptional()
    @IsString()
    @MaxLength(150)
    title?: string;

    // ➕ Müşteri değişimi için eklendi
    @ApiPropertyOptional({ example: 'customer-uuid' })
    @IsOptional()
    @IsString()
    customerId?: string; 

    @ApiPropertyOptional({
        example: '2025-04-01T23:59:59Z',
        description: 'Yeni geçerlilik tarihi',
    })
    @IsOptional()
    @IsDateString()
    validUntil?: string;

    @ApiPropertyOptional({
        enum: ProposalStatus,
        example: ProposalStatus.SENT,
        description: 'Teklif durumu',
    })
    @IsOptional()
    @IsEnum(ProposalStatus)
    status?: ProposalStatus;

    // ➕ Tanım (Not) içeriği için eklendi
    @ApiPropertyOptional({ example: '<h1>Teklif Detayı</h1>' })
    @IsOptional()
    @IsString()
    content?: string; 

    @ApiPropertyOptional({
        example: 175000.50,
        description: 'Teklif toplam tutarı',
    })
    @IsOptional()
    @IsNumber()
    totalAmount?: number;
}