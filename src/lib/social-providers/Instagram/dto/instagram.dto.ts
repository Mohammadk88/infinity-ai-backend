import { ApiProperty } from '@nestjs/swagger';

export class InstagramAuthUrlDto {
  @ApiProperty({ description: 'User ID' })
  userId!: string;

  @ApiProperty({ description: 'Client ID' })
  clientId?: string;
}

export class InstagramCallbackDto {
  @ApiProperty({ description: 'OAuth code from Instagram' })
  code!: string;

  @ApiProperty({ description: 'State containing userId and clientId' })
  state!: string;
}
