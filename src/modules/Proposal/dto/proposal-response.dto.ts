import { ApiProperty } from '@nestjs/swagger';
import { ProposalStatus } from '@prisma/client';

export class ProposalResponseDto {
    @ApiProperty({ example: 'proposal-uuid' })
    id: string;

    @ApiProperty({ example: 'Web Sitesi Geliştirme Teklifi' })
    title: string;

    @ApiProperty({
        enum: ProposalStatus,
        example: ProposalStatus.DRAFT,
    })
    status: ProposalStatus;

    @ApiProperty({
        example: '2025-03-01T23:59:59Z',
    })
    validUntil: Date;

    @ApiProperty({
        example: '150000.00',
        nullable: true,
    })
    totalAmount: string | null;

    @ApiProperty({
        example: 'TRY',
    })
    currency: string;

    @ApiProperty({
        example: '2025-01-01T10:00:00Z',
    })
    createdAt: Date;

    @ApiProperty({
        example: '2025-01-01T10:00:00Z',
    })
    updatedAt: Date;
}
