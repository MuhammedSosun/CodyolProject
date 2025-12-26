import { ApiProperty } from '@nestjs/swagger';
import { OrganizationType } from '../enums/organization-type.enum';

export class OrganizationResponseDto {
    @ApiProperty({ example: 'uuid' })
    id: string;

    @ApiProperty({ example: 'Yapay Zeka Kulübü' })
    name: string;

    @ApiProperty({ example: 'yapay-zeka-kulubu' })
    slug: string;

    @ApiProperty({
        enum: OrganizationType,
        example: OrganizationType.CLUB,
    })
    organizationType: OrganizationType;

    @ApiProperty({
        example: 'FREE',
        description: 'Subscription plan',
    })
    planType: string;

    @ApiProperty({ example: true })
    isActive: boolean;

    @ApiProperty({ example: 'user-123' })
    ownerUserId: string;

    @ApiProperty({ example: '2025-01-01T10:00:00Z' })
    createdAt: Date;

    @ApiProperty({ example: '2025-01-01T10:00:00Z' })
    updatedAt: Date;
}
