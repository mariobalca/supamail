import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getUserBySupamailAddress,
  getRulesForUser,
  logEmailActivity,
  getLog,
  updateLogStatus,
  getAllCategories,
  getOrCreateCategory,
} from '@/lib/db.server';

vi.mock('@/lib/supabase/admin', () => {
  const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
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
        username: 'mario',
      };

      mockSupabase.single.mockResolvedValueOnce({
        data: mockUser,
        error: null,
      } as any);

      const result = await getUserBySupamailAddress(
        'mario@supamail.mariobalca.com'
      );
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
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      } as any);
      const result = await getUserBySupamailAddress(
        'unknown@supamail.mariobalca.com'
      );
      expect(result).toBeNull();
    });
  });

  describe('getRulesForUser', () => {
    it('should return rules for user', async () => {
      const mockRules = [{ id: 'r1', action: 'block', pattern: 'spam.com' }];
      mockSupabase.eq.mockResolvedValueOnce({
        data: mockRules,
        error: null,
      } as any);

      const result = await getRulesForUser('u1');
      expect(result).toEqual(mockRules);
      expect(mockSupabase.from).toHaveBeenCalledWith('rules');
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'u1');
    });
  });

  describe('logEmailActivity', () => {
    it('should insert log', async () => {
      const payload = {
        user_id: 'u1',
        sender: 's@s.com',
        subject: 'hi',
        status: 'forwarded' as const,
      };
      mockSupabase.insert.mockResolvedValueOnce({ error: null } as any);
      await logEmailActivity(payload);
      expect(mockSupabase.from).toHaveBeenCalledWith('logs');
      expect(mockSupabase.insert).toHaveBeenCalledWith(payload);
    });
  });

  describe('getLog', () => {
    it('should return log if found', async () => {
      const mockLog = { id: 'l1', user_id: 'u1', status: 'blocked' };
      mockSupabase.single.mockResolvedValueOnce({
        data: mockLog,
        error: null,
      } as any);

      const result = await getLog('l1');
      expect(result).toEqual(mockLog);
      expect(mockSupabase.from).toHaveBeenCalledWith('logs');
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'l1');
    });

    it('should return null if not found', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Not found' },
      } as any);

      const result = await getLog('unknown');
      expect(result).toBeNull();
    });
  });

  describe('updateLogStatus', () => {
    it('should update log status', async () => {
      mockSupabase.update.mockReturnThis();
      mockSupabase.eq.mockResolvedValueOnce({ error: null } as any);

      await updateLogStatus('l1', 'forwarded');
      expect(mockSupabase.from).toHaveBeenCalledWith('logs');
      expect(mockSupabase.update).toHaveBeenCalledWith({ status: 'forwarded' });
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'l1');
    });

    it('should throw error if update fails', async () => {
      mockSupabase.update.mockReturnThis();
      mockSupabase.eq.mockResolvedValueOnce({
        error: { message: 'Update failed' },
      } as any);

      await expect(updateLogStatus('l1', 'forwarded')).rejects.toThrow(
        'Update failed'
      );
    });
  });

  describe('categories', () => {
    it('should get all categories', async () => {
      const mockCats = [{ name: 'Personal' }, { name: 'Work' }];
      mockSupabase.order.mockResolvedValueOnce({
        data: mockCats,
        error: null,
      } as any);

      const result = await getAllCategories();
      expect(result).toEqual(['Personal', 'Work']);
      expect(mockSupabase.from).toHaveBeenCalledWith('categories');
    });

    it('should get or create category (existing)', async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: { name: 'Personal' },
        error: null,
      } as any);

      const result = await getOrCreateCategory('Personal');
      expect(result).toBe('Personal');
      expect(mockSupabase.maybeSingle).toHaveBeenCalled();
    });

    it('should get or create category (new)', async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: null,
      } as any);
      mockSupabase.insert.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.single.mockResolvedValueOnce({
        data: { name: 'NewCat' },
        error: null,
      } as any);

      const result = await getOrCreateCategory('NewCat');
      expect(result).toBe('NewCat');
      expect(mockSupabase.insert).toHaveBeenCalledWith({ name: 'NewCat' });
    });
  });
});
