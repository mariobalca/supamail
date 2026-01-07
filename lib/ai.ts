import OpenAI from 'openai';
import { SmartSubject } from '@/types/ai';

let openaiInstance: OpenAI | null = null;

const getOpenAI = () => {
  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
    });
  }
  return openaiInstance;
};

export const generateSmartSubject = async (
  subject: string,
  body: string
): Promise<SmartSubject> => {
  try {
    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an email assistant. Summarize the following email in 3-5 words to be used in a subject line prefix like [Summary].',
        },
        {
          role: 'user',
          content: `Subject: ${subject}\n\nBody: ${body}`,
        },
      ],
      max_tokens: 10,
    });

    const summary = response.choices[0]?.message?.content?.trim() || 'Summary';
    return {
      summary,
      enhancedSubject: `[${summary}] ${subject}`,
    };
  } catch (error) {
    console.error('AI Summary error:', error);
    return {
      summary: 'Summary unavailable',
      enhancedSubject: `[AI] ${subject}`,
    };
  }
};
