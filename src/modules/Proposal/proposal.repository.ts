import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { ProposalListQueryDto } from './dto/proposal-list-query.dto';


@Injectable()
export class ProposalRepository {
    constructor(private readonly prisma: PrismaService) { }

    create(data: {
        dto: CreateProposalDto;
        organizationId: string;
        createdByUserId: string;
    }) {
        const { dto, organizationId, createdByUserId } = data;

        return this.prisma.proposal.create({
            data: {
                title: dto.title,
                customerId: dto.customerId,
                validUntil: new Date(dto.validUntil),
                status: dto.status,
                organizationId,
                createdByUserId,
            },
        });
    }

    findAll(organizationId: string) {
        return this.prisma.proposal.findMany({
            where: {
                organizationId,
                deletedAt: null,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    findById(id: string, organizationId: string) {
        return this.prisma.proposal.findFirst({
            where: {
                id,
                organizationId,
                deletedAt: null,
            },
        });
    }

    update(id: string, dto: UpdateProposalDto) {
        return this.prisma.proposal.update({
            where: { id },
            data: dto,
        });
    }

    softDelete(id: string) {
        return this.prisma.proposal.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async findForList(
        organizationId: string,
        query: ProposalListQueryDto,
    ) {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            order = 'desc',
            status,
            search,
        } = query;

        const where: any = {
            organizationId,
            deletedAt: null,
        };

        if (status) {
            where.status = status;
        }

        if (search) {
            where.OR = [
                {
                    title: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    customer: {
                        fullName: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                },
            ];
        }

        const [items, total] = await this.prisma.$transaction([
            this.prisma.proposal.findMany({
                where,
                include: {
                    customer: {
                        select: {
                            fullName: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    [sortBy]: order,
                },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.proposal.count({ where }),
        ]);

        return {
            items,
            total,
            page,
            limit,
        };
    }
}
