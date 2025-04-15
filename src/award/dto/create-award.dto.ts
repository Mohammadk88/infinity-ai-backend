import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateAwardDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  pointsCost!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsString()
  type!: string;

  @IsString()
  value!: string;
}
