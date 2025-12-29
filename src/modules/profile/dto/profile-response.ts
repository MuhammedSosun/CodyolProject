import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
    @ApiProperty({ example: 'profile-uuid' })
    id: string;

    @ApiProperty({ example: 'user-uuid' })
    userId: string;

    @ApiProperty({ example: 'Ahmet', required: false })
    firstName?: string | null;

    @ApiProperty({ example: 'Yılmaz', required: false })
    lastName?: string | null;

    @ApiProperty({ example: 'ahmet@company.com', required: false })
    email?: string | null;

    @ApiProperty({ example: '+90 555 123 45 67', required: false })
    phone?: string | null;

    @ApiProperty({ example: 'Sales Manager', required: false })
    position?: string | null;

    @ApiProperty({
        example: 'CRM süreçlerinden sorumluyum.',
        required: false,
    })
    bio?: string | null;

    @ApiProperty({ example: '2025-01-01T10:00:00Z' })
    createdAt: Date;

    @ApiProperty({ example: '2025-01-05T12:30:00Z' })
    updatedAt: Date;
}
