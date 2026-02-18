import { ApiProperty } from '@nestjs/swagger';
import { CustomerStatus } from '@prisma/client';

export class CustomerResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    fullName: string;

    @ApiProperty({ required: false })
    email?: string | null;

    @ApiProperty({ required: false })
    phone?: string | null;

    @ApiProperty({ required: false })
    companyName?: string | null;

    @ApiProperty({ required: false })
    vatNumber?: string | null;

    @ApiProperty({ required: false })
    taxOffice?: string | null;

    @ApiProperty({ required: false })
    bankName?: string | null;

    @ApiProperty({ required: false })
    iban?: string | null;

    @ApiProperty()
    status: CustomerStatus;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
