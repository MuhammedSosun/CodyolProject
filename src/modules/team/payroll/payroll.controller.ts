import {
  Controller,
  Get,
  Patch,
  Param,
  Req,Body, Post ,
} from '@nestjs/common';
import { PayrollService } from './payroll.service';
import {
  mapPayrollToPendingUI,
  mapPayrollToUserUI,
} from './payroll.mapper';


@Controller('api/teams/payroll') 
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  // 🟢 USER → kendi bordroları oluşturma
@Get('my')
async getMyPayrolls(@Req() req) {
  const payrolls = await this.payrollService.findByUser(req.user.id);
  return payrolls.map(mapPayrollToUserUI);
}


  // 🟢 USER → bu ayki maaş (kart)
@Get('my/current')
async getCurrent(@Req() req) {
  const payroll = await this.payrollService.findCurrent(req.user.id);
  return payroll ? mapPayrollToUserUI(payroll) : null;
}



  // 🔴 ADMIN → bekleyenler
  @Get('pending')
  async getPending() {
    const payrolls = await this.payrollService.findPending();
    return payrolls.map(mapPayrollToPendingUI);
  }

  // 🔴 ADMIN → ödenmişler
  @Get('paid')
  async getPaid() {
    const payrolls = await this.payrollService.findPaid();
    return payrolls.map(mapPayrollToPendingUI);
  }

  // 🔴 ADMIN → ödeme yap
  @Patch(':id/pay')
  pay(@Param('id') id: string) {
    return this.payrollService.pay(id);
  }
  // 🔴 ADMIN → tüm bordrolar
@Get()
async getAll() {
  const payrolls = await this.payrollService.findAll();
  return payrolls.map(mapPayrollToPendingUI);
}

// 🔴 ADMIN → bordro oluştur
@Post()
create(@Body() dto: {
  userId: string;
  month: number;
  year: number;
  netSalary: number;
  note?: string;
}) {
  return this.payrollService.create(dto);
}

}
