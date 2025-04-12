import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FacebookCallbackDto {
  @ApiProperty({ description: 'Authorization code from Facebook' })
  @IsNotEmpty()
  @IsString()
  code!: string;

  @ApiProperty({
    description: 'State value sent during auth (userId:clientId)',
  })
  @IsNotEmpty()
  @IsString()
  state!: string;
}

export class FacebookSessionData {
  @ApiProperty({ description: 'user Id Facebook' })
  @IsNotEmpty()
  @IsString()
  userId!: string;
  @ApiProperty({ description: 'Client Id Facebook' })
  @IsNotEmpty()
  @IsString()
  clientId!: string;
}
