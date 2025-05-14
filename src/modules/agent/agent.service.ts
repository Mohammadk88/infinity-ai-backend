// apps/backend/src/modules/agent/agent.service.ts

import { Injectable } from '@nestjs/common';
import { MemoryService } from '../memory/memory.service';
import { LLMService } from '../llm/llm.service';

@Injectable()
export class AgentService {
  constructor(
    private readonly memoryService: MemoryService,
    private readonly llmService: LLMService,
  ) {}

  async processMessage(
    userId: string,
    projectId: string,
    userMessage: string,
    modelName?: string,
  ) {
    // 1️⃣ get memory context
    const context = await this.memoryService.getContextForAssistant(
      userId,
      projectId,
      userMessage,
    );

    // 2️⃣ build messages
    const messages = [
      {
        role: 'system',
        content: `You are Infinity AI Assistant for project ${projectId}. Knowledge:\n${context}\n\nAnswer:`,
      },
      { role: 'user', content: userMessage },
    ];

    // 3️⃣ get LLM adapter (default = OpenAI)
    const adapter = this.llmService.getAdapter('openai');

    // 4️⃣ send to LLM
    const response = await adapter.sendMessage(messages, {
      model: modelName ?? 'gpt-4.1-nano',
    });

    return response;
  }
}
