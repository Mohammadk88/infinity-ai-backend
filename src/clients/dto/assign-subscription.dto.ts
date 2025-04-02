import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignSubscriptionDto {
  @ApiProperty({ description: 'معرف باقة الاشتراك المراد تعيينها للعميل' })
  @IsNotEmpty()
  @IsString()
  subscriptionId!: string;
}
