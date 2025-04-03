import { PartialType } from '@nestjs/swagger';
import { CreateAIProviderConfigDto } from './create-ai-provider-config.dto';

export class UpdateAIProviderConfigDto extends PartialType(
  CreateAIProviderConfigDto,
) {}
