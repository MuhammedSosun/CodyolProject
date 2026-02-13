import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile';

@ApiTags('Profile')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Get('me')
  @ApiOperation({ summary: 'Giriş yapan kullanıcının profilini getirir' })
  async getMyProfile(@Req() req) {
    return this.service.getProfile(req.user.id, req.user.email);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Kendi profilini günceller' })
  async updateMyProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    return this.service.updateProfile(req.user.id, dto, req.user.email);
  }
}
