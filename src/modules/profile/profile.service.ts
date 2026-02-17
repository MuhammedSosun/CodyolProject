import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ProfileRepository } from './profile.repository';
import { UpdateProfileDto } from './dto/update-profile';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {
  constructor(private readonly repo: ProfileRepository) {}

  async getProfile(userId: string) {
    let profile = await this.repo.findWithUser(userId);

    if (!profile) {
      await this.repo.upsert(userId, {});
      profile = await this.repo.findWithUser(userId);
    }

    return this.toResponse(profile);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const formattedDto = {
      ...dto,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
    };

    await this.repo.upsert(userId, formattedDto);
    const updated = await this.repo.findWithUser(userId);

    return this.toResponse(updated);
  }

  /**
   * Şifre Güncelleme Metodu
   * Kullanıcıyı bulur, eski şifreyi doğrular ve yenisini kaydeder.
   */
  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    // 1. Kullanıcıyı ve şifresini çekiyoruz. 
    // Eğer profil yoksa otomatik oluşturup tekrar çekiyoruz ki hata almayalım.
    let profile = await this.repo.findWithUser(userId);

    if (!profile) {
      await this.repo.upsert(userId, {});
      profile = await this.repo.findWithUser(userId);
    }

    // Üstteki işleme rağmen user gelmiyorsa sistemde ciddi bir sorun vardır
    if (!profile || !profile.user) {
      throw new NotFoundException('Sistemde bu kullanıcıya ait bir hesap bulunamadı.');
    }

    // 2. Mevcut şifre doğruluğunu kontrol et (bcrypt ile)
    // ÖNEMLİ: ProfileRepository içindeki findWithUser metodunda 'password: true' olmalı!
    const isMatch = await bcrypt.compare(dto.oldPassword, profile.user.password);
    if (!isMatch) {
      throw new BadRequestException('Girdiğiniz mevcut şifre hatalı.');
    }

    // 3. Yeni şifreyi güvenli bir şekilde hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.newPassword, salt);

    // 4. Repository üzerinden User tablosundaki password alanını güncelle
    await this.repo.updateUserPassword(userId, hashedPassword);

    return { message: 'Şifreniz başarıyla güncellendi.' };
  }

  private toResponse(profile: any) {
    return {
      ...profile,
      email: profile.user?.email,
      username: profile.user?.username,
      role: profile.user?.role,
    };
  }
}