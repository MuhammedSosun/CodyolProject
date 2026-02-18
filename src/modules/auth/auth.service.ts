import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        role: Role.USER,
      },
    });

    return {
      accessToken: this.createAccessToken({
        id: user.id,
        username: user.username,
        email: user.email, // JWT'ye email ekledik
        role: user.role,
      }),
      refreshToken: await this.createRefreshToken(user.id),
    };
  }

  async authenticate(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    return {
      accessToken: this.createAccessToken({
        id: user.id,
        username: user.username,
        email: user.email, // JWT'ye email ekledik
        role: user.role,
      }),
      refreshToken: await this.createRefreshToken(user.id),
    };
  }
  async me(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const token = await this.prisma.refreshToken.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!token || token.expiredAt < new Date() || token.user.deletedAt) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return {
      accessToken: this.createAccessToken({
        id: token.user.id,
        username: token.user.username,
        email: token.user.email,
        role: token.user.role,
      }),
      refreshToken: await this.createRefreshToken(token.user.id),
    };
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
    return { message: 'Logged out' };
  }

  private createAccessToken(user: {
    id: string;
    username: string;
    email: string;
    role: Role;
  }) {
    return this.jwt.sign(
      {
        sub: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      { expiresIn: '15m' },
    );
  }

  private async createRefreshToken(userId: string) {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });

    const token = randomUUID();

    await this.prisma.refreshToken.create({
      data: {
        refreshToken: token,
        expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 gün
        userId,
      },
    });

    return token;
  }
}
