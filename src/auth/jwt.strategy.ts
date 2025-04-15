import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExtractJwt } from 'passport-jwt';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: { cookies?: { jwt?: string } }): string | null => {
          return req?.cookies?.['jwt'] || null;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET || randomUUID(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) throw new Error('Unauthorized');
    return user;
  }
}
