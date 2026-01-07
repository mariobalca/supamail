import { describe, it, expect, vi, beforeEach } from 'vitest';
import { proxy } from '@/proxy';
import { NextRequest, NextResponse } from 'next/server';

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}));

import { createServerClient } from '@supabase/ssr';

describe('Proxy Middleware', () => {
  const mockSupabase = {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createServerClient as any).mockReturnValue(mockSupabase);
  });

  const createRequest = (path: string) => {
    return new NextRequest(new URL(`http://localhost:3000${path}`));
  };

  it('redirects unauthenticated users to login for app pages', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    const req = createRequest('/home');
    const res = await proxy(req);
    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toContain('/login');
  });

  it('redirects authenticated users without username to onboarding', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'u1' } }
    });
    mockSupabase.single.mockResolvedValue({ data: { username: null } });

    const req = createRequest('/home');
    const res = await proxy(req);
    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toContain('/onboarding');
  });

  it('redirects authenticated users with username away from onboarding', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'u1' } }
    });
    mockSupabase.single.mockResolvedValue({ data: { username: 'mario' } });

    const req = createRequest('/onboarding');
    const res = await proxy(req);
    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toContain('/home');
  });

  it('allows access to app pages if authenticated and has username', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'u1' } }
    });
    mockSupabase.single.mockResolvedValue({ data: { username: 'mario' } });

    const req = createRequest('/home');
    const res = await proxy(req);
    // NextResponse.next() status is usually 200 in mock or carries request headers
    expect(res?.status).toBe(200);
  });
});
