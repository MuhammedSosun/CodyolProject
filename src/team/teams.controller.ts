import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { TeamsService } from "./teams.service";
import { UpdateUserRoleDto } from "./dto/update-user-role.dto";
import { UpdateTeamUserDto } from "./dto/update-team-user.dto";

@ApiTags('Teams')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('api/teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  getAll() {
    return this.teamsService.findAllUsers();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTeamUserDto,
  ) {
    return this.teamsService.updateUser(id, dto);
  }

  @Patch(':id/role')
  updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.teamsService.updateUserRole(id, dto.role);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.removeUser(id);
  }
}
