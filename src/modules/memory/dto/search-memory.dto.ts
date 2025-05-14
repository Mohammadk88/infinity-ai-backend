// apps/backend/src/modules/memory/dto/search-memory.dto.ts
import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class SearchMemoryDto {
  @IsUUID()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  query!: string;

  @IsOptional()
  @IsString()
  moduleId?: string;
}
