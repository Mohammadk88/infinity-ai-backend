import { IsEmail, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvitationDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '2ecb7394-435f-4aa5-b1e1-4fef2cb2dc3a' })
  @IsUUID()
  companyId!: string;

  @ApiProperty({ example: '4e87f9c7-77cd-4bc3-b3fc-bda9db1db38f' })
  @IsUUID()
  roleId!: string;

  @ApiProperty({ example: 'admin-user-id-uuid' })
  @IsUUID()
  invitedBy!: string;

  @ApiProperty({ example: '2024-12-31T23:59:59.999Z', required: false })
  @IsOptional()
  expiresAt?: string;
}
