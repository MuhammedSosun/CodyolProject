import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProfileRepository {
    constructor(private readonly prisma: PrismaService) { }

    findByUserId(userId: string) {
        return this.prisma.profile.findUnique({
            where: { userId },
        });
    }

    upsert(userId: string, data: Prisma.ProfileUpdateInput) {
        return this.prisma.profile.upsert({
            where: { userId },

            update: data,

            create: {
                userId,

                // ⬇️ SADECE PROFILE ALANLARI (TEK TEK)
                firstName: (data as any).firstName ?? null,
                lastName: (data as any).lastName ?? null,
                phone: (data as any).phone ?? null,
                position: (data as any).position ?? null,
                bio: (data as any).bio ?? null,
            },
        });
    }
}
