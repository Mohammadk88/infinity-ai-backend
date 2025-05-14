// apps/backend/src/modules/memory/dto/create-memory.dto.ts
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsArray,
} from 'class-validator';

export class CreateMemoryDto {
  @IsUUID()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsOptional()
  @IsString()
  moduleId?: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
