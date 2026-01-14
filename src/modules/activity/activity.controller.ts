import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ActivityListQueryDto } from './dto/activity-list-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiBearerAuth('JWT-auth')
@ApiTags('Activity')
@UseGuards(JwtAuthGuard)
@Controller('api/activities')
export class ActivityController {
  constructor(private readonly service: ActivityService) {}

  @Post()
  @ApiOperation({ summary: 'Create activity' })
  create(@Req() req, @Body() dto: CreateActivityDto) {
    return this.service.create(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List activities (timeline)' })
  list(@Req() req, @Query() query: ActivityListQueryDto) {
    return this.service.list(req.user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity detail' })
  getById(@Req() req, @Param('id') id: string) {
    return this.service.getById(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update activity' })
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateActivityDto,
  ) {
    return this.service.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete activity (soft)' })
  delete(@Req() req, @Param('id') id: string) {
    return this.service.delete(id, req.user.id);
  }
}