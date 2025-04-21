import { Injectable, NotFoundException } from '@nestjs/common';
import { InteractionType } from '@prisma/client'; // Ensure this is the correct path to InteractionType
import { PrismaService } from '../prisma/prisma.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';

@Injectable()
export class InteractionService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateInteractionDto) {
    try {
      return await this.prisma.interaction.create({
        data: {
          ...data,
          type: data.type as InteractionType,
        },
      });
    } catch (error) {
      throw new Error(
        `Failed to create interaction: ${(error as Error).message}`,
      );
    }
  }

  async findAll() {
    return this.prisma.interaction.findMany();
  }

  async findOne(id: string) {
    const interaction = await this.prisma.interaction.findUnique({
      where: { id },
    });
    if (!interaction) throw new NotFoundException('Interaction not found');
    return interaction;
  }

  async update(id: string, data: UpdateInteractionDto) {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );
    return this.prisma.interaction.update({
      where: { id },
      data: filteredData,
    });
  }

  async remove(id: string) {
    return await this.prisma.interaction.delete({ where: { id } });
  }
}
