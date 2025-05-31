import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PublishLinkedinDto {
  @ApiProperty({ example: 'postId-uuid' })
  @IsString()
  @IsNotEmpty()
  postId!: string;

  @ApiProperty({ example: 'accountId-uuid' })
  @IsString()
  @IsNotEmpty()
  socialAccountId!: string;
}
