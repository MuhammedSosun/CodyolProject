import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { Public } from './decorators/public.decorator';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from '@prisma/client';


@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('authenticate')
  authenticate(@Body() dto: LoginDto) {
    return this.authService.authenticate(dto);
  }

  // ⚠️ Refresh token ACCESS TOKEN değildir
  @UseGuards(RefreshAuthGuard)
  @Post('refreshToken')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @Post('logout')
  logout(@Req() req) {
    return this.authService.logout(req.user.id);
  }

  @Get('admin')
  @Roles(Role.ADMIN)
  adminOnly() {
    return 'ADMIN girebildi';
  }
}
