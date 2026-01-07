import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/inbound/route';
import { NextRequest } from 'next/server';
import * as db from '@/lib/db.server';
import * as mailgun from '@/lib/mailgun';
import * as ai from '@/lib/ai';

vi.mock('@/lib/supabase/admin', () => ({
  supabaseAdmin: {
    from: vi.fn(),
  },
}));

vi.mock('@/lib/db.server');
vi.mock('@/lib/mailgun');
vi.mock('@/lib/ai');

describe('Inbound API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockRequest = (data: Record<string, string>) => {
    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
    return {
      formData: async () => {
        const fd = new FormData();
        for (const [key, value] of Object.entries(data)) {
          fd.append(key, value);
        }
        return fd;
      }
    } as unknown as NextRequest;
  };

  it('should forward email successfully', async () => {
    const mockUser = {
      id: 'u1',
      email: 'real@email.com',
      username: 'mario'
    };

    vi.mocked(mailgun.verifySignature).mockReturnValue(true);
    vi.mocked(db.getUserBySupamailAddress).mockResolvedValue(mockUser as any);
    vi.mocked(db.getRulesForUser).mockResolvedValue([]);
    vi.mocked(ai.generateSmartSubject).mockResolvedValue({
      summary: 'Summary',
      enhancedSubject: '[Summary] Hello'
    });

    const req = createMockRequest({
      from: 'sender@example.com',
      recipient: 'mario@supamail.mariobalca.com',
      subject: 'Hello',
      'body-plain': 'Test body',
      timestamp: '123',
      token: 'abc',
      signature: 'sig'
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.message).toBe('Email forwarded');
    expect(mailgun.forwardEmail).toHaveBeenCalled();
    expect(db.logEmailActivity).toHaveBeenCalledWith(expect.objectContaining({
      status: 'forwarded'
    }));
  });

  it('should block email if rule matches', async () => {
    const mockUser = { id: 'u1', username: 'mario' };
    const mockRules = [{ action: 'block', pattern: 'spam.com' }];

    vi.mocked(mailgun.verifySignature).mockReturnValue(true);
    vi.mocked(db.getUserBySupamailAddress).mockResolvedValue(mockUser as any);
    vi.mocked(db.getRulesForUser).mockResolvedValue(mockRules as any);

    const req = createMockRequest({
      from: 'bad@spam.com',
      recipient: 'mario@supamail.mariobalca.com',
      subject: 'Spam',
      timestamp: '123',
      token: 'abc',
      signature: 'sig'
    });

    const response = await POST(req);
    const json = await response.json();

    expect(json.message).toBe('Email blocked');
    expect(mailgun.forwardEmail).not.toHaveBeenCalled();
    expect(db.logEmailActivity).toHaveBeenCalledWith(expect.objectContaining({
      status: 'blocked'
    }));
  });

  it('should return 401 for invalid signature', async () => {
    vi.mocked(mailgun.verifySignature).mockReturnValue(false);

    const req = createMockRequest({
      timestamp: '123',
      token: 'abc',
      signature: 'wrong'
    });

    const response = await POST(req);
    expect(response.status).toBe(401);
  });
});
