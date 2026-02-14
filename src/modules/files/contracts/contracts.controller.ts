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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { ContractListQueryDto } from './dto/contract-list-query.dto';

// ✅ Senin projedeki konuma göre bu import doğru olmalı
import { ContractFileUploadInterceptor } from '../../../common/dto/upload/contracts-upload.interceptor';

@ApiBearerAuth('JWT-auth')
@ApiTags('Files-Contracts')
@Controller('api/files/contracts')
export class ContractsController {
  constructor(private readonly service: ContractsService) { }

  // ✅ CREATE (file upload destekli)
  @Post()
  @ApiOperation({ summary: 'Create contract' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(ContractFileUploadInterceptor)
  create(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateContractDto,
  ) {
    return this.service.create(req.user.id, dto, file);
  }

  // ✅ LIST
  @Get()
  @ApiOperation({ summary: 'List contracts' })
  list(@Req() req, @Query() query: ContractListQueryDto) {
    return this.service.list(req.user.id, query);
  }

  // ✅ DETAIL
  @Get(':id')
  @ApiOperation({ summary: 'Get contract' })
  getById(@Req() req, @Param('id') id: string) {
    return this.service.getById(req.user.id, id);
  }

  // ✅ UPDATE (file opsiyonel)  — aynı interceptor kullanılmalı
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update contract' })
  @UseInterceptors(ContractFileUploadInterceptor)
  update(
    @Req() req,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateContractDto,
  ) {
    return this.service.update(req.user.id, id, dto, file);
  }

  // ✅ DELETE (soft delete)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete contract (soft)' })
  delete(@Req() req, @Param('id') id: string) {
    return this.service.delete(req.user.id, id);
  }
}
