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



@ApiTags('Proposals')
@ApiBearerAuth('JWT-auth')
@Controller('api/proposals')
export class ProposalController {
  constructor(private readonly service: ProposalService) {}

  @Post()
create(@Req() req, @Body() dto: CreateProposalDto) {
  console.log('AUTH HEADER:', req.headers.authorization);
  console.log('USER:', req.user);
  return this.service.create(dto, req.user.id);
}


  @Get('list')
  list(@Req() req, @Query() query: ProposalListQueryDto) {
    return this.service.list(req.user.id, query);
  }

  @Get()
  findAll(@Req() req) {
    return this.service.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.service.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProposalDto, @Req() req) {
    return this.service.update(id, dto, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req) {
    return this.service.delete(id, req.user.id);
  }
}
