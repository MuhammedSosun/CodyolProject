import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Role } from "@prisma/client";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";

import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamMembersDto } from "./dto/update-team-members.dto";

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  // --------------------------------------------------
  // USERS (Ekip oluşturma / seçim ekranı)
  // --------------------------------------------------

  async findAllUsers(pagination?: PaginationQueryDto) {
  const page = pagination?.page ?? 1;
  const limit = pagination?.limit ?? 10;

  const [data, total] = await Promise.all([
    this.prisma.user.findMany({
      where: {
        deletedAt: null,
        role: Role.USER,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        profile: true,
        teamMemberships: {
          include: {
            team: {
              select: { name: true },
            },
          },
        },
      },
    }),
    this.prisma.user.count({
      where: {
        deletedAt: null,
        role: Role.USER,
      },
    }),
  ]);

  return {
    data: data.map((u) => ({
      id: u.id,
      fullName: u.profile
        ? `${u.profile.firstName} ${u.profile.lastName}`
        : u.username,
      role: u.profile?.position ?? '—',
      status: 'active',
      image: null,
      teams: u.teamMemberships.map((tm) => tm.team.name),
    })),
    meta: { page, limit, total },
  };
}

  // --------------------------------------------------
  // TEAMS
  // --------------------------------------------------

  async findAllTeams(pagination?: PaginationQueryDto) {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;

    const [data, total] = await Promise.all([
      this.prisma.team.findMany({
        where: { deletedAt: null },
        skip: (page - 1) * limit,
        take: limit,
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
      }),
      this.prisma.team.count({
        where: { deletedAt: null },
      }),
    ]);

    return {
      data,
      meta: { page, limit, total },
    };
  }

  async findTeamById(id: string) {
    const team = await this.prisma.team.findFirst({
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

    if (!team) {
      throw new NotFoundException("Team not found");
    }

    return { data: team };
  }

  async findTeamByName(name: string) {
    const team = await this.prisma.team.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
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

    if (!team) {
      throw new NotFoundException("Team not found");
    }

    return { data: team };
  }

  async createTeam(dto: CreateTeamDto) {
    const team = await this.prisma.team.create({
      data: {
        name: dto.name,
        members: {
          create: (dto.memberIds ?? []).map((userId) => ({ userId })),
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

    return {
      data: team,
      message: "Team successfully created",
    };
  }

  async removeTeam(id: string) {
    await this.prisma.team.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return {
      message: "Team successfully deleted",
    };
  }

  // --------------------------------------------------
  // TEAM MEMBERS
  // --------------------------------------------------

  async addMembers(teamId: string, dto: UpdateTeamMembersDto) {
    const result = await this.prisma.teamMember.createMany({
      data: dto.memberIds.map((userId) => ({ teamId, userId })),
      skipDuplicates: true,
    });

    return {
      affectedCount: result.count,
      message: "Members successfully added to team",
    };
  }

  async removeMembers(teamId: string, dto: UpdateTeamMembersDto) {
    const result = await this.prisma.teamMember.deleteMany({
      where: {
        teamId,
        userId: { in: dto.memberIds },
      },
    });

    return {
      affectedCount: result.count,
      message: "Members successfully removed from team",
    };
  }

  // --------------------------------------------------
  // USER MANAGEMENT (Geçici)
  // --------------------------------------------------

  async updateUserRole(id: string, role: Role) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { role },
    });

    return {
      data: user,
      message: "User role updated successfully",
    };
  }

  async removeUser(id: string) {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return {
      message: "User successfully deleted",
    };
  }
  
  
  async findEmployees(teamId: string) {
  const members = await this.prisma.teamMember.findMany({
    where: {
      teamId,
      user: {
        role: Role.USER, // adminler yok
      },
    },
    include: {
      user: {
        include: {
          profile: {
            select: {
              firstName: true,
              lastName: true,
              position: true,
            },
          },
          teamMemberships: {
            include: {
              team: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return {
    data: members.map((m) => ({
      id: m.user.id,
      fullName: m.user.profile
        ? `${m.user.profile.firstName} ${m.user.profile.lastName}`
        : m.user.username,
      role: m.user.profile?.position ?? '—',
      status: 'active',
      image: null,
      teams: m.user.teamMemberships.map(
        (tm) => tm.team.name
      ), // 🔥 İŞTE OLAY BURASI
    })),
  };
}


}
