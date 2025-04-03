import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFileUploadDto } from './dto/create-file-upload.dto';
import { UpdateFileUploadDto } from './dto/update-file-upload.dto';

@Injectable()
export class FileUploadService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateFileUploadDto) {
    return this.prisma.fileUpload.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.fileUpload.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const file = await this.prisma.fileUpload.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  async update(id: string, userId: string, dto: UpdateFileUploadDto) {
    await this.findOne(id, userId);
    return this.prisma.fileUpload.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.fileUpload.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
