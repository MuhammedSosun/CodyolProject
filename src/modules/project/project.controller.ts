import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ListProjectDto } from './dto/list-project.dto';

@ApiTags('Projects')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('api/projects')
export class ProjectController {
    constructor(private readonly service: ProjectService) { }

    @Get()
    list(@Query() dto: ListProjectDto) {
        return this.service.list(dto);
    }

    @Get(':id')
    getById(@Param('id') id: string) {
        return this.service.getById(id);
    }


    @Post()
    create(@Body() dto: CreateProjectDto) {
        return this.service.create(dto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
