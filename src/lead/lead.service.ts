import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Lead } from '@prisma/client';

interface LeadFilters {
  status?: string;
  stage?: string;
  search?: string;
}
@Injectable()
export class LeadService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateLeadDto): Promise<Lead> {
    return this.prisma.lead.create({
      data: {
        ...dto,
        createdBy: userId,
        assignedTo: userId,
      },
    });
  }

  findAll(userId: string, filters: LeadFilters = {}): Promise<Lead[]> {
    const { status, stage, search } = filters;

    return this.prisma.lead.findMany({
      where: {
        assignedTo: userId,
        ...(status && { status }),
        ...(stage && { stage }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string): Promise<Lead | null> {
    return this.prisma.lead.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateLeadDto): Promise<Lead> {
    return this.prisma.lead.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string): Promise<Lead> {
    return this.prisma.lead.delete({ where: { id } });
  }
}
