import { describe, it, expect } from 'vitest';
import { verifySignature } from '@/lib/mailgun';
import crypto from 'node:crypto';

describe('Mailgun Service', () => {
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
});
