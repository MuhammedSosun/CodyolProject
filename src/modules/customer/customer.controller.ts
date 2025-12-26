import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerListQueryDto } from './dto/customer-list-query.dto';

@ApiTags('Customer')
@Controller('customers')
export class CustomerController {
    constructor(private readonly service: CustomerService) { }

    @Post()
    @ApiOperation({ summary: 'Create customer' })
    create(@Body() dto: CreateCustomerDto) {
        return this.service.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'List customers (advanced)' })
    list(@Query() query: CustomerListQueryDto) {
        return this.service.list(query);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update customer' })
    update(
        @Param('id') id: string,
        @Query('organizationId') organizationId: string,
        @Body() dto: UpdateCustomerDto,
    ) {
        return this.service.update(id, organizationId, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete customer (soft)' })
    delete(
        @Param('id') id: string,
        @Query('organizationId') organizationId: string,
    ) {
        return this.service.delete(id, organizationId);
    }
}
