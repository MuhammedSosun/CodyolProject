import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CustomerRepository, CustomerListParams } from './customer.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { CustomerStatus } from './enums/customer-status.enum';
import { CustomerListQueryDto } from './dto/customer-list-query.dto';

@Injectable()
export class CustomerService {
    constructor(
        private readonly repo: CustomerRepository,
        private readonly prisma: PrismaService,
    ) { }

    async create(dto: CreateCustomerDto): Promise<CustomerResponseDto> {
        const org = await this.prisma.organization.findFirst({
            where: {
                id: dto.organizationId,
                deletedAt: null,
                isActive: true,
            },
            select: { id: true },
        });

        if (!org) throw new NotFoundException('Organization not found');

        if (dto.email) {
            const exists = await this.repo.existsByEmail(
                dto.organizationId,
                dto.email,
            );
            if (exists) {
                throw new ConflictException('Email already exists in organization');
            }
        }

        const customer = await this.repo.create({
            organization: { connect: { id: dto.organizationId } },
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            phone: dto.phone,
            status: dto.status ?? CustomerStatus.LEAD,
        });

        return this.toResponse(customer);
    }

    async update(
        id: string,
        organizationId: string,
        dto: UpdateCustomerDto,
    ): Promise<CustomerResponseDto> {
        const current = await this.repo.findByIdAndOrg(id, organizationId);
        if (!current) throw new NotFoundException('Customer not found');

        if (dto.email) {
            const exists = await this.repo.existsByEmail(
                organizationId,
                dto.email,
                id,
            );
            if (exists) {
                throw new ConflictException('Email already exists in organization');
            }
        }

        const data: Record<string, unknown> = {};
        if (dto.firstName !== undefined) data.firstName = dto.firstName;
        if (dto.lastName !== undefined) data.lastName = dto.lastName;
        if (dto.email !== undefined) data.email = dto.email;
        if (dto.phone !== undefined) data.phone = dto.phone;
        if (dto.status !== undefined) data.status = dto.status;

        const updated = await this.repo.updateSafe(id, organizationId, data);
        if (!updated) throw new NotFoundException('Customer not found');

        return this.toResponse(updated);
    }

    async delete(id: string, organizationId: string): Promise<void> {
        const deleted = await this.repo.softDeleteSafe(id, organizationId);
        if (!deleted) throw new NotFoundException('Customer not found');

        // customer silinince task'ları unlink et
        await this.prisma.task.updateMany({
            where: { customerId: id },
            data: { customerId: null },
        });
    }

    async list(query: CustomerListQueryDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        const allowedSortBy: CustomerListParams['sortBy'][] = [
            'createdAt',
            'updatedAt',
            'firstName',
            'lastName',
        ];

        const sortBy = allowedSortBy.includes(query.sortBy as any)
            ? (query.sortBy as CustomerListParams['sortBy'])
            : 'createdAt';

        const order: CustomerListParams['order'] =
            query.order === 'asc' ? 'asc' : 'desc';

        const { items, total } = await this.repo.list({
            page,
            limit,
            sortBy,
            order,
            organizationId: query.organizationId,
            status: query.status,
            search: query.search,
        });

        return {
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            data: items.map((c) => this.toResponse(c)),
        };
    }

    private toResponse(c: any): CustomerResponseDto {
        return {
            id: c.id,
            organizationId: c.organizationId,
            firstName: c.firstName,
            lastName: c.lastName,
            email: c.email,
            phone: c.phone,
            status: c.status,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
        };
    }
}
