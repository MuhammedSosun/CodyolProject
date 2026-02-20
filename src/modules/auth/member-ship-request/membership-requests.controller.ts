import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { Roles } from "../decorators/roles.decorator";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Role } from '@prisma/client';
@Controller('api/membership-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN) // Sadece adminler görebilsin
export class MembershipRequestsController {
  constructor(private readonly prisma: PrismaService) {}

  @Patch(':id/assign-role')
  @Roles(Role.SUPER_ADMIN) // Burası kritik!
  async assignRole(
    @Param('id') id: string,
    @Body('role') role: Role
  ) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }
  // Tüm kullanıcıları listele (Sadece SUPER_ADMIN görebilir)
@Get('all-users')
@Roles(Role.SUPER_ADMIN)
async getAllUsers() {
  return this.prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      status: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

  

  @Get()
  async getPending() {
    return this.prisma.user.findMany({
      where: { status: 'PENDING', deletedAt: null },
      select: { id: true, username: true, email: true, createdAt: true }
    });
  }

  @Patch(':id/approve')
  async approve(@Param('id') id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { status: 'APPROVED' }
    });
  }

  @Patch(':id/reject')
  async reject(@Param('id') id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { status: 'REJECTED' }
    });
  }
}