import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { OrganizationRepository } from './organization.repository';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationResponseDto } from './dto/organization-response.dto';

@Injectable()
export class OrganizationService {
    constructor(private readonly repo: OrganizationRepository) { }

    // =========================
    // CREATE
    // =========================
    async create(dto: CreateOrganizationDto): Promise<OrganizationResponseDto> {
        const normalizedSlug = dto.slug.trim().toLowerCase();

        const exists = await this.repo.findBySlug(normalizedSlug);
        if (exists) {
            throw new ConflictException('slug already exists');
        }

        const org = await this.repo.create({
            name: dto.name,
            slug: normalizedSlug,
            organizationType: dto.organizationType,
            legalName: dto.legalName,
            industry: dto.industry,
            website: dto.website,
            email: dto.email,
            phone: dto.phone,
            ownerUserId: dto.ownerUserId,
        });

        return this.toResponse(org);
    }

    // =========================
    // READ
    // =========================
    async findAll(): Promise<OrganizationResponseDto[]> {
        const list = await this.repo.findAll();
        return list.map((org) => this.toResponse(org));
    }

    async findById(id: string): Promise<OrganizationResponseDto> {
        const org = await this.repo.findById(id);
        if (!org) {
            throw new NotFoundException('Organization not found');
        }
        return this.toResponse(org);
    }

    async findBySlug(slug: string): Promise<OrganizationResponseDto> {
        const normalizedSlug = slug.trim().toLowerCase();
        const org = await this.repo.findBySlugPublic(normalizedSlug);

        if (!org) {
            throw new NotFoundException('Organization not found');
        }

        return this.toResponse(org);
    }

    // =========================
    // UPDATE
    // =========================
    async update(
        id: string,
        dto: UpdateOrganizationDto,
    ): Promise<OrganizationResponseDto> {
        const current = await this.repo.findById(id);
        if (!current) {
            throw new NotFoundException('Organization not found');
        }

        if (dto.slug && dto.slug !== current.slug) {
            const normalizedSlug = dto.slug.trim().toLowerCase();
            const slugOwner = await this.repo.findBySlug(normalizedSlug);
            if (slugOwner) {
                throw new ConflictException('slug already exists');
            }
            dto.slug = normalizedSlug;
        }

        const data = this.buildUpdateData(dto);

        const updated = await this.repo.updateSafe(id, data);
        if (!updated) {
            throw new NotFoundException('Organization not found');
        }

        return this.toResponse(updated);
    }

    // =========================
    // ACTIVATE / DEACTIVATE
    // =========================
    async activate(id: string): Promise<OrganizationResponseDto> {
        const org = await this.repo.setActive(id, true);
        if (!org) {
            throw new NotFoundException('Organization not found');
        }
        return this.toResponse(org);
    }

    async deactivate(id: string): Promise<OrganizationResponseDto> {
        const org = await this.repo.setActive(id, false);
        if (!org) {
            throw new NotFoundException('Organization not found');
        }
        return this.toResponse(org);
    }

    // =========================
    // DELETE (SOFT)
    // =========================
    async delete(id: string): Promise<void> {
        const org = await this.repo.findById(id);
        if (!org) {
            throw new NotFoundException('Organization not found');
        }
        await this.repo.softDelete(id);
    }

    // =========================
    // INTERNAL HELPERS
    // =========================
    private buildUpdateData(dto: UpdateOrganizationDto) {
        const data: Record<string, unknown> = {};

        if (dto.name !== undefined) data.name = dto.name;
        if (dto.slug !== undefined) data.slug = dto.slug;
        if (dto.organizationType !== undefined)
            data.organizationType = dto.organizationType;
        if (dto.legalName !== undefined) data.legalName = dto.legalName;
        if (dto.industry !== undefined) data.industry = dto.industry;
        if (dto.website !== undefined) data.website = dto.website;
        if (dto.email !== undefined) data.email = dto.email;
        if (dto.phone !== undefined) data.phone = dto.phone;

        return data;
    }

    private toResponse(org: any): OrganizationResponseDto {
        return {
            id: org.id,
            name: org.name,
            slug: org.slug,
            organizationType: org.organizationType,
            planType: org.planType,
            isActive: org.isActive,
            ownerUserId: org.ownerUserId,
            createdAt: org.createdAt,
            updatedAt: org.updatedAt,
        };
    }
}
