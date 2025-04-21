import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRewardRedemptionDto {
  @ApiProperty({ description: 'The ID of the award the user wants to redeem.' })
  @IsString()
  @IsNotEmpty()
  awardId!: string;
}
