import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('authenticate')
    authenticate(@Body() dto: LoginDto) {
        return this.authService.authenticate(dto);
    }

    @Post('refreshToken')
    refresh(@Body() dto: RefreshTokenDto) {
        return this.authService.refresh(dto);
    }



    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    logout(@Req() req) {
        return this.authService.logout(req.user.sub);
    }
}
