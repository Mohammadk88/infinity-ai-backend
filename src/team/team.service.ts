import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, clientId: string, dto: CreateTeamDto) {
    return this.prisma.team.create({
      data: {
        name: dto.name,
        userId,
        clientId,
      },
    });
  }

  findAll(clientId: string) {
    return this.prisma.team.findMany({
      where: { clientId },
    });
  }

  findOne(id: string) {
    return this.prisma.team.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateTeamDto) {
    const existing = await this.prisma.team.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Team not found');
    return this.prisma.team.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.team.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Team not found');
    return this.prisma.team.delete({ where: { id } });
  }
}
