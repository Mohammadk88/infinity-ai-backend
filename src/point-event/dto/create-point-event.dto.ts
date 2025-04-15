import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// src/modules/point-event/dto/create-point-event.dto.ts
import { IsUUID, IsString, IsInt, IsOptional } from 'class-validator';

export class CreatePointEventDto {
  @ApiProperty()
  @IsUUID()
  userId!: string;

  @ApiProperty()
  @IsString()
  type!: string; // مثال: "login", "referral_approved", "post_created"

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsInt()
  points!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;
}
