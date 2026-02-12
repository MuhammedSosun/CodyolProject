import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { HostingService } from './hosting.service';
import { CreateHostingDto } from './dto/create-hosting.dto';
import { UpdateHostingDto } from './dto/update-hosting.dto';
import { HostingListQueryDto } from './dto/hosting-list-query.dto';

@ApiBearerAuth('JWT-auth')
@ApiTags('Files - Hosting')
@UseGuards(JwtAuthGuard)
@Controller('api/files/hosting')
export class HostingController {
  constructor(private readonly service: HostingService) { }

  @Post()
  @ApiOperation({ summary: 'Create hosting info' })
  create(@Req() req, @Body() dto: CreateHostingDto) {
    return this.service.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List hosting infos' })
  list(@Req() req, @Query() query: HostingListQueryDto) {
    return this.service.list(req.user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hosting info' })
  getById(@Req() req, @Param('id') id: string) {
    return this.service.getById(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update hosting info' })
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateHostingDto) {
    return this.service.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete hosting info (soft)' })
  delete(@Req() req, @Param('id') id: string) {
    return this.service.delete(req.user.id, id);
  }
}
