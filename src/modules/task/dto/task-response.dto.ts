import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../enums/task-status.enum';

export class TaskResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    organizationId: string;

    @ApiProperty({ required: false })
    customerId?: string | null;

    @ApiProperty()
    title: string;

    @ApiProperty({ required: false })
    description?: string | null;

    @ApiProperty({ enum: TaskStatus })
    status: TaskStatus;

    @ApiProperty({ required: false })
    dueDate?: Date | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
