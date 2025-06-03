import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { UsageType } from '@prisma/client';

export class IncrementUsageDto {
  @IsEnum(UsageType as object)
  type!: UsageType;

  @IsOptional()
  @IsInt()
  @Min(1)
  amount?: number = 1;
}
