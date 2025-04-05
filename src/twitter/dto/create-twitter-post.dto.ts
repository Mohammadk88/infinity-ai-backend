import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator/types/decorator/decorators';

export class CreateTwitterPostDto {
  @ApiProperty()
  @IsString()
  status!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @ApiProperty()
  @IsString()
  socialAccountId!: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  tagIds?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  categoryIds?: string[];
}
