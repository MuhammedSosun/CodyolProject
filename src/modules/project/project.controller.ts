import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ListProjectDto } from './dto/list-project.dto';

@ApiTags('Projects')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/projects')
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  // 👀 Herkes okuyabilir (USER dahil)
  @Get()
  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  list(@Query() dto: ListProjectDto) {
    return this.service.list(dto);
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  // ✏️ Sadece adminler yazabilir
  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  create(@Body() dto: CreateProjectDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
