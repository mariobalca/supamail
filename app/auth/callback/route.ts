import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';
import { getURL } from '@/lib/utils';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.exchangeCodeForSession(code);

    if (user) {
      // Use supabaseAdmin to bypass RLS and ensure the profile is created
      const { data: existingUser, error: fetchError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (fetchError || !existingUser) {
        const { error: insertError } = await supabaseAdmin
          .from('users')
          .insert({
            id: user.id,
            email: user.email!,
          });

        if (insertError) {
          console.error('Error creating user profile:', insertError);
        }
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/home', getURL()));
}
