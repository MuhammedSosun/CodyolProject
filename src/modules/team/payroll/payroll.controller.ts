import {
  Controller,
  Get,
  Patch,
  Param,
  Req,
  Body,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { mapPayrollToPendingUI, mapPayrollToUserUI } from './payroll.mapper';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('api/teams/payroll')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  // 🟢 USER → kendi bordroları
  @Get('my')
  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  async getMyPayrolls(@Req() req) {
    const payrolls = await this.payrollService.findByUser(req.user.id);
    return payrolls.map(mapPayrollToUserUI);
  }

  // 🟢 USER → bu ayki maaş
  @Get('my/current')
  @Roles(Role.USER)
  async getCurrent(@Req() req) {
    const payroll = await this.payrollService.findCurrent(req.user.id);
    return payroll ? mapPayrollToUserUI(payroll) : null;
  }

  // 🔴 ADMIN & SUPER_ADMIN
  @Get('pending')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async getPending() {
    const payrolls = await this.payrollService.findPending();
    return payrolls.map(mapPayrollToPendingUI);
  }

  @Get('paid')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async getPaid() {
    const payrolls = await this.payrollService.findPaid();
    return payrolls.map(mapPayrollToPendingUI);
  }

  @Patch(':id/pay')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  pay(@Param('id') id: string) {
    return this.payrollService.pay(id);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async getAll() {
    const payrolls = await this.payrollService.findAll();
    return payrolls.map(mapPayrollToPendingUI);
  }

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  create(
    @Body()
    dto: {
      userId: string;
      month: number;
      year: number;
      netSalary: number;
      note?: string;
    },
  ) {
    return this.payrollService.create(dto);
  }

  @Get('user/:userId')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  findByUser(@Param('userId') userId: string) {
    return this.payrollService.findByUser(userId);
  }
}
