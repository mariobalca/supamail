'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        router.push('/dashboard');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        router.push('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  if (session) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#fafafa] selection:bg-indigo-100 selection:text-indigo-900">
      {/* Left side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-24 bg-white shadow-2xl z-10">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-12 font-medium text-sm group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>

          <div className="mb-10">
            <div className="bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-100">
              <Mail className="text-white w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome back.</h1>
            <p className="text-slate-500 font-medium">Log in to manage your secure aliases and filters.</p>
          </div>

          <div className="bg-white">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#4f46e5',
                      brandAccent: '#4338ca',
                      inputBackground: 'white',
                      inputBorder: '#e2e8f0',
                      inputLabelText: '#64748b',
                    },
                    borderWidths: {
                      buttonBorderWidth: '1px',
                      inputBorderWidth: '1px',
                    },
                    radii: {
                      borderRadiusButton: '0.75rem',
                      buttonBorderRadius: '0.75rem',
                      inputBorderRadius: '0.75rem',
                    },
                  },
                },
                className: {
                  button: 'shadow-sm font-bold',
                  input: 'shadow-sm',
                }
              }}
              providers={['github', 'google']}
              redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
            />
          </div>
        </div>
      </div>

      {/* Right side - Visual/Marketing (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="relative z-10 p-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest mb-8">
            Verified Security
          </div>
          <h2 className="text-5xl font-black text-white mb-6 tracking-tight leading-tight">
            The smartest way to <br />protect your email.
          </h2>
          <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md mx-auto">
            Join thousands of users who have taken back control of their primary inbox using AI-powered filters.
          </p>
        </div>

        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-full h-full opacity-30">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-violet-500 blur-[120px] rounded-full" />
        </div>
      </div>
    </div>
  );
}
