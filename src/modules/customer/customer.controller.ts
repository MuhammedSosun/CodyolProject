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
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerListQueryDto } from './dto/customer-list-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Customer')
@ApiBearerAuth('JWT-auth')
@Public()
@Controller('api/customers')
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @Post()
  create(@Body() dto: CreateCustomerDto, @Req() req) {
    return this.service.create(dto, req.user);
  }

  @Get()
  list(@Query() query: CustomerListQueryDto) {
    return this.service.list(query);
  }

  @Get(':id')
getById(@Param('id') id: string, @Req() req) {
  return this.service.findOne(id, req.user);
}


  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
