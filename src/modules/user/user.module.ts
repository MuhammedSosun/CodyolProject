import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [PrismaService],
})
export class UserModule {}
