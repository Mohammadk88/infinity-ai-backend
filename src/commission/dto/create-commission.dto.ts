// src/commission/dto/create-commission.dto.ts

import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum CommissionType {
  REFERRAL = 'referral',
  BONUS = 'bonus',
  PAYOUT = 'payout',
}

export enum CommissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  PAID = 'paid',
}

export class CreateCommissionDto {
  @ApiProperty({ enum: CommissionType })
  @IsEnum(CommissionType)
  type!: CommissionType;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currency!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  source?: string;
}
