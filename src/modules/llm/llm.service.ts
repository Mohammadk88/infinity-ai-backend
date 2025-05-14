import { Injectable } from '@nestjs/common';
import { OpenAIAdapter } from './adapters/openai.adapter';
import { LLMAdapter } from './adapters/llm.adapter.interface';

@Injectable()
export class LLMService {
  private adapters: Record<string, LLMAdapter> = {};

  constructor() {
    // Future: ممكن نضيف adapters آخرين
    this.adapters['openai'] = new OpenAIAdapter(
      process.env.OPENAI_API_KEY ?? '',
    );
  }

  getAdapter(provider: string): LLMAdapter {
    return this.adapters[provider] ?? this.adapters['openai'];
  }
}
