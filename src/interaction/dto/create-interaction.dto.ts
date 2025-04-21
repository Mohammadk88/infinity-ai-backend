import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  IsInt,
} from 'class-validator';

export class CreateInteractionDto {
  @ApiProperty()
  @IsString()
  clientId!: string;

  @ApiProperty()
  @IsString()
  companyId!: string;

  @ApiProperty()
  @IsString()
  userId!: string;

  @ApiProperty({ enum: ['CALL', 'MEETING', 'EMAIL', 'SOCIAL_MEDIA', 'OTHER'] })
  @IsEnum(['CALL', 'MEETING', 'EMAIL', 'SOCIAL_MEDIA', 'OTHER'])
  type!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsDateString()
  scheduledAt?: Date;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsDateString()
  completedAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  duration?: number;
}
