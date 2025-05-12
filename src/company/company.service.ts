import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { RolesService } from 'src/role/role.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { defaultCompanyRoles } from './constants/default-roles';

@Injectable()
export class CompanyService {
  constructor(
    private prisma: PrismaService,
    private rolesService: RolesService, // ⭐ Inject RolesService
  ) {}
  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: { CompanySetting: true },
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }
  async create(data: CreateCompanyDto, ownerId?: string) {
    const createData = { ...data };
    const company = await this.prisma.company.create({
      data: {
        ...createData,
        ...(ownerId ? { owner: { connect: { id: ownerId } } } : {}),
      },
    });

    // ✅ Add default roles for this company
    // ✅ Add default roles for this company
    await Promise.all(
      defaultCompanyRoles.map((role) =>
        this.rolesService.create({
          companyId: company.id,
          name: role.name,
          isDefault: role.isDefault,
        }),
      ),
    );

    return company;
  }
  async update(id: string, dto: UpdateCompanyDto) {
    return this.prisma.company.update({
      where: { id },
      data: {
        name: dto.name,
        type: dto.type,
        verified: dto.verified,
        isActive: dto.isActive,
      },
    });
  }
}
