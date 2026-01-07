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
      },
    } as unknown as NextRequest;
  };

  it('should forward email successfully', async () => {
    const mockUser = {
      id: 'u1',
      email: 'real@email.com',
      username: 'username',
    };

    vi.mocked(mailgun.verifySignature).mockReturnValue(true);
    vi.mocked(db.getUserBySupamailAddress).mockResolvedValue(mockUser as any);
    vi.mocked(db.getRulesForUser).mockResolvedValue([]);
    vi.mocked(ai.generateSmartSubject).mockResolvedValue({
      summary: 'Summary',
      enhancedSubject: '[Summary] Hello',
      category: 'Personal',
    });

    const req = createMockRequest({
      from: 'sender@example.com',
      recipient: 'username@supamail-domain.com',
      subject: 'Hello',
      'body-plain': 'Test body',
      timestamp: '123',
      token: 'abc',
      signature: 'sig',
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.message).toBe('Email forwarded');
    expect(mailgun.forwardEmail).toHaveBeenCalled();
    expect(db.logEmailActivity).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'forwarded',
      })
    );
  });

  it('should block email if rule matches (domain)', async () => {
    const mockUser = { id: 'u1', username: 'username' };
    const mockRules = [
      { action: 'block', pattern: 'spam.com', type: 'domain' },
    ];

    vi.mocked(mailgun.verifySignature).mockReturnValue(true);
    vi.mocked(db.getUserBySupamailAddress).mockResolvedValue(mockUser as any);
    vi.mocked(db.getRulesForUser).mockResolvedValue(mockRules as any);
    vi.mocked(ai.generateSmartSubject).mockResolvedValue({
      summary: 'Spam',
      enhancedSubject: '[Spam] Promo',
      category: 'Promotions',
    });

    const req = createMockRequest({
      from: 'bad@spam.com',
      recipient: 'username@supamail-domain.com',
      subject: 'Spam',
      timestamp: '123',
      token: 'abc',
      signature: 'sig',
    });

    const response = await POST(req);
    const json = await response.json();

    expect(json.message).toBe('Email blocked');
    expect(mailgun.forwardEmail).not.toHaveBeenCalled();
  });

  it('should block email if rule matches (category)', async () => {
    const mockUser = { id: 'u1', username: 'username' };
    const mockRules = [
      { action: 'block', pattern: 'Promotions', type: 'category' },
    ];

    vi.mocked(mailgun.verifySignature).mockReturnValue(true);
    vi.mocked(db.getUserBySupamailAddress).mockResolvedValue(mockUser as any);
    vi.mocked(db.getRulesForUser).mockResolvedValue(mockRules as any);
    vi.mocked(ai.generateSmartSubject).mockResolvedValue({
      summary: 'Promo',
      enhancedSubject: '[Promo] Sale',
      category: 'Promotions',
    });

    const req = createMockRequest({
      from: 'newsletter@store.com',
      recipient: 'username@supamail-domain.com',
      subject: 'Sale',
      timestamp: '123',
      token: 'abc',
      signature: 'sig',
    });

    const response = await POST(req);
    const json = await response.json();

    expect(json.message).toBe('Email blocked');
    expect(mailgun.forwardEmail).not.toHaveBeenCalled();
  });

  it('should allow email if whitelisted email overrides blocked domain', async () => {
    const mockUser = { id: 'u1', username: 'username', email: 'username@real.com' };
    const mockRules = [
      { action: 'block', pattern: 'spam.com', type: 'domain' },
      { action: 'allow', pattern: 'good@spam.com', type: 'email' },
    ];

    vi.mocked(mailgun.verifySignature).mockReturnValue(true);
    vi.mocked(db.getUserBySupamailAddress).mockResolvedValue(mockUser as any);
    vi.mocked(db.getRulesForUser).mockResolvedValue(mockRules as any);
    vi.mocked(ai.generateSmartSubject).mockResolvedValue({
      summary: 'Summary',
      enhancedSubject: '[Summary] Hi',
      category: 'Personal',
    });

    const req = createMockRequest({
      from: 'good@spam.com',
      recipient: 'username@supamail-domain.com',
      subject: 'Hi',
      timestamp: '123',
      token: 'abc',
      signature: 'sig',
    });

    const response = await POST(req);
    const json = await response.json();

    expect(json.message).toBe('Email forwarded');
    expect(mailgun.forwardEmail).toHaveBeenCalled();
  });

  it('should allow email if whitelisted domain overrides blocked category', async () => {
    const mockUser = { id: 'u1', username: 'username', email: 'username@real.com' };
    const mockRules = [
      { action: 'block', pattern: 'Promotions', type: 'category' },
      { action: 'allow', pattern: 'newsletter.com', type: 'domain' },
    ];

    vi.mocked(mailgun.verifySignature).mockReturnValue(true);
    vi.mocked(db.getUserBySupamailAddress).mockResolvedValue(mockUser as any);
    vi.mocked(db.getRulesForUser).mockResolvedValue(mockRules as any);
    vi.mocked(ai.generateSmartSubject).mockResolvedValue({
      summary: 'Promo',
      enhancedSubject: '[Promo] Sale',
      category: 'Promotions',
    });

    const req = createMockRequest({
      from: 'info@newsletter.com',
      recipient: 'username@supamail-domain.com',
      subject: 'Sale',
      timestamp: '123',
      token: 'abc',
      signature: 'sig',
    });

    const response = await POST(req);
    const json = await response.json();

    expect(json.message).toBe('Email forwarded');
    expect(mailgun.forwardEmail).toHaveBeenCalled();
  });

  it('should block email if whitelisted category overridden by blocked domain', async () => {
    const mockUser = { id: 'u1', username: 'username', email: 'username@real.com' };
    const mockRules = [
      { action: 'allow', pattern: 'Promotions', type: 'category' },
      { action: 'block', pattern: 'evil.com', type: 'domain' },
    ];

    vi.mocked(mailgun.verifySignature).mockReturnValue(true);
    vi.mocked(db.getUserBySupamailAddress).mockResolvedValue(mockUser as any);
    vi.mocked(db.getRulesForUser).mockResolvedValue(mockRules as any);
    vi.mocked(ai.generateSmartSubject).mockResolvedValue({
      summary: 'Promo',
      enhancedSubject: '[Promo] Sale',
      category: 'Promotions',
    });

    const req = createMockRequest({
      from: 'bad@evil.com',
      recipient: 'username@supamail-domain.com',
      subject: 'Sale',
      timestamp: '123',
      token: 'abc',
      signature: 'sig',
    });

    const response = await POST(req);
    const json = await response.json();

    expect(json.message).toBe('Email blocked');
    expect(mailgun.forwardEmail).not.toHaveBeenCalled();
  });

  it('should return 401 for invalid signature', async () => {
    vi.mocked(mailgun.verifySignature).mockReturnValue(false);

    const req = createMockRequest({
      timestamp: '123',
      token: 'abc',
      signature: 'wrong',
    });

    const response = await POST(req);
    expect(response.status).toBe(401);
  });
});
