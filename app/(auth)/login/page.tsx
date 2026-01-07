'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        router.push('/home');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        router.push('/home');
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
      <div className="z-10 flex flex-1 flex-col justify-center bg-white px-6 py-12 shadow-2xl lg:px-24">
        <div className="mx-auto w-full max-w-sm">
          <Button variant="ghost" size="sm" className="group mb-12" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to home
            </Link>
          </Button>

          <div className="mb-10">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-xl shadow-indigo-100">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h1 className="mb-2 text-3xl font-black tracking-tight text-slate-900">
              Welcome back.
            </h1>
            <p className="font-medium text-slate-500">
              Log in to manage your secure aliases and filters.
            </p>
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
                },
              }}
              providers={['github', 'google']}
              redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
            />
          </div>
        </div>
      </div>

      {/* Right side - Visual/Marketing (Hidden on mobile) */}
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-slate-900 lg:flex">
        <div className="relative z-10 p-24 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
            Verified Security
          </div>
          <h2 className="mb-6 text-5xl font-black leading-tight tracking-tight text-white">
            The smartest way to <br />
            protect your email.
          </h2>
          <p className="mx-auto max-w-md text-lg font-medium leading-relaxed text-slate-400">
            Join thousands of users who have taken back control of their primary
            inbox using AI-powered filters.
          </p>
        </div>

        {/* Abstract shapes */}
        <div className="absolute right-0 top-0 h-full w-full opacity-30">
          <div className="absolute right-[-10%] top-[-10%] h-[60%] w-[60%] rounded-full bg-indigo-500 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] h-[60%] w-[60%] rounded-full bg-violet-500 blur-[120px]" />
        </div>
      </div>
    </div>
  );
}
