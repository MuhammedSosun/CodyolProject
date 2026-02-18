import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectListQueryDto } from './dto/project-list-query.dto';

@ApiTags('Project')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('api/projects')
export class ProjectController {
  constructor(private readonly service: ProjectService) { }

  @Get()
  list(@Req() req, @Query() query: ProjectListQueryDto) {
    return this.service.list(req.user.id, query);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateProjectDto) {
    return this.service.create(req.user.id, dto);
  }
}
