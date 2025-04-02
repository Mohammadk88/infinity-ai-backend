import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export enum AIProviderType {
  OPENAI = 'openai',
  GEMINI = 'gemini',
  ANTHROPIC = 'anthropic',
  MISTRAL = 'mistral',
  DEEPSEEK = 'deepseek',
  OPENROUTER = 'openrouter',
}
export class GenerateContentDto {
  // @ApiProperty({ enum: AIProviderType })
  // provider!: AIProviderType;

  // @ApiProperty({ example: 'gpt-4' })
  // model?: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'write an educational Instagram post about AI' })
  prompt!: string;
}
