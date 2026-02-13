import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty({ example: 'profile-uuid' })
  id: string;

  @ApiProperty({ example: 'user-uuid' })
  userId: string;

  @ApiProperty({ example: 'ahmet@company.com' })
  email: string; // JWT'den gelen veri

  // --- Temel Bilgiler ---
  @ApiPropertyOptional({ example: 'Ahmet' })
  firstName?: string | null;

  @ApiPropertyOptional({ example: 'Yılmaz' })
  lastName?: string | null;

  @ApiPropertyOptional({ example: '1990-01-01' })
  birthDate?: Date | null;

  @ApiPropertyOptional({ example: 'A Rh+' })
  bloodGroup?: string | null;

  @ApiPropertyOptional({ example: 'https://cdn.com/avatar.png' })
  avatarUrl?: string | null;

  @ApiPropertyOptional({ example: 'Yazılım geliştiriciyim.' })
  bio?: string | null;

  // --- İletişim ve Konum ---
  @ApiPropertyOptional({ example: '+90 555 123 45 67' })
  phone?: string | null;

  @ApiPropertyOptional({ example: 'Kadıköy, İstanbul' })
  address?: string | null;

  @ApiPropertyOptional({ example: 'İstanbul' })
  location?: string | null;

  // --- Kurumsal Bilgiler ---
  @ApiPropertyOptional({ example: 'Senior Backend Developer' })
  position?: string | null;

  @ApiPropertyOptional({ example: 'Yazılım Geliştirme' })
  department?: string | null;

  @ApiPropertyOptional({ example: '2024-01-01' })
  startDate?: Date | null;

  @ApiPropertyOptional({ example: 'EMP-001' })
  employeeId?: string | null;

  // --- Finansal ve Acil Durum ---
  @ApiPropertyOptional({ example: 'TR00 0000 0000...' })
  iban?: string | null;

  @ApiPropertyOptional({ example: 'X Bankası' })
  bankName?: string | null;

  @ApiPropertyOptional({ example: 'Mehmet Yılmaz' })
  emergencyPerson?: string | null;

  @ApiPropertyOptional({ example: '+90 544...' })
  emergencyPhone?: string | null;

  // --- Sistem Bilgileri ---
  @ApiProperty({ example: '2025-01-01T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-05T12:30:00Z' })
  updatedAt: Date;
}
