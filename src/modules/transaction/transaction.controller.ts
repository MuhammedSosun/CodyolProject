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

@ApiTags('Transactions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('api/transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Create income/expense transaction' })
  create(@Body() dto: CreateTransactionDto, @Req() req: any) {
    return this.service.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'List transactions (filter + pagination)' })
  list(@Query() query: TransactionListQueryDto) {
    return this.service.list(query);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Summary totals for income/expense' })
  summary(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.service.summary(dateFrom, dateTo);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update transaction' })
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.service.update(id, dto);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get transaction detail (with relations)' })
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete transaction' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
