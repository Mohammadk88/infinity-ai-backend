import OpenAI from 'openai';
import { LLMAdapter } from './llm.adapter.interface';
import { ChatCompletionMessageParam } from 'openai/resources';

export class OpenAIAdapter implements LLMAdapter {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async sendMessage(
    messages: ChatCompletionMessageParam[],
    options?: Record<string, any>,
  ) {
    const completion = await this.client.chat.completions.create({
      model: (options?.model as string) ?? 'gpt-4.1-nano',
      messages,
      temperature: (options?.temperature as number) ?? 0.7,
    });

    return completion.choices[0].message?.content ?? '';
  }
}
