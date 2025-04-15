import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { UserPointService } from '../user-point/user-point.service';
@ApiTags('Auth')
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private pointsService: UserPointService,
  ) {}
  /**
   * Register a new user and return token and user object
   * @param dto RegisterDto
   * @returns Promise<{ token: string; user: User }>
   */
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  async register(createUserDto: RegisterDto) {
    const { email, password, name, referralCode } = createUserDto;

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    if (referralCode) {
      const affiliate = await this.prisma.affiliate.findUnique({
        where: { referralCode },
      });
      if (!affiliate) {
        throw new BadRequestException('invalid_referral_code');
      }
    }
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    if (referralCode) {
      const affiliate = await this.prisma.affiliate.findUnique({
        where: { referralCode },
      });
      if (affiliate) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { referredBy: referralCode },
        });

        await this.prisma.referral.create({
          data: {
            affiliateId: affiliate.id,
            referredUserId: user.id,
            commission: affiliate.commission,
            status: 'pending',
          },
        });

        await this.pointsService.addPoints(affiliate.userId, 20);
        await this.pointsService.addPoints(user.id, 10);
      }
    }

    return { message: 'Registration successful', userId: user.id };
  }

  /**
   * Login an existing user by checking email and password
   * @param dto LoginDto
   * @returns Promise<{ token: string; user: User }>
   */
  async login(dto: LoginDto): Promise<string> {
    const user = await this.validateUser(dto.email, dto.password);
    const payload = { sub: user.id, email: user.email };
    return this.jwt.sign(payload);
  }

  /**
   * Validate user credentials
   * @param email User email
   * @param password User password
   * @returns Promise<User>
   */
  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
