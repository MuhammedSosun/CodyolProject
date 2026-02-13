import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomerRepository } from './customer.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { CustomerStatus } from './enums/customer-status.enum';
import { CustomerListQueryDto } from './dto/customer-list-query.dto';
import { TransactionService } from '../transaction/transaction.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class CustomerService {
  constructor(
  private readonly repo: CustomerRepository,
  private readonly prisma: PrismaService,
  private readonly transactionService: TransactionService, // Burada olması normal
) {}

  async create(dto: CreateCustomerDto, user: any) {
    if (dto.email) {
      const exists = await this.repo.existsByEmail(dto.email);
      if (exists) {
        throw new ConflictException('Email already exists');
      }
    }

    const customer = await this.repo.create({
      owner: { connect: { id: user.id } },
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      companyName: dto.companyName,
      vatNumber: dto.vatNumber,
      website: dto.website,
      address: dto.address,
      description: dto.description,
      designation: dto.designation,
      status: dto.status ?? CustomerStatus.NEW,
    });

    return this.toResponse(customer);
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const current = await this.repo.findById(id);
    if (!current) throw new NotFoundException('Customer not found');

    const updated = await this.repo.updateSafe(id, dto);
    if (!updated) throw new NotFoundException('Customer not found');

    return this.toResponse(updated);
  }

  async delete(id: string) {
    const deleted = await this.repo.softDeleteSafe(id);
    if (!deleted) throw new NotFoundException('Customer not found');

    await this.prisma.task.updateMany({
      where: { customerId: id },
      data: { customerId: null },
    });
  }

  async findOne(id: string, user: any) {
    const customer = await this.repo.findById(id);

    if (!customer) throw new NotFoundException('Customer not found');

    if (customer.ownerUserId !== user.id) {
      throw new UnauthorizedException('Bu müşteriye erişemezsin');
    }

    return this.toDetailResponse(customer);
  }

  async list(query: CustomerListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const { items, total } = await this.repo.list({
      page,
      limit,
      sortBy: query.sortBy ?? 'createdAt',
      order: query.order === 'asc' ? 'asc' : 'desc',
      status: query.status,
      search: query.search,
    });

    return {
      meta: { page, limit, total },
      data: items.map((c) => this.toResponse(c)),
    };
  }

  private toResponse(c: any): CustomerResponseDto {
    return {
      id: c.id,
      fullName: c.fullName,
      email: c.email,
      phone: c.phone,
      companyName: c.companyName,
      status: c.status,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    };
  }
  private toDetailResponse(c: any) {
    return {
      id: c.id,
      fullName: c.fullName,
      email: c.email,
      phone: c.phone,
      companyName: c.companyName,
      vatNumber: c.vatNumber,
      website: c.website,
      address: c.address,
      description: c.description,
      designation: c.designation,
      status: c.status,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    };
  }
  async getCustomerTransactions(id: string, query: PaginationQueryDto) {
    const customer = await this.repo.findById(id);
    if (!customer) throw new NotFoundException('Müşteri bulunamadı');

    // TransactionService'in list metodunu çağırıyoruz
    return this.transactionService.list({
        ...query,
        customerId: id
    });
}
}
