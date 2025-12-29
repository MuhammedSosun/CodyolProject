import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEnum,
    IsOptional,
    IsString,
    IsDateString,
    MaxLength,
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
}
