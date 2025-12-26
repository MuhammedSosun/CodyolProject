import { ApiProperty } from '@nestjs/swagger';
import { CustomerStatus } from '../enums/customer-status.enum';

export class CustomerResponseDto {
    @ApiProperty({ example: 'uuid' })
    id: string;

    @ApiProperty({ example: 'org-uuid' })
    organizationId: string;

    @ApiProperty({ example: 'Ahmet' })
    firstName: string;

    @ApiProperty({ example: 'Yılmaz' })
    lastName: string;

    @ApiProperty({ example: 'ahmet@example.com', required: false })
    email?: string | null;

    @ApiProperty({ example: '+90 555 555 55 55', required: false })
    phone?: string | null;

    @ApiProperty({ enum: CustomerStatus, example: CustomerStatus.LEAD })
    status: CustomerStatus;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
