import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateTeamUserDto } from "./dto/update-team-user.dto";
import { Role } from "@prisma/client";

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  findAllUsers() {
    return this.prisma.user.findMany({
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

  updateUser(id: string, dto: UpdateTeamUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
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
    data: {
      deletedAt: new Date(),
    },
  });
}

}
