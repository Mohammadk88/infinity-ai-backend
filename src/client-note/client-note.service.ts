import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientNoteDto } from './dto/create-client-note.dto';
import { UpdateClientNoteDto } from './dto/update-client-note.dto';
import { ClientNote } from '@prisma/client';

@Injectable()
export class ClientNoteService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateClientNoteDto): Promise<ClientNote> {
    return this.prisma.clientNote.create({
      data: {
        content: dto.content,
        clientId: dto.clientId,
        authorId: userId,
      },
    });
  }

  findAll(clientId: string): Promise<ClientNote[]> {
    return this.prisma.clientNote.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string): Promise<ClientNote | null> {
    return this.prisma.clientNote.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateClientNoteDto): Promise<ClientNote> {
    return this.prisma.clientNote.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string): Promise<ClientNote> {
    return this.prisma.clientNote.delete({ where: { id } });
  }
}
