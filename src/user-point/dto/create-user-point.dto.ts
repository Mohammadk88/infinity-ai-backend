import { IsUUID, IsInt, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserPointDto {
  @ApiProperty()
  @IsUUID('4')
  userId!: string;

  @ApiProperty()
  @IsInt()
  points!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  totalPoints?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  redeemedPoints?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  pendingPoints?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  approvedPoints?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  rejectedPoints?: number;

  @ApiPropertyOptional({ enum: ['active', 'inactive', 'suspended'] })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'suspended'])
  status?: string;
}
