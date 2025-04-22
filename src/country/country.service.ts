import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CountryService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.country.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
