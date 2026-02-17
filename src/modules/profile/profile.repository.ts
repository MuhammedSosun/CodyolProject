import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string) {
    return this.prisma.profile.findUnique({
      where: { userId },
    });
  }

  async upsert(userId: string, data: Prisma.ProfileUncheckedUpdateInput) {
    // Veriyi temizleyip create ve update için hazırlıyoruz
    return this.prisma.profile.upsert({
      where: { userId },
      update: data,
      create: {
        ...data,
        userId,
      } as Prisma.ProfileUncheckedCreateInput,
    });
  }

  async findWithUser(userId: string) {
    return this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,       // ID kontrolü için ekledik
            email: true,
            username: true,
            role: true,
            password: true, // bcrypt karşılaştırması için kritik alan
          },
        },
      },
    });
  }

  /**
   * Kullanıcının şifresini User tablosunda günceller
   */
  async updateUserPassword(userId: string, password: string) {
    return this.prisma.user.update({
      where: { id: userId }, // Şifre User tablosunda olduğu için id üzerinden işlem yapılır
      data: { password },
    });
  }
}