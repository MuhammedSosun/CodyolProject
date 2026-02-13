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
    return this.prisma.profile.upsert({
      where: { userId },
      update: data,
      create: {
        ...(data as any), // Gelen tüm alanları (firstName, bio vb.) create içine yayar
        userId, // Zorunlu alan
      },
    });
  }
}
