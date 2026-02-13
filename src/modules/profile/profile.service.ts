import { Injectable } from '@nestjs/common';
import { ProfileRepository } from './profile.repository';
import { UpdateProfileDto } from './dto/update-profile';

@Injectable()
export class ProfileService {
  constructor(private readonly repo: ProfileRepository) {}

  async getProfile(userId: string, email: string) {
    let profile = await this.repo.findByUserId(userId);

    if (!profile) {
      // Profil yoksa boş bir tane oluştur (Lazy Initialization)
      profile = await this.repo.upsert(userId, {});
    }

    return this.toResponse(profile, email);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto, email: string) {
    const updated = await this.repo.upsert(userId, dto);
    return this.toResponse(updated, email);
  }

  private toResponse(profile: any, email: string) {
    return {
      ...profile, // Veritabanındaki tüm alanlar (firstName, bio, iban, vb.)
      email, // Token'dan gelen güncel email
    };
  }
}
