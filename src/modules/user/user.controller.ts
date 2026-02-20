import { Controller, Get, Query, UseGuards, Param, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PaginationQueryDto } from '../../common/pagination/pagination-query.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/users')
export class UserController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  // 🔴 ADMIN & SUPER_ADMIN → pagination list
  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async list(@Query() query: PaginationQueryDto) {
    const page = Number((query as any).page ?? 1);
    const limit = Number((query as any).limit ?? 200);

    const data = await this.prisma.user.findMany({
      where: { deletedAt: null },
      select: { id: true, username: true, email: true, role: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.user.count({
      where: { deletedAt: null },
    });

    return { meta: { page, limit, total }, data };
  }

  // 🔴 ADMIN & SUPER_ADMIN → simple list
  @Get('all')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async all() {
    return this.userService.getUsers();
  }

  // 🔴 ADMIN & SUPER_ADMIN → get by id
  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async findOne(@Param('id') id: string) {
    return this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: {
        profile: true,
        teamMemberships: { include: { team: true } },
      },
    });
  }

  // 🟢 USER → kendi profili
  @Get('me')
  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  async getMe(@Req() req) {
    return this.prisma.user.findFirst({
      where: { id: req.user.id, deletedAt: null },
      include: {
        profile: true,
        teamMemberships: { include: { team: true } },
      },
    });
  }
}
