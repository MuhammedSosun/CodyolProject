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
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Task')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('api/tasks')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateTaskDto) {
    return this.service.create(dto, req.user.id); // req.user.id = creator (admin)
  }

  @Get()
  list(@Req() req, @Query() query: any) {
    return this.service.list(req.user.id, query);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.service.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.service.update(id, req.user.id, dto);
  }

  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.service.delete(id, req.user.id);
  }
}
