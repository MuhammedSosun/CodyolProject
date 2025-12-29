import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    Req,
    UseGuards,
    Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProposalService } from './proposal.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { ProposalListQueryDto } from './dto/proposal-list-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Proposals')
@ApiBearerAuth('JWT-auth')
@Controller('proposals')
export class ProposalController {
    constructor(private readonly service: ProposalService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(
        @Req() req,
        @Body() dto: CreateProposalDto,
    ) {
        return this.service.create(
            dto,
            req.user.organizationId,
            req.user.id,
        );
    }

    // 🔥 LIST MUTLAKA EN ÜSTTE
    @UseGuards(JwtAuthGuard)
    @Get('list')
    list(
        @Req() req,
        @Query() query: ProposalListQueryDto,
    ) {
        console.log('LIST HIT');
        console.log('ORG:', req.user.organizationId);

        return this.service.list(
            req.user.organizationId,
            query,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(
        @Req() req,
    ) {
        return this.service.findAll(req.user.organizationId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(
        @Param('id') id: string,
        @Req() req,
    ) {
        return this.service.findOne(
            id,
            req.user.organizationId,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateProposalDto,
    ) {
        return this.service.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(
        @Param('id') id: string,
    ) {
        return this.service.delete(id);
    }
}
