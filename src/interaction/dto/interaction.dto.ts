import { ApiProperty } from '@nestjs/swagger';

export class InteractionDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  clientId!: string;

  @ApiProperty()
  companyId!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ enum: ['CALL', 'MEETING', 'EMAIL', 'SOCIAL_MEDIA', 'OTHER'] })
  type!: string;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty({ required: false })
  status?: string;

  @ApiProperty({ required: false })
  scheduledAt?: Date;

  @ApiProperty({ required: false })
  completedAt?: Date;

  @ApiProperty({ required: false })
  duration?: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
