import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { TeamsService } from "./teams.service";
import { UpdateUserRoleDto } from "./dto/update-user-role.dto";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto"; // yol sende farklıysa düzelt

import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamMembersDto } from "./dto/update-team-members.dto";

@ApiTags("Teams")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
@Controller("api/teams")
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) { }

  // Ekipleri görüntüle (artık teams döner)
  @Get()
  getTeams() {
    return this.teamsService.findAllTeams();
  }

  @Get("by-name/:name")
  getTeamByName(@Param("name") name: string) {
    return this.teamsService.findTeamByName(name);
  }


  // Ekip oluştur
  @Post()
  createTeam(@Body() dto: CreateTeamDto) {
    return this.teamsService.createTeam(dto);
  }

  // Üye ekle
  @Patch(":id/members/add")
  addMembers(@Param("id") id: string, @Body() dto: UpdateTeamMembersDto) {
    return this.teamsService.addMembers(id, dto);
  }

  // Üye çıkar
  @Patch(":id/members/remove")
  removeMembers(@Param("id") id: string, @Body() dto: UpdateTeamMembersDto) {
    return this.teamsService.removeMembers(id, dto);
  }

  // -------------------------
  // Seçim ekranı için kullanıcıları getir
  @Get("users/list")
  getUsers(@Query() pagination: PaginationQueryDto) {
    return this.teamsService.findAllUsers(pagination);
  }

  // Senin mevcut user role update (şimdilik kalsın)
  @Patch("users/:id/role")
  updateRole(@Param("id") id: string, @Body() dto: UpdateUserRoleDto) {
    return this.teamsService.updateUserRole(id, dto.role);
  }

  // Soft delete user
  @Delete("users/:id")
  remove(@Param("id") id: string) {
    return this.teamsService.removeUser(id);
  }

  @Delete(":id")
  removeTeam(@Param("id") id: string) {
    return this.teamsService.removeTeam(id);
  }

}
