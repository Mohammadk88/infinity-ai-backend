import * as OpenAI from 'openai';
const openai = new OpenAI.OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small', // الأفضل حاليا
    input: text,
  });

  return response.data[0].embedding;
}
