import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetAuthUrlDto {
  @Transform(({ value }: { value: string }) => value)
  @ApiProperty()
  @IsString()
  userId!: string;

  @Transform(({ value }: { value: string }) => value)
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clientId?: string;
}
