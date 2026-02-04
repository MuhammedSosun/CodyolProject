import { Controller, Get, Patch, Param,Body, Post,Req } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { mapLeaveToPendingUI } from './leaves.mapper';
import { mapLeaveToCalendar } from './leaves.mapper';


@Controller('api/teams/leaves')

export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

//Userın izin oluştrurması
@Post()
create(@Req() req, @Body() data) {
  return this.leavesService.create({
    ...data,
    employee: req.user.username, // 🔥 ASIL OLAY
  });
}

  // userın kendi izinleri
  @Get('my')
  getMyLeaves(@Req() req) {
    const username = req.user.username;
    return this.leavesService.findByUser(username);
  }

  // GET /teams/leaves/pending
 @Get('pending')
async getPending() {
  const leaves = await this.leavesService.findPending();
  return leaves.map(mapLeaveToPendingUI);
}

  // GET /teams/leaves/approved
  @Get('approved')
async getApproved() {
  const leaves = await this.leavesService.findApproved();
  return leaves.map(mapLeaveToCalendar);
}
  // PATCH /teams/leaves/:id/approve
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.leavesService.approve(+id);
  }

  // PATCH /teams/leaves/:id/reject
  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.leavesService.reject(+id);
  }
}
