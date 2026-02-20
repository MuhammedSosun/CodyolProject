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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { LicensesService } from './licenses.service';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';
import { LicenseListQueryDto } from './dto/license-list-query.dto';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';

@ApiBearerAuth('JWT-auth')
@ApiTags('Files - Licenses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller('api/files/licenses')
export class LicensesController {
  constructor(private readonly service: LicensesService) {}

  @Post()
  @ApiOperation({ summary: 'Create license' })
  create(@Req() req, @Body() dto: CreateLicenseDto) {
    return this.service.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List licenses' })
  list(@Req() req, @Query() query: LicenseListQueryDto) {
    return this.service.list(req.user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get license' })
  getById(@Req() req, @Param('id') id: string) {
    return this.service.getById(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update license' })
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateLicenseDto) {
    return this.service.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete license (soft)' })
  delete(@Req() req, @Param('id') id: string) {
    return this.service.delete(req.user.id, id);
  }
}
