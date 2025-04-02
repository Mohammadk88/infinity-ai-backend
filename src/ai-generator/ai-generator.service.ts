import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AIProviderConfig } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class AIGeneratorService {
  constructor(private prisma: PrismaService) {}

  async generateSocialPostContent(
    prompt: string,
    userId: string,
  ): Promise<string> {
    const provider = await this.getActiveProvider(userId);
    return this.callAIProvider(provider, prompt);
  }

  private async getActiveProvider(userId: string): Promise<AIProviderConfig> {
    const provider = await this.prisma.aIProviderConfig.findFirst({
      where: { userId, isActive: true, isDeleted: false },
    });

    if (!provider) {
      throw new UnauthorizedException('No active AI provider configured.');
    }

    return provider;
  }

  private async callAIProvider(
    provider: AIProviderConfig,
    prompt: string,
  ): Promise<string> {
    switch (provider.provider) {
      case 'openai':
        return this.callOpenAI(prompt, provider);
      case 'gemini':
        return this.callGemini(prompt, provider);
      case 'anthropic':
        return this.callAnthropic(prompt, provider);
      case 'mistral':
      case 'deepseek':
      case 'openrouter':
        return this.callGenericOpenAICompatible(prompt, provider);
      default:
        throw new Error(`Unsupported AI provider: ${provider.provider}`);
    }
  }

  private async callOpenAI(
    prompt: string,
    provider: AIProviderConfig,
  ): Promise<string> {
    const res = await axios.post<{
      choices: { message: { content: string } }[];
    }>(
      provider.baseUrl + '/chat/completions' ||
        'https://api.openai.com/v1/chat/completions',
      {
        model: provider.model || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${provider.apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return res.data.choices[0].message.content;
  }

  private async callGemini(
    prompt: string,
    provider: AIProviderConfig,
  ): Promise<string> {
    const genAI = new (
      await import('@google/generative-ai')
    ).GoogleGenerativeAI(provider.apiKey);
    const model = genAI.getGenerativeModel({
      model: provider.model || 'gemini-pro',
    });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  private async callAnthropic(
    prompt: string,
    provider: AIProviderConfig,
  ): Promise<string> {
    const anthropic = new (await import('@anthropic-ai/sdk')).default({
      apiKey: provider.apiKey,
    });
    const result = await anthropic.messages.create({
      model: provider.model || 'claude-3-opus-20240229',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });
    // استخراج أول بلوك فيه نص
    interface ContentBlock {
      type: string;
      text?: string;
    }

    const textBlock = result.content.find(
      (block: ContentBlock) => block.type === 'text' && 'text' in block,
    ) as ContentBlock | undefined;

    if (!textBlock || !textBlock.text) {
      throw new Error('No text block found in Anthropic response');
    }

    return textBlock.text;
  }

  private async callGenericOpenAICompatible(
    prompt: string,
    provider: AIProviderConfig,
  ): Promise<string> {
    const res = await axios.post<{
      choices: { message: { content: string } }[];
    }>(
      provider.baseUrl + '/chat/completions' ||
        'https://api.openrouter.ai/v1/chat/completions',
      {
        model: provider.model || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${provider.apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (res.status !== 200) {
      throw new Error(
        `Error calling AI provider: ${res.status} - ${res.statusText}`,
      );
    }

    if (!res.data.choices || res.data.choices.length === 0) {
      throw new Error('No choices returned from AI provider');
    }

    if (!res.data.choices[0].message || !res.data.choices[0].message.content) {
      throw new Error('No content returned from AI provider');
    }

    return res.data.choices[0].message.content;
  }
}
