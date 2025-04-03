import { IsNotEmpty, IsUUID, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamMemberDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  teamId!: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ enum: UserRole, default: UserRole.TEAM_MEMBER })
  @IsEnum(UserRole)
  role!: UserRole;
}
