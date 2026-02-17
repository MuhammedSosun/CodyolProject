import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile';
import { UpdatePasswordDto } from './dto/update-password.dto'; // Yeni DTO'yu import ediyoruz

@ApiTags('Profile')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('api/profile')
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Get('me')
  @ApiOperation({ summary: 'Giriş yapan kullanıcının profilini getirir' })
  async getMyProfile(@Req() req) {
    return this.service.getProfile(req.user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Kendi profilini günceller' })
  async updateMyProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    return this.service.updateProfile(req.user.id, dto);
  }

  @Patch('change-password') // Frontend'den bu adrese istek atacağız
  @ApiOperation({ summary: 'Kullanıcının şifresini değiştirir' })
  async updateMyPassword(@Req() req, @Body() dto: UpdatePasswordDto) {
    // req.user.id, JwtAuthGuard sayesinde otomatik gelir
    return this.service.updatePassword(req.user.id, dto);
  }
}