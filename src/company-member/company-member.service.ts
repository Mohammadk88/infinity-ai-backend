import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyMemberDto } from './dto/create-company-member.dto';
import { UpdateCompanyMemberDto } from './dto/update-company-member.dto';
import { UpdateCompanyMemberRoleDto } from './dto/update-company-member-role.dto';
import { ToggleCompanyMemberStatusDto } from './dto/toggle-company-member-status.dto';

interface AddCompanyMemberDto {
  companyId: string;
  roleId: string;
  userId: string;
  email?: string;
  addedBy?: string;
}
@Injectable()
export class CompanyMemberService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCompanyMemberDto) {
    return this.prisma.companyMember.create({ data: dto });
  }
  async findAllByCompany(companyId: string) {
    return this.prisma.companyMember.findMany({
      where: { companyId },
      include: { user: true, role: true },
    });
  }

  findAll() {
    return this.prisma.companyMember.findMany({
      include: { user: true, role: true },
    });
  }

  findOne(id: string) {
    return this.prisma.companyMember.findUnique({
      where: { id },
      include: { user: true, role: true },
    });
  }

  update(id: string, dto: UpdateCompanyMemberDto) {
    return this.prisma.companyMember.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.companyMember.delete({ where: { id } });
  }
  async addMember(dto: AddCompanyMemberDto, invitedBy: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      // User exists ➔ Add to company
      return this.prisma.companyMember.create({
        data: {
          userId: existingUser.id,
          companyId: dto.companyId,
          roleId: dto.roleId,
          createdBy: invitedBy,
        },
      });
    } else {
      // User not exists ➔ return false, let controller trigger invitation flow
      return null;
    }
  }
  async updateRole(memberId: string, dto: UpdateCompanyMemberRoleDto) {
    return this.prisma.companyMember.update({
      where: { id: memberId },
      data: { roleId: dto.roleId },
    });
  }

  async toggleStatus(memberId: string, dto: ToggleCompanyMemberStatusDto) {
    return this.prisma.companyMember.update({
      where: { id: memberId },
      data: { isActive: dto.isActive },
    });
  }

  async removeMember(memberId: string) {
    return this.prisma.companyMember.delete({
      where: { id: memberId },
    });
  }
}
