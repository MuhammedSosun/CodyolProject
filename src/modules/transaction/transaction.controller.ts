import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionListQueryDto } from './dto/transaction-list-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Transactions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller('api/transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  // ✅ 1. SIRA: Statik route her zaman en üstte olmalı (404 hatasını önler)
  @Get('summary')
  @ApiOperation({ summary: 'Summary totals for income/expense' })
  async summary(@Query() query: TransactionListQueryDto) {
    return this.service.summary(query.dateFrom, query.dateTo);
  }

  @Post()
  @ApiOperation({ summary: 'Create income/expense transaction' })
  async create(@Body() dto: CreateTransactionDto, @Req() req: any) {
    return this.service.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'List transactions (filter + pagination)' })
  async list(@Query() query: TransactionListQueryDto) {
    return this.service.list(query);
  }

  // ✅ SON SIRA: Dinamik route (:id) her zaman en altta olmalı
  @Get(':id')
  @ApiOperation({ summary: 'Get transaction detail (with relations)' })
  async getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update transaction' })
  async update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete transaction' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
