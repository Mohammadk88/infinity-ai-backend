import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  /**
   * Register a new user and return token and user object
   * @param dto RegisterDto
   * @returns Promise<{ token: string; user: User }>
   */
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  async register(dto: RegisterDto): Promise<{ token: string; user: User }> {
    try {
      const hashedPassword: string = await bcrypt.hash(dto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hashedPassword,
        },
      });

      const token = this.jwt.sign({ sub: user.id });

      return { token, user };
    } catch (error) {
      console.error('Registration error:', error);
      throw new UnauthorizedException('Registration failed');
    }
  }

  /**
   * Login an existing user by checking email and password
   * @param dto LoginDto
   * @returns Promise<{ token: string; user: User }>
   */
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  async login(dto: LoginDto): Promise<{ token: string; user: User }> {
    if (!dto.email) {
      console.log('Email is required', dto);
      throw new UnauthorizedException('Email is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('User not found');

    try {
      const passwordValid = await bcrypt.compare(
        dto.password,
        user.password ?? '',
      );

      if (!passwordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.jwt.sign({ sub: user.id });

      return { token, user };
    } catch (error) {
      console.error('Password comparison error:', error);
      throw new UnauthorizedException('Authentication error');
    }
  }
}
