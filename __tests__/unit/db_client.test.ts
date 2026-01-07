import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getProfile,
  updateUsername,
  getAllRules,
  createRule,
  deleteRule,
  getLogs,
} from '@/lib/db';

vi.mock('@/lib/supabase/client', () => {
  const mockSupabase: any = {
    auth: {
      getUser: vi.fn(),
    },
  };

  mockSupabase.from = vi.fn().mockReturnThis();
  mockSupabase.select = vi.fn().mockReturnThis();
  mockSupabase.eq = vi.fn().mockReturnThis();
  mockSupabase.single = vi.fn().mockReturnThis();
  mockSupabase.update = vi.fn().mockReturnThis();
  mockSupabase.delete = vi.fn().mockReturnThis();
  mockSupabase.order = vi.fn().mockReturnThis();
  mockSupabase.insert = vi.fn().mockReturnThis();

  return {
    createClient: () => mockSupabase,
  };
});

import { createClient } from '@/lib/supabase/client';

describe('Client DB Service', () => {
  const mockSupabase = createClient() as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return profile if authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'u1' } },
        error: null,
      });
      mockSupabase.single.mockResolvedValue({
        data: { id: 'u1', username: 'mario' },
        error: null,
      });

      const profile = await getProfile();
      expect(profile?.username).toBe('mario');
      expect(mockSupabase.from).toHaveBeenCalledWith('users');
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'u1');
    });

    it('should return null if not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });
      const profile = await getProfile();
      expect(profile).toBeNull();
    });
  });

  describe('updateUsername', () => {
    it('should update username if authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'u1' } },
        error: null,
      });
      mockSupabase.eq.mockResolvedValue({ error: null });

      await updateUsername('newname');
      expect(mockSupabase.from).toHaveBeenCalledWith('users');
      expect(mockSupabase.update).toHaveBeenCalledWith(
        expect.objectContaining({ username: 'newname' })
      );
    });
  });

  describe('rules', () => {
    it('should get all rules', async () => {
      mockSupabase.order.mockResolvedValue({ data: [{ id: 'r1' }], error: null });
      const rules = await getAllRules();
      expect(rules).toHaveLength(1);
      expect(mockSupabase.from).toHaveBeenCalledWith('rules');
    });

    it('should create a rule', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'u1' } },
        error: null,
      });
      mockSupabase.single.mockResolvedValue({ data: { id: 'r1' }, error: null });

      const rule = await createRule('spam.com', 'block');
      expect(rule).toBeDefined();
      expect(mockSupabase.insert).toHaveBeenCalledWith({
        user_id: 'u1',
        pattern: 'spam.com',
        action: 'block',
        type: 'domain',
      });
    });

    it('should delete a rule', async () => {
      mockSupabase.delete.mockReturnThis();
      mockSupabase.eq.mockResolvedValue({ error: null });

      await deleteRule('r1');
      expect(mockSupabase.from).toHaveBeenCalledWith('rules');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'r1');
    });
  });

  describe('getLogs', () => {
    it('should return logs', async () => {
      mockSupabase.order.mockResolvedValue({ data: [{ id: 'l1' }], error: null });
      const logs = await getLogs();
      expect(logs).toHaveLength(1);
      expect(mockSupabase.from).toHaveBeenCalledWith('logs');
    });
  });
});
