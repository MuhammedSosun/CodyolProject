import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserStatus, Role } from '@prisma/client'; // Prisma'dan yeni tipleri ekledik

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  
  async onModuleInit() {
    await this.seedAdmin();
  }
  async seedAdmin() {
    const adminEmail = 'admin@codyol.com'; // Burayı kendi mailin yapabilirsin
    
    // 1. Admin var mı kontrol et
    const adminExists = await this.prisma.user.findFirst({
      where: { role: Role.ADMIN },
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10); // Güçlü bir şifre seç
      
      await this.prisma.user.create({
        data: {
          username: 'admin',
          email: adminEmail,
          password: hashedPassword,
          role: Role.SUPER_ADMIN,
          status: UserStatus.APPROVED, // Admin otomatik onaylı olur
        },
      });
      
      console.log('✅ EFSANE: SUPER_ADMIN hesabı başarıyla oluşturuldu!: admin@codyol.com / admin123');
    } else {
      console.log('ℹ️ SUPER_Admin hesabı zaten mevcut, seeding atlandı.');
    }
  }
  // 🔹 KAYIT (REGISTER)
  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        role: Role.USER,
        status: UserStatus.PENDING, // Kayıt olan kullanıcıyı "Beklemede" yapıyoruz
      },
    });

    // Kullanıcıya onay beklediğine dair bilgi veriyoruz (Token dönmüyoruz)
    return {
      message: "Kaydınız başarıyla oluşturuldu. Giriş yapabilmek için admin onayı bekleniyor.",
      userId: user.id
    };
  }
  
  // 🔹 GİRİŞ (LOGIN)
  async authenticate(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    // 1. Kullanıcı var mı ve silinmiş mi?
    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Geçersiz kullanıcı adı veya şifre');
    }

    // 2. 🟢 ONAY KONTROLÜ (Kritik Nokta)
    if (user.status === UserStatus.PENDING) {
      throw new UnauthorizedException('Hesabınız henüz onaylanmamış. Lütfen admin onayını bekleyin.');
    }

    if (user.status === UserStatus.REJECTED) {
      throw new UnauthorizedException('Üyelik başvurunuz reddedilmiştir.');
    }

    // 3. Şifre eşleşme kontrolü
    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Geçersiz kullanıcı adı veya şifre');

    // Her şey tamamsa tokenları üret
    return {
      accessToken: this.createAccessToken({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      }),
      refreshToken: await this.createRefreshToken(user.id),
    };
  }

  // 🔹 KULLANICI BİLGİSİ (ME)
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
        status: true, // Status bilgisini de ekleyelim
        createdAt: true,
      },
    });

    if (!user) throw new UnauthorizedException();
    return user;
  }

  // 🔹 REFRESH TOKEN
  async refresh(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('Refresh token missing');

    const token = await this.prisma.refreshToken.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!token || token.expiredAt < new Date() || token.user.deletedAt) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Kullanıcı "APPROVED" değilse refresh işlemini de engelleyelim
    if (token.user.status !== UserStatus.APPROVED) {
      throw new UnauthorizedException('Yetkisiz erişim');
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

  // 🔹 ÇIKIŞ (LOGOUT)
  async logout(userId: string) {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
    return { message: 'Logged out' };
  }

  // 🔹 TOKEN ÜRETİMİ (Private Methods)
  private createAccessToken(user: { id: string; username: string; email: string; role: Role }) {
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