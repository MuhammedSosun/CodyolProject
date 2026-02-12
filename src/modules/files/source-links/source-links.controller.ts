import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SourceLinksService } from './source-links.service';
import { CreateSourceLinkDto } from './dto/create-source-link.dto';
import { UpdateSourceLinkDto } from './dto/update-source-link.dto';
import { SourceLinkListQueryDto } from './dto/source-link-list-query.dto';

@ApiBearerAuth('JWT-auth')
@ApiTags('Files - Source Links')
@Controller('api/files/source-links')
export class SourceLinksController {
  constructor(private readonly service: SourceLinksService) { }

  @Post()
  @ApiOperation({ summary: 'Create source link' })
  create(@Req() req, @Body() dto: CreateSourceLinkDto) {
    return this.service.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List source links' })
  list(@Req() req, @Query() query: SourceLinkListQueryDto) {
    return this.service.list(req.user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get source link' })
  getById(@Req() req, @Param('id') id: string) {
    return this.service.getById(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update source link' })
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateSourceLinkDto) {
    return this.service.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete source link (soft)' })
  delete(@Req() req, @Param('id') id: string) {
    return this.service.delete(req.user.id, id);
  }
}