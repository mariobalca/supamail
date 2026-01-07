import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifySignature, forwardEmail } from '@/lib/mailgun';
import crypto from 'node:crypto';
import Mailgun from 'mailgun.js';

vi.mock('mailgun.js', () => {
  const mockClient = {
    messages: {
      create: vi.fn().mockResolvedValue({ id: 'msg1', message: 'Queued' }),
    },
  };
  class MockMailgun {
    client() {
      return mockClient;
    }
  }
  return {
    default: MockMailgun,
  };
});

describe('Mailgun Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('verifySignature', () => {
    it('should return true for valid signature', () => {
      const timestamp = '1736246400';
      const token = 'test-token';
      const secret = 'test-key';
      process.env.MAILGUN_SIGNING_KEY = secret;

      const signature = crypto
        .createHmac('sha256', secret)
        .update(timestamp + token)
        .digest('hex');

      expect(verifySignature(timestamp, token, signature)).toBe(true);
    });

    it('should return false for invalid signature', () => {
      expect(verifySignature('123', 'abc', 'wrong')).toBe(false);
    });
  });

  describe('forwardEmail', () => {
    it('should call mailgun messages create', async () => {
      process.env.MAILGUN_DOMAIN = 'test.com';
      const result = await forwardEmail(
        'to@email.com',
        'from@email.com',
        'Subject',
        '<p>html</p>',
        'text'
      );

      expect(result.id).toBe('msg1');
      const mg = new Mailgun(null as any);
      const client = mg.client({} as any);
      expect(client.messages.create).toHaveBeenCalledWith('test.com', {
        to: ['to@email.com'],
        from: 'from@email.com',
        subject: 'Subject',
        html: '<p>html</p>',
        text: 'text',
      });
    });
  });
});
