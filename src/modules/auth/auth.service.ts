import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
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
    ) { }

    async register(dto: RegisterDto) {
        const usernameExists = await this.prisma.user.findUnique({
            where: { username: dto.username },
        });
        if (usernameExists) {
            throw new BadRequestException('Username already exists');
        }

        const emailExists = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (emailExists) {
            throw new BadRequestException('Email already exists');
        }

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
            accessToken: this.createAccessToken(user),
            refreshToken: await this.createRefreshToken(user.id),
        };
    }

    async authenticate(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { username: dto.username },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const match = await bcrypt.compare(dto.password, user.password);
        if (!match) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {
            accessToken: this.createAccessToken(user),
            refreshToken: await this.createRefreshToken(user.id),
        };
    }

    async refresh(dto: RefreshTokenDto) {
        const token = await this.prisma.refreshToken.findUnique({
            where: { refreshToken: dto.refreshToken },
            include: { user: true },
        });

        if (!token || token.expiredAt < new Date()) {
            throw new UnauthorizedException();
        }

        return {
            accessToken: this.createAccessToken(token.user),
            refreshToken: await this.createRefreshToken(token.user.id),
        };
    }

    async logout(userId: string) {
        await this.prisma.refreshToken.deleteMany({ where: { userId } });
    }

    private createAccessToken(user: any) {
        return this.jwt.sign(
            {
                sub: user.id,
                username: user.username,
                role: user.role,
            },
            { expiresIn: '2h' },
        );
    }

    private async createRefreshToken(userId: string) {
        const token = randomUUID();
        await this.prisma.refreshToken.create({
            data: {
                refreshToken: token,
                expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 4),
                userId,
            },
        });
        return token;
    }
}
