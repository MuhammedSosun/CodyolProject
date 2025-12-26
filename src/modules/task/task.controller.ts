import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('Task')
@Controller('tasks')
export class TaskController {
    constructor(private readonly service: TaskService) { }

    @Post()
    @ApiOperation({ summary: 'Create task' })
    create(@Body() dto: CreateTaskDto) {
        return this.service.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'List tasks (advanced)' })
    list(@Query() query: any) {
        return this.service.list(query);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update task' })
    update(
        @Param('id') id: string,
        @Query('organizationId') organizationId: string,
        @Body() dto: UpdateTaskDto,
    ) {
        return this.service.update(id, organizationId, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete task (soft)' })
    delete(
        @Param('id') id: string,
        @Query('organizationId') organizationId: string,
    ) {
        return this.service.delete(id, organizationId);
    }
}
