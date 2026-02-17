import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationQueryDto } from '../../common/pagination/pagination-query.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UserController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) { }

  // Pagination'lı liste (admin ekranı vs)
  @Get()
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

  // ✅ Kart atama için basit liste
  @Get('all')
  async all() {
    return this.userService.getUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: {
        profile: true,
        teamMemberships: { include: { team: true } },
      },
    });
  }

  @Get()
  async getUsers() {
    return this.userService.getUsers(); // [{id, username, email, role}]
  }
}
