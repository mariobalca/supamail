import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserBySupamailAddress, getRulesForUser, logEmailActivity } from '@/lib/db.server';

vi.mock('@/lib/supabase/admin', () => {
  const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    insert: vi.fn(),
  };
  return {
    supabaseAdmin: mockSupabase,
  };
});

import { supabaseAdmin } from '@/lib/supabase/admin';

describe('DB Service', () => {
  const mockSupabase = supabaseAdmin as any;
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.from.mockReturnThis();
    mockSupabase.select.mockReturnThis();
    mockSupabase.eq.mockReturnThis();
  });

  describe('getUserBySupamailAddress', () => {
    it('should return user if found by username', async () => {
      const mockUser = {
        id: 'u1',
        email: 'real@email.com',
        username: 'mario'
      };

      mockSupabase.single.mockResolvedValueOnce({ data: mockUser, error: null } as any);

      const result = await getUserBySupamailAddress('mario@supamail.mariobalca.com');
      expect(result).toBeDefined();
      expect(result?.username).toBe('mario');
      expect(mockSupabase.from).toHaveBeenCalledWith('users');
      expect(mockSupabase.eq).toHaveBeenCalledWith('username', 'mario');
    });

    it('should return null if domain does not match', async () => {
      const result = await getUserBySupamailAddress('mario@wrongdomain.com');
      expect(result).toBeNull();
    });

    it('should return null if user not found', async () => {
      mockSupabase.single.mockResolvedValue({ data: null, error: { message: 'Not found' } } as any);
      const result = await getUserBySupamailAddress('unknown@supamail.mariobalca.com');
      expect(result).toBeNull();
    });
  });

  describe('getRulesForUser', () => {
    it('should return rules for user', async () => {
      const mockRules = [{ id: 'r1', action: 'block', pattern: 'spam.com' }];
      mockSupabase.eq.mockResolvedValueOnce({ data: mockRules, error: null } as any);

      const result = await getRulesForUser('u1');
      expect(result).toEqual(mockRules);
      expect(mockSupabase.from).toHaveBeenCalledWith('rules');
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'u1');
    });
  });

  describe('logEmailActivity', () => {
    it('should insert log', async () => {
      const payload = { user_id: 'u1', sender: 's@s.com', subject: 'hi', status: 'forwarded' as const };
      mockSupabase.insert.mockResolvedValueOnce({ error: null } as any);
      await logEmailActivity(payload);
      expect(mockSupabase.from).toHaveBeenCalledWith('logs');
      expect(mockSupabase.insert).toHaveBeenCalledWith(payload);
    });
  });
});
