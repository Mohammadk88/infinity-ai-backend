import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterFromInvitationDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'strongpassword123' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'uuid-token-from-invitation' })
  @IsString()
  @IsNotEmpty()
  token!: string;
}
