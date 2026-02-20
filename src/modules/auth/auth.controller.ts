import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { Response } from 'express';
import { getCookieConfig } from './auth.cookie';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 🔹 REGISTER
  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // 🔹 LOGIN
  @Public()
  @Post('authenticate')
  async authenticate(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.authenticate(dto);

    const cookies = getCookieConfig();

    res.cookie('access_token', accessToken, cookies.access);
    res.cookie('refresh_token', refreshToken, cookies.refresh);

    return { message: 'Login successful' };
  }

  // 🔹 REFRESH
  @Public()
  @Post('refreshToken')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token;

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refresh(refreshToken);

    const cookies = getCookieConfig();

    res.cookie('access_token', accessToken, cookies.access);
    res.cookie('refresh_token', newRefreshToken, cookies.refresh);

    return { message: 'Token refreshed' };
  }

  // 🔹 LOGOUT
  @Post('logout')
  logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    const cookies = getCookieConfig();

    res.clearCookie('access_token', cookies.clear);
    res.clearCookie('refresh_token', cookies.clear);

    return this.authService.logout(req.user.id);
  }

  // 🔹 ME
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req) {
    return this.authService.me(req.user.id);
  }

  // 🔹 ADMIN TEST
  @Roles(Role.ADMIN)
  @Get('admin')
  adminOnly() {
    return 'ADMIN girebildi';
  }
}
