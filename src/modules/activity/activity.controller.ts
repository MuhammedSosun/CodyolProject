import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivityListQueryDto } from './dto/activity-list-query.dto';

@ApiTags('Activity')
@Controller('activities')
export class ActivityController {
    constructor(private readonly service: ActivityService) { }

    @Post()
    @ApiOperation({ summary: 'Create activity' })
    create(@Body() dto: CreateActivityDto) {
        return this.service.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'List activities (timeline)' })
    list(@Query() query: ActivityListQueryDto) {
        return this.service.list(query);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete activity (soft)' })
    delete(
        @Param('id') id: string,
        @Query('organizationId') organizationId: string,
    ) {
        return this.service.delete(id, organizationId);
    }
}
