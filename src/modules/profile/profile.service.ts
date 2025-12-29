import { Injectable } from '@nestjs/common';
import { ProfileRepository } from './profile.repository';
import { UpdateProfileDto } from './dto/update-profile';
import { ProfileResponseDto } from './dto/profile-response';

@Injectable()
export class ProfileService {
    constructor(private readonly repo: ProfileRepository) { }

    // 🔹 GET /profile
    async getProfile(userId: string, email?: string): Promise<ProfileResponseDto> {
        const profile =
            (await this.repo.findByUserId(userId)) ??
            (await this.repo.upsert(userId, {}));

        return this.toResponse(profile, email);
    }

    // 🔹 PATCH /profile
    async updateProfile(
        userId: string,
        dto: UpdateProfileDto,
        email?: string,
    ): Promise<ProfileResponseDto> {
        const updated = await this.repo.upsert(userId, dto);
        return this.toResponse(updated, email);
    }

    // 🔁 Mapper
    private toResponse(profile: any, email?: string): ProfileResponseDto {
        return {
            id: profile.id,
            userId: profile.userId,
            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone,
            position: profile.position,
            bio: profile.bio,
            email, // ✅ JWT’den
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
        };
    }
}
