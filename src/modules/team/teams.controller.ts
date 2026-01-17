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
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { TeamsService } from "./teams.service";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";

import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamMembersDto } from "./dto/update-team-members.dto";
import { UpdateUserRoleDto } from "./dto/update-user-role.dto";

@ApiTags("Teams")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
@Controller("api/teams")
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
  ) {}

  // -------------------------------
  // SABİT ROUTE'LAR (ÖNCE)
  // -------------------------------

  @Get()
  getTeams(@Query() pagination: PaginationQueryDto) {
    return this.teamsService.findAllTeams(pagination);
  }

  @Get("search")
  getTeamByName(@Query("name") name: string) {
    return this.teamsService.findTeamByName(name);
  }

  @Get("users")
  getUsers(@Query() pagination: PaginationQueryDto) {
    return this.teamsService.findAllUsers(pagination);
  }

  @Patch("users/:id/role")
  updateUserRole(
    @Param("id") id: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.teamsService.updateUserRole(id, dto.role);
  }

  @Delete("users/:id")
  removeUser(@Param("id") id: string) {
    return this.teamsService.removeUser(id);
  }

  // -------------------------------
  // DİNAMİK ROUTE (EN SONA)
  // -------------------------------

  @Get(":id")
  getTeamById(@Param("id") id: string) {
    return this.teamsService.findTeamById(id);
  }

  @Post()
  createTeam(@Body() dto: CreateTeamDto) {
    return this.teamsService.createTeam(dto);
  }

  @Delete(":id")
  removeTeam(@Param("id") id: string) {
    return this.teamsService.removeTeam(id);
  }

  @Get(":id/members")
  getTeamMembers(@Param("id") id: string) {
    return this.teamsService.findTeamById(id);
  }

  @Post(":id/members")
  addMembers(
    @Param("id") id: string,
    @Body() dto: UpdateTeamMembersDto,
  ) {
    return this.teamsService.addMembers(id, dto);
  }

  @Delete(":id/members")
  removeMembers(
    @Param("id") id: string,
    @Body() dto: UpdateTeamMembersDto,
  ) {
    return this.teamsService.removeMembers(id, dto);
  }
}