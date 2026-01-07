import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAliasWithUser, getRulesForAlias, logEmailActivity } from '@/lib/db.server';

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
    // Re-setup the default mock implementations that might have been changed by mockResolvedValueOnce
    mockSupabase.from.mockReturnThis();
    mockSupabase.select.mockReturnThis();
    mockSupabase.eq.mockReturnThis();
  });

  describe('getAliasWithUser', () => {
    it('should return alias if found', async () => {
      const mockAlias = { id: '1', address: 'test@tool.com', users: { email: 'real@email.com' } };
      mockSupabase.single.mockResolvedValueOnce({ data: mockAlias, error: null } as any);

      const result = await getAliasWithUser('test@tool.com');
      expect(result).toEqual(mockAlias);
      expect(mockSupabase.from).toHaveBeenCalledWith('aliases');
    });

    it('should return null if not found', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: null, error: new Error('Not found') } as any);
      const result = await getAliasWithUser('unknown@tool.com');
      expect(result).toBeNull();
    });
  });

  describe('getRulesForAlias', () => {
    it('should return rules for alias', async () => {
      const mockRules = [{ id: 'r1', action: 'block', pattern: 'spam.com' }];
      mockSupabase.eq.mockResolvedValueOnce({ data: mockRules, error: null } as any);

      const result = await getRulesForAlias('1');
      expect(result).toEqual(mockRules);
    });
  });

  describe('logEmailActivity', () => {
    it('should insert log', async () => {
      const payload = { alias_id: '1', sender: 's@s.com', subject: 'hi', status: 'forwarded' as const };
      mockSupabase.insert.mockResolvedValueOnce({ error: null } as any);
      await logEmailActivity(payload);
      expect(mockSupabase.from).toHaveBeenCalledWith('logs');
      expect(mockSupabase.insert).toHaveBeenCalledWith(payload);
    });
  });
});
