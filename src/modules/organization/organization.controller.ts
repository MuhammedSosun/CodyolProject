import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('Organizations')
@ApiBearerAuth('JWT-auth')
@Controller('organizations')
export class OrganizationController {
    constructor(private readonly service: OrganizationService) { }


    @Post()
    create(@Body() dto: CreateOrganizationDto) {
        return this.service.create(dto);
    }


    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.service.findById(id);
    }

    @Get('slug/:slug')
    findBySlug(@Param('slug') slug: string) {
        return this.service.findBySlug(slug);
    }


    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateOrganizationDto,
    ) {
        return this.service.update(id, dto);
    }


    @Patch(':id/activate')
    activate(@Param('id') id: string) {
        return this.service.activate(id);
    }

    @Patch(':id/deactivate')
    deactivate(@Param('id') id: string) {
        return this.service.deactivate(id);
    }


    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.service.delete(id);
    }
}
