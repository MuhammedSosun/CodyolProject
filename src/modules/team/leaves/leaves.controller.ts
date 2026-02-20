import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { mapLeaveToPendingUI, mapLeaveToCalendar } from './leaves.mapper';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('api/teams/leaves')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  // 🟢 USER → izin oluşturur
  @Post()
  @Roles(Role.USER)
  create(@Req() req, @Body() data) {
    return this.leavesService.create({
      ...data,
      employee: req.user.username,
    });
  }

  // 🟢 USER → kendi izinleri
  @Get('my')
  @Roles(Role.USER)
  getMyLeaves(@Req() req) {
    return this.leavesService.findByUser(req.user.username);
  }

  // 🔴 ADMIN & SUPER_ADMIN → pending
  @Get('pending')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async getPending() {
    const leaves = await this.leavesService.findPending();
    return leaves.map(mapLeaveToPendingUI);
  }

  // 🔴 ADMIN & SUPER_ADMIN → approved
  @Get('approved')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async getApproved() {
    const leaves = await this.leavesService.findApproved();
    return leaves.map(mapLeaveToCalendar);
  }

  // 🔴 ADMIN & SUPER_ADMIN → approve
  @Patch(':id/approve')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  approve(@Param('id') id: string) {
    return this.leavesService.approve(+id);
  }

  // 🔴 ADMIN & SUPER_ADMIN → reject
  @Patch(':id/reject')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  reject(@Param('id') id: string) {
    return this.leavesService.reject(+id);
  }
}
