import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { ContractListQueryDto } from './dto/contract-list-query.dto';

@ApiBearerAuth('JWT-auth')
@ApiTags('Files - Contracts')
@Controller('api/files/contracts')
export class ContractsController {
  constructor(private readonly service: ContractsService) { }

  @Post()
  @ApiOperation({ summary: 'Create contract file' })
  create(@Req() req, @Body() dto: CreateContractDto) {
    return this.service.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List contract files' })
  list(@Req() req, @Query() query: ContractListQueryDto) {
    return this.service.list(req.user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contract file' })
  getById(@Req() req, @Param('id') id: string) {
    return this.service.getById(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update contract file' })
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateContractDto) {
    return this.service.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contract file (soft)' })
  delete(@Req() req, @Param('id') id: string) {
    return this.service.delete(req.user.id, id);
  }
}