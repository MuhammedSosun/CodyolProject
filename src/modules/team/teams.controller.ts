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
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { TeamsService } from './teams.service';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamMembersDto } from './dto/update-team-members.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@ApiTags('Teams')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  // -------------------------------
  // READ (USER dahil)
  // -------------------------------

  @Get()
  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  getTeams(@Query() pagination: PaginationQueryDto) {
    return this.teamsService.findAllTeams(pagination);
  }

  @Get('search')
  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  getTeamByName(@Query('name') name: string) {
    return this.teamsService.findTeamByName(name);
  }

  @Get('users')
  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  getUsers(@Query() pagination: PaginationQueryDto) {
    return this.teamsService.findAllUsers(pagination);
  }

  @Get(':id/employees')
  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  getEmployees(@Param('id') id: string) {
    return this.teamsService.findEmployees(id);
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  getTeamById(@Param('id') id: string) {
    return this.teamsService.findTeamById(id);
  }

  // -------------------------------
  // WRITE (ADMIN & SUPER_ADMIN)
  // -------------------------------

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  createTeam(@Body() dto: CreateTeamDto) {
    return this.teamsService.createTeam(dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  removeTeam(@Param('id') id: string) {
    return this.teamsService.removeTeam(id);
  }

  @Post(':id/members')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  addMembers(@Param('id') id: string, @Body() dto: UpdateTeamMembersDto) {
    return this.teamsService.addMembers(id, dto);
  }

  @Delete(':id/members')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  removeMembers(@Param('id') id: string, @Body() dto: UpdateTeamMembersDto) {
    return this.teamsService.removeMembers(id, dto);
  }

  @Patch('users/:id/role')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  updateUserRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto) {
    return this.teamsService.updateUserRole(id, dto.role);
  }

  @Delete('users/:id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  removeUser(@Param('id') id: string) {
    return this.teamsService.removeUser(id);
  }
}
