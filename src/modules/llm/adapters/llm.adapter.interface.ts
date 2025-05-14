export interface LLMAdapter {
  sendMessage(messages: any[], options?: Record<string, any>): Promise<string>;
}
