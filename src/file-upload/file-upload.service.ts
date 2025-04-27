import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFileUploadDto } from './dto/create-file-upload.dto';
import { UpdateFileUploadDto } from './dto/update-file-upload.dto';
import { AppConfig } from '../common/config/app.config';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly appConfig: AppConfig,
  ) {}

  async create(userId: string, dto: CreateFileUploadDto) {
    const file = await this.prisma.fileUpload.create({
      data: {
        ...dto,
        userId,
      },
    });

    // Add full domain URL to the file URL
    if (file.url) {
      file.url = this.appConfig.getFullUrl(file.url);
    }

    return file;
  }

  async findAll(userId: string) {
    const files = await this.prisma.fileUpload.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Add full domain URL to all files
    return files.map((file) => ({
      ...file,
      url: this.appConfig.getFullUrl(file.url),
    }));
  }

  async findOne(id: string, userId: string) {
    const file = await this.prisma.fileUpload.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Add full domain URL
    if (file.url) {
      file.url = this.appConfig.getFullUrl(file.url);
    }

    return file;
  }

  async update(id: string, userId: string, dto: UpdateFileUploadDto) {
    await this.findOne(id, userId);
    const updatedFile = await this.prisma.fileUpload.update({
      where: { id },
      data: dto,
    });

    // Add full domain URL
    if (updatedFile.url) {
      updatedFile.url = this.appConfig.getFullUrl(updatedFile.url);
    }

    return updatedFile;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    const file = await this.prisma.fileUpload.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // Add full domain URL
    if (file.url) {
      file.url = this.appConfig.getFullUrl(file.url);
    }

    return file;
  }
}
