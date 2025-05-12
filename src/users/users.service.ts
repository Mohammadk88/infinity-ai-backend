import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create({
    email,
    name,
    password,
    emailVerified = false,
  }: {
    email: string;
    name: string;
    password: string;
    emailVerified?: boolean;
  }) {
    const hashedPassword = await hash(password, 10);

    return this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        emailVerified: emailVerified ? new Date() : null,
      },
    });
  }

  async findById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
  async verifyEmail(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isEmailVerified: true },
    });
  }
  async createUserFromInvitation(data: {
    email: string;
    password: string;
    name: string;
  }) {
    const hashedPassword = await hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        isEmailVerified: true,
      },
    });
  }
}
