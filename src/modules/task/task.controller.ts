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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Task')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard) // 🔐 TÜM ENDPOINTLER KORUMALI
@Controller('tasks')
export class TaskController {
  constructor(private readonly service: TaskService) { }

  // 🔹 CREATE
  @Post()
  @ApiOperation({ summary: 'Create task' })
  create(
    @Req() req,
    @Body() dto: CreateTaskDto,
  ) {
    return this.service.create(
      dto,
      req.user.organizationId,
      req.user.id,
    );
  }

  // 🔹 LIST (advanced)
  @Get()
  @ApiOperation({ summary: 'List tasks (advanced)' })
  list(
    @Req() req,
    @Query() query: any,
  ) {
    return this.service.list(
      req.user.organizationId,
      query,
    );
  }

  // 🔹 GET BY ID
  @Get(':id')
  @ApiOperation({ summary: 'Get task detail' })
  findOne(
    @Req() req,
    @Param('id') id: string,
  ) {
    return this.service.findOne(
      id,
      req.user.organizationId,
    );
  }

  // 🔹 UPDATE
  @Patch(':id')
  @ApiOperation({ summary: 'Update task' })
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.service.update(
      id,
      req.user.organizationId,
      dto,
    );
  }

  // 🔹 DELETE (soft)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete task (soft)' })
  delete(
    @Req() req,
    @Param('id') id: string,
  ) {
    return this.service.delete(
      id,
      req.user.organizationId,
    );
  }
}
