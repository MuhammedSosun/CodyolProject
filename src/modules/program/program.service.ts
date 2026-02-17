import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { CreateProgramColumnDto } from './dto/create-column.dto';
import { UpdateProgramColumnDto } from './dto/update-column.dto';
import { MoveColumnDto } from './dto/move-column.dto';
import { CreateProgramCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { MoveCardDto } from './dto/move-card.dto';

@Injectable()
export class ProgramService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ Programs
  async getPrograms() {
    return this.prisma.program.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        columns: {
          orderBy: { order: 'asc' },
          include: {
            cards: {
              orderBy: { order: 'asc' },
              include: {
                // ✅ schema düzeldikten sonra burası yeşil olur
                assigneeUser: { select: { id: true, username: true, email: true } },
              },
            },
          },
        },
      },
    });
  }

  async createProgram(dto: CreateProgramDto) {
    const name = (dto.name ?? '').trim();
    if (!name) throw new BadRequestException('name is required');

    return this.prisma.program.create({
      data: {
        name,
        description: dto.description?.trim() || null,
      },
    });
  }

  async updateProgram(programId: string, dto: UpdateProgramDto) {
    const exists = await this.prisma.program.findUnique({ where: { id: programId } });
    if (!exists) throw new NotFoundException('Program not found');

    return this.prisma.program.update({
      where: { id: programId },
      data: {
        name: dto.name ? dto.name.trim() : undefined,
        description: dto.description === undefined ? undefined : (dto.description?.trim() || null),
        isActive: dto.isActive ?? undefined,
      },
    });
  }

  async deleteProgram(programId: string) {
    const exists = await this.prisma.program.findUnique({ where: { id: programId } });
    if (!exists) throw new NotFoundException('Program not found');

    await this.prisma.program.delete({ where: { id: programId } });
    return { ok: true };
  }

  // ✅ Columns
  async createColumn(programId: string, dto: CreateProgramColumnDto) {
    const program = await this.prisma.program.findUnique({ where: { id: programId } });
    if (!program) throw new NotFoundException('Program not found');

    const title = (dto.title ?? '').trim();
    if (!title) throw new BadRequestException('title is required');

    const last = await this.prisma.programColumn.findFirst({
      where: { programId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const order = typeof (dto as any).order === 'number' ? (dto as any).order : (last?.order ?? -1) + 1;

    return this.prisma.programColumn.create({
      data: { programId, title, order },
    });
  }

  async updateColumn(columnId: string, dto: UpdateProgramColumnDto) {
    const col = await this.prisma.programColumn.findUnique({ where: { id: columnId } });
    if (!col) throw new NotFoundException('Column not found');

    return this.prisma.programColumn.update({
      where: { id: columnId },
      data: {
        title: dto.title === undefined ? undefined : (dto.title?.trim() || ''),
        order: (dto as any).order ?? undefined,
      },
    });
  }

  async deleteColumn(columnId: string) {
    const col = await this.prisma.programColumn.findUnique({ where: { id: columnId } });
    if (!col) throw new NotFoundException('Column not found');

    await this.prisma.programColumn.delete({ where: { id: columnId } });
    return { ok: true };
  }

  async moveColumn(columnId: string, dto: MoveColumnDto) {
    const col = await this.prisma.programColumn.findUnique({ where: { id: columnId } });
    if (!col) throw new NotFoundException('Column not found');

    const cols = await this.prisma.programColumn.findMany({
      where: { programId: col.programId },
      orderBy: { order: 'asc' },
      select: { id: true },
    });

    const ids = cols.map((c) => c.id);
    const fromIndex = ids.indexOf(columnId);
    if (fromIndex === -1) throw new BadRequestException('Column not in program');

    const toIndex = Math.min(Math.max(dto.newOrder, 0), ids.length - 1);

    ids.splice(fromIndex, 1);
    ids.splice(toIndex, 0, columnId);

    await this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.programColumn.update({
          where: { id },
          data: { order: index },
        }),
      ),
    );

    return { ok: true };
  }

  // ✅ Cards
  async createCard(columnId: string, dto: CreateProgramCardDto) {
    const col = await this.prisma.programColumn.findUnique({ where: { id: columnId } });
    if (!col) throw new NotFoundException('Column not found');

    const title = (dto.title ?? '').trim();
    if (!title) throw new BadRequestException('title is required');

    const assigneeUserId = dto.assigneeUserId?.trim();
    if (assigneeUserId) {
      const user = await this.prisma.user.findUnique({ where: { id: assigneeUserId } });
      if (!user) throw new BadRequestException('Assignee user not found');
    }

    const last = await this.prisma.programCard.findFirst({
      where: { columnId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const order = (last?.order ?? -1) + 1;

    return this.prisma.programCard.create({
      data: {
        columnId,
        title,
        content: dto.content?.trim() || null,
        order,
        assigneeUserId: assigneeUserId || null,
      },
      include: {
        assigneeUser: { select: { id: true, username: true, email: true } },
      },
    });
  }

  async updateCard(cardId: string, dto: UpdateCardDto) {
    const card = await this.prisma.programCard.findUnique({ where: { id: cardId } });
    if (!card) throw new NotFoundException('Card not found');

    // dto.assigneeUserId:
    // - undefined => dokunma
    // - null => kaldır
    // - "id" => ata
    if (dto.assigneeUserId !== undefined && dto.assigneeUserId !== null) {
      const assigneeUserId = String(dto.assigneeUserId).trim();
      if (!assigneeUserId) throw new BadRequestException('assigneeUserId cannot be empty');

      const user = await this.prisma.user.findUnique({ where: { id: assigneeUserId } });
      if (!user) throw new BadRequestException('Assignee user not found');
    }

    return this.prisma.programCard.update({
      where: { id: cardId },
      data: {
        title: dto.title === undefined ? undefined : (dto.title?.trim() || ''),
        content: dto.content === undefined ? undefined : (dto.content?.trim() || null),
        assigneeUserId: dto.assigneeUserId === undefined ? undefined : dto.assigneeUserId,
      },
      include: {
        assigneeUser: { select: { id: true, username: true, email: true } },
      },
    });
  }

  async deleteCard(cardId: string) {
    const card = await this.prisma.programCard.findUnique({ where: { id: cardId } });
    if (!card) throw new NotFoundException('Card not found');

    await this.prisma.programCard.delete({ where: { id: cardId } });
    return { ok: true };
  }

  async moveCard(cardId: string, dto: MoveCardDto) {
    const card = await this.prisma.programCard.findUnique({ where: { id: cardId } });
    if (!card) throw new NotFoundException('Card not found');

    const toCol = await this.prisma.programColumn.findUnique({ where: { id: dto.toColumnId } });
    if (!toCol) throw new NotFoundException('Target column not found');

    const fromColumnId = card.columnId;
    const toColumnId = dto.toColumnId;

    await this.prisma.$transaction(async (tx) => {
      if (fromColumnId !== toColumnId) {
        await tx.programCard.update({
          where: { id: cardId },
          data: { columnId: toColumnId },
        });
      }

      const toCards = await tx.programCard.findMany({
        where: { columnId: toColumnId },
        orderBy: { order: 'asc' },
        select: { id: true },
      });

      const ids = toCards.map((c) => c.id).filter((id) => id !== cardId);
      const insertIndex = Math.min(Math.max(dto.newOrder, 0), ids.length);
      ids.splice(insertIndex, 0, cardId);

      await Promise.all(
        ids.map((id, index) =>
          tx.programCard.update({
            where: { id },
            data: { order: index },
          }),
        ),
      );

      if (fromColumnId !== toColumnId) {
        const fromCards = await tx.programCard.findMany({
          where: { columnId: fromColumnId },
          orderBy: { order: 'asc' },
          select: { id: true },
        });

        await Promise.all(
          fromCards.map((c, index) =>
            tx.programCard.update({
              where: { id: c.id },
              data: { order: index },
            }),
          ),
        );
      }
    });

    return { ok: true };
  }
}
