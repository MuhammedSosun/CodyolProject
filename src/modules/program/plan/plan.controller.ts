import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatePlanDto } from './dto/create-plan.dto';
import { ListPlanDto } from './dto/list-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanService } from './plan.service';

@ApiTags('Program / Plan')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('api/program/plan')
export class PlanController {
  constructor(private readonly service: PlanService) {}

  @Get()
  list(@Query() query: ListPlanDto) {
    return this.service.list(query);
  }

  @Post()
  create(@Body() dto: CreatePlanDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
