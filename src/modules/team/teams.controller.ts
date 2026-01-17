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
  constructor(private readonly teamsService: TeamsService) {}

  // --------------------------------------------------
  // TEAMS
  // --------------------------------------------------

  // Ekipleri listele (pagination destekli)
  @Get()
  getTeams(@Query() pagination: PaginationQueryDto) {
    return this.teamsService.findAllTeams(pagination);
  }

  // Tek ekip (id ile)
  @Get(":id")
  getTeamById(@Param("id") id: string) {
    return this.teamsService.findTeamById(id);
  }

  // İsimle ekip ara
  // GET /api/teams/search?name=frontend
  @Get("search")
  getTeamByName(@Query("name") name: string) {
    return this.teamsService.findTeamByName(name);
  }

  // Ekip oluştur (mevcut user'lardan)
  @Post()
  createTeam(@Body() dto: CreateTeamDto) {
    return this.teamsService.createTeam(dto);
  }

  // Ekip sil (soft delete)
  @Delete(":id")
  removeTeam(@Param("id") id: string) {
    return this.teamsService.removeTeam(id);
  }

  // --------------------------------------------------
  // TEAM MEMBERS (User-Team ilişkisi)
  // --------------------------------------------------

  // Ekip üyelerini getir
  @Get(":id/members")
  getTeamMembers(@Param("id") id: string) {
    return this.teamsService.findTeamById(id);
  }

  // Ekip üyesi ekle (bulk)
  @Post(":id/members")
  addMembers(
    @Param("id") id: string,
    @Body() dto: UpdateTeamMembersDto,
  ) {
    return this.teamsService.addMembers(id, dto);
  }

  // Ekipten üye çıkar (bulk)
  @Delete(":id/members")
  removeMembers(
    @Param("id") id: string,
    @Body() dto: UpdateTeamMembersDto,
  ) {
    return this.teamsService.removeMembers(id, dto);
  }

  // --------------------------------------------------
  // USERS (Geçici – ileride UserController’a taşınmalı)
  // --------------------------------------------------

  // Ekip oluşturma ekranı için kullanıcı listesi
  @Get("/users")
  getUsers(@Query() pagination: PaginationQueryDto) {
    return this.teamsService.findAllUsers(pagination);
  }

  // Kullanıcı rol güncelle (admin işlemi)
  @Patch("/users/:id/role")
  updateUserRole(
    @Param("id") id: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.teamsService.updateUserRole(id, dto.role);
  }

  // Kullanıcı soft delete
  @Delete("/users/:id")
  removeUser(@Param("id") id: string) {
    return this.teamsService.removeUser(id);
  }
}