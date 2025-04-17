import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  name: string = '';

  @ApiProperty()
  @IsEmail()
  email: string = '';

  @ApiProperty()
  @IsString()
  password: string = '';

  @IsOptional()
  @IsString()
  referralCode?: string;

  @IsOptional()
  @IsBoolean()
  isAffiliate?: boolean; // 👈 الحقل الجديد
}
