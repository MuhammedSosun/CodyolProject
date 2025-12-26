import { ApiProperty } from '@nestjs/swagger';
import { ActivityType } from '@prisma/client';

export class ActivityResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    organizationId: string;

    @ApiProperty({ required: false })
    customerId?: string | null;

    @ApiProperty({ required: false })
    taskId?: string | null;

    @ApiProperty({ enum: ActivityType })
    type: ActivityType;

    @ApiProperty()
    title: string;

    @ApiProperty({ required: false })
    description?: string | null;

    @ApiProperty()
    createdAt: Date;
}
