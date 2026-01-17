import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Role } from "@prisma/client";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto"; // yol sende farklıysa düzelt

import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamMembersDto } from "./dto/update-team-members.dto";

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) { }

  // (Seçim ekranı için) kullanıcıları getir
  findAllUsers(pagination?: PaginationQueryDto) {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;

    return this.prisma.user.findMany({
      where: { deletedAt: null },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        profile: true,
      },
    });
  }

  // Ekipleri listele (Ekipleri Görüntüle sayfası)
  findAllTeams() {
    return this.prisma.team.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
                profile: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });
  }

  // Tek ekip + üyeleri
  findTeamById(id: string) {
    return this.prisma.team.findFirst({
      where: { id, deletedAt: null },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
                profile: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });
  }

  // Ekip oluştur + seçilen üyeleri ekle
  async createTeam(dto: CreateTeamDto) {
    const memberIds = dto.memberIds ?? [];

    return this.prisma.team.create({
      data: {
        name: dto.name,
        members: {
          create: memberIds.map((userId) => ({ userId })),
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
                profile: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });
  }

  // Sonradan üye ekle
  addMembers(teamId: string, dto: UpdateTeamMembersDto) {
    return this.prisma.teamMember.createMany({
      data: dto.memberIds.map((userId) => ({ teamId, userId })),
      skipDuplicates: true,
    });
  }

  // Sonradan üye çıkar
  removeMembers(teamId: string, dto: UpdateTeamMembersDto) {
    return this.prisma.teamMember.deleteMany({
      where: {
        teamId,
        userId: { in: dto.memberIds },
      },
    });
  }
  updateUserRole(id: string, role: Role) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  removeUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  findTeamByName(name: string) {
    return this.prisma.team.findFirst({
      where: {
        name,
        deletedAt: null,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
                profile: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });
  }

  removeTeam(id: string) {
    return this.prisma.team.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
