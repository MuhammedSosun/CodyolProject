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

@ApiTags('Customer')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('api/customers')
export class CustomerController {
  constructor(private readonly service: CustomerService) {}
  @Post()
create(@Body() dto: CreateCustomerDto, @Req() req) {
  console.log('✅ CONTROLLER HIT');
  console.log('RAW DTO:', dto);
  console.log('USER:', req.user);

  // 🔥 boş string’leri temizle
  const cleanedDto = Object.fromEntries(
    Object.entries(dto).filter(
      ([_, value]) => value !== '' && value !== null
    )
  ) as CreateCustomerDto;

  console.log('CLEAN DTO:', cleanedDto);

  return this.service.create(cleanedDto, req.user);
}


  @Get()
  list(@Query() query: CustomerListQueryDto) {
    return this.service.list(query);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
