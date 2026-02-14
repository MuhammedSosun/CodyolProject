import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationQueryDto } from '../../common/pagination/pagination-query.dto';

@ApiTags('User')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UserController {
  constructor(private readonly prisma: PrismaService) { }

  @Get()
  async list(@Query() query: PaginationQueryDto) {
    const page = Number((query as any).page ?? 1);
    const limit = Number((query as any).limit ?? 200);

    const data = await this.prisma.user.findMany({
      where: { deletedAt: null },
      select: { id: true, username: true, email: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return { meta: { page, limit }, data };
  }


@Get(':id')
async findOne(@Param('id') id: string) {
  return this.prisma.user.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      profile: true,
      teamMemberships: {
        include: {
          team: true,
        },
      },
    },
  });
}



}
