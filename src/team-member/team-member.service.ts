import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';

@Injectable()
export class TeamMemberService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTeamMemberDto) {
    return this.prisma.teamMember.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.teamMember.findMany();
  }

  async findOne(id: string) {
    const member = await this.prisma.teamMember.findUnique({ where: { id } });
    if (!member) throw new NotFoundException('Team member not found');
    return member;
  }

  async update(id: string, dto: UpdateTeamMemberDto) {
    return this.prisma.teamMember.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.teamMember.delete({ where: { id } });
  }
}
