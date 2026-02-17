import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProgramService } from './program.service';

import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { CreateProgramColumnDto } from './dto/create-column.dto';
import { UpdateProgramColumnDto } from './dto/update-column.dto';
import { MoveColumnDto } from './dto/move-column.dto';
import { CreateProgramCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { MoveCardDto } from './dto/move-card.dto';

@ApiTags('Programs')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('programs')
export class ProgramController {
  constructor(private readonly service: ProgramService) {}

  // ✅ Programs
  @Get()
  getPrograms() {
    return this.service.getPrograms();
  }

  @Post()
  createProgram(@Body() dto: CreateProgramDto) {
    return this.service.createProgram(dto);
  }

  @Patch(':programId')
  updateProgram(@Param('programId') programId: string, @Body() dto: UpdateProgramDto) {
    return this.service.updateProgram(programId, dto);
  }

  @Delete(':programId')
  deleteProgram(@Param('programId') programId: string) {
    return this.service.deleteProgram(programId);
  }

  // ✅ Columns
  @Post(':programId/columns')
  createColumn(@Param('programId') programId: string, @Body() dto: CreateProgramColumnDto) {
    return this.service.createColumn(programId, dto);
  }

  @Patch('columns/:columnId')
  updateColumn(@Param('columnId') columnId: string, @Body() dto: UpdateProgramColumnDto) {
    return this.service.updateColumn(columnId, dto);
  }

  @Delete('columns/:columnId')
  deleteColumn(@Param('columnId') columnId: string) {
    return this.service.deleteColumn(columnId);
  }

  @Patch('columns/:columnId/move')
  moveColumn(@Param('columnId') columnId: string, @Body() dto: MoveColumnDto) {
    return this.service.moveColumn(columnId, dto);
  }

  // ✅ Cards
  @Post('columns/:columnId/cards')
  createCard(@Param('columnId') columnId: string, @Body() dto: CreateProgramCardDto) {
    return this.service.createCard(columnId, dto);
  }

  // ✅ BU SENİN 404’Ü ÇÖZER:
  @Patch('cards/:cardId')
  updateCard(@Param('cardId') cardId: string, @Body() dto: UpdateCardDto) {
    return this.service.updateCard(cardId, dto);
  }

  @Delete('cards/:cardId')
  deleteCard(@Param('cardId') cardId: string) {
    return this.service.deleteCard(cardId);
  }

  @Patch('cards/:cardId/move')
  moveCard(@Param('cardId') cardId: string, @Body() dto: MoveCardDto) {
    return this.service.moveCard(cardId, dto);
  }
}
