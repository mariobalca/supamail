import OpenAI from 'openai';
import { SmartSubject } from '@/types/ai';
import { getAllCategories, getOrCreateCategory } from '@/lib/db.server';

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
    const existingCategories = await getAllCategories();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an email assistant. Analyze the email and return a JSON object with two fields: 
"summary" (a 3-5 word summary for a subject line prefix) and 
"category" (the most appropriate category for this email).

Existing categories are: ${existingCategories.join(', ')}.
If one of the existing categories matches, use it. If not, suggest a new, concise category name (1-2 words).`,
        },
        {
          role: 'user',
          content: `Subject: ${subject}\n\nBody: ${body}`,
        },
      ],
      max_tokens: 50,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content || '{}';
    const { summary, category: rawCategory } = JSON.parse(content);

    const finalSummary = summary || 'Summary';
    const finalCategory = await getOrCreateCategory(rawCategory || 'Updates');

    return {
      summary: finalSummary,
      enhancedSubject: `[${finalSummary}] ${subject}`,
      category: finalCategory,
    };
  } catch (error) {
    console.error('AI Analysis error:', error);
    return {
      summary: 'Summary unavailable',
      enhancedSubject: `[AI] ${subject}`,
      category: 'Updates',
    };
  }
};
