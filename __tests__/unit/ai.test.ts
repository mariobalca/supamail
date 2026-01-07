import { describe, it, expect, vi } from 'vitest';
import { generateSmartSubject } from '@/lib/ai';
import OpenAI from 'openai';

const mockCreate = vi.fn().mockResolvedValue({
  choices: [{ message: { content: 'Test Summary' } }],
});

vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(function() {
      return {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      };
    }),
  };
});

describe('AI Service', () => {
  it('should generate an enhanced subject', async () => {
    const result = await generateSmartSubject('Hello', 'This is a test email body.');
    expect(result.summary).toBe('Test Summary');
    expect(result.enhancedSubject).toBe('[Test Summary] Hello');
  });

  it('should handle AI errors gracefully', async () => {
    const mockOpenAI = new OpenAI();
    vi.mocked(mockOpenAI.chat.completions.create).mockRejectedValueOnce(new Error('AI Fail'));

    const result = await generateSmartSubject('Hello', 'Body');
    expect(result.summary).toBe('Summary unavailable');
    expect(result.enhancedSubject).toBe('[AI] Hello');
  });
});
