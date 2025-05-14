import { Test, TestingModule } from '@nestjs/testing';
import { AgentService } from './agent.service';
import { MemoryService } from '../memory/memory.service';
import { LLMService } from '../llm/llm.service';

describe('AgentService', () => {
  let agentService: AgentService;
  let memoryService: MemoryService;
  const llmMock = {
    getAdapter: jest.fn().mockReturnValue({
      sendMessage: jest.fn().mockResolvedValue('mock AI response'),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentService,
        {
          provide: MemoryService,
          useValue: {
            getContextForAssistant: jest.fn().mockResolvedValue('mock context'),
          } as Partial<MemoryService>,
        },
        { provide: LLMService, useValue: llmMock },
      ],
    }).compile();

    agentService = module.get<AgentService>(AgentService);
    memoryService = module.get<MemoryService>(MemoryService);
  });

  it('should be defined', () => {
    expect(agentService).toBeDefined();
  });

  it('should call memory and return AI response', async () => {
    const result = await agentService.processMessage(
      'user1',
      'project1',
      'Hello!',
    );

    expect(result).toBe('mock AI response');
    expect(
      (memoryService.getContextForAssistant as jest.Mock).mock.calls[0],
    ).toEqual(['user1', 'project1', 'Hello!']);
    expect(llmMock.getAdapter).toHaveBeenCalledWith('openai');
  });
});
