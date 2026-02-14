import { Injectable } from '@nestjs/common';
import { ProfileRepository } from './profile.repository';
import { UpdateProfileDto } from './dto/update-profile';

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


  

  private toResponse(profile: any) {
  return {
    ...profile,
    email: profile.user.email,
    username: profile.user.username,
    role: profile.user.role,
  };
}


}
