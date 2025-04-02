export interface PostAIPromptOptions {
  contentType?: string;
  language?: string;
  tone?: string;
  length?: 'short' | 'medium' | 'long';
  promptExtra?: string;
}

export function buildPostPrompt(options: PostAIPromptOptions): string {
  let prompt = `prompt.post.intro:${options.contentType || 'general'}`;

  if (options.language) {
    prompt += `:language:${options.language}`;
  }

  if (options.tone) {
    prompt += `:tone:${options.tone}`;
  }

  if (options.length) {
    prompt += `:length:${options.length}`;
  }

  if (options.promptExtra) {
    prompt += `:extra:${options.promptExtra}`;
  }

  prompt += `:closing:social-media-friendly`;

  return prompt;
}
