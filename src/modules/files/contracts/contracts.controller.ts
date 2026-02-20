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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { ContractListQueryDto } from './dto/contract-list-query.dto';
import { ContractFileUploadInterceptor } from '../../../common/interceptors/contract-file-upload.interceptor';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiBearerAuth('JWT-auth')
@ApiTags('Files - Contracts')
@Controller('api/files/contracts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class ContractsController {
  constructor(private readonly service: ContractsService) {}

  @Post()
  @ApiOperation({ summary: 'Create contract file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(ContractFileUploadInterceptor)
  create(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateContractDto,
  ) {
    return this.service.create(req.user.id, dto, file);
  }

  @Get()
  @ApiOperation({ summary: 'List contract files' })
  list(@Req() req: any, @Query() query: ContractListQueryDto) {
    return this.service.list(req.user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contract file' })
  getById(@Req() req: any, @Param('id') id: string) {
    return this.service.getById(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update contract file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(ContractFileUploadInterceptor)
  update(
    @Req() req: any,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateContractDto,
  ) {
    return this.service.update(req.user.id, id, dto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contract file (soft)' })
  delete(@Req() req: any, @Param('id') id: string) {
    return this.service.delete(req.user.id, id);
  }
}
