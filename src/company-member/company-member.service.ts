import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyMemberDto } from './dto/create-company-member.dto';
import { UpdateCompanyMemberDto } from './dto/update-company-member.dto';

@Injectable()
export class CompanyMemberService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCompanyMemberDto) {
    return this.prisma.companyMember.create({ data: dto });
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
  async addMember(data: {
    companyId: string;
    roleId: string;
    userId: string;
    addedBy: string;
  }) {
    return this.prisma.companyMember.create({
      data,
    });
  }
}
