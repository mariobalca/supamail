import Link from 'next/link';
import {
  Mail,
  Shield,
  Zap,
  ArrowRight,
  Github,
  Twitter,
  Lock,
  Sparkles,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="group flex cursor-pointer items-center gap-2.5">
            <div className="rounded-xl bg-indigo-600 p-2 shadow-lg shadow-indigo-200 transition-all duration-300 group-hover:scale-105">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              Supamail
            </span>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden items-center gap-8 md:flex">
              <a
                href="#features"
                className="text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
              >
                How it works
              </a>
            </div>
            <div className="hidden h-4 w-px bg-slate-200 md:block" />
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-600"
              >
                Sign in
              </Link>
              <Button
                variant="secondary"
                size="md"
                className="rounded-full"
                asChild
              >
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1 pt-32">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 pb-24">
          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="flex flex-col items-center text-center">
              <div className="animate-fade-in mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600">
                <Sparkles className="h-3.5 w-3.5" />
                Now with AI Smart-Digest
              </div>
              <h1 className="mb-6 text-4xl font-black leading-[1.1] tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
                Own your inbox. <br />
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Defeat the noise.
                </span>
              </h1>
              <p className="mx-auto mb-10 max-w-xl text-base font-medium leading-relaxed text-slate-500 md:text-lg">
                Create secure aliases for every service. Filter unwanted senders
                with ease and get AI-powered insights before you even open an
                email.
              </p>
              <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
                <Button
                  variant="primary"
                  size="lg"
                  className="group w-full sm:w-auto"
                  asChild
                >
                  <Link href="/login">
                    Create Your First Alias
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  asChild
                >
                  <Link href="/home">Explore Dashboard</Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-20 grid w-full max-w-4xl grid-cols-2 gap-8 border-t border-slate-200 pt-10 md:grid-cols-4">
                {[
                  { label: 'Encrypted', icon: Lock },
                  { label: 'AI Powered', icon: Sparkles },
                  { label: 'Spam Free', icon: Shield },
                  { label: 'Fast Setup', icon: Zap },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <item.icon className="h-5 w-5 text-slate-400" />
                    <span className="text-xs font-bold uppercase tracking-tighter text-slate-400">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Abstract background shapes */}
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-full -translate-x-1/2 overflow-hidden">
            <div className="absolute left-[-20%] top-[-10%] h-[60%] w-[60%] animate-pulse rounded-full bg-indigo-100/50 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-20%] h-[60%] w-[60%] animate-pulse rounded-full bg-violet-100/50 blur-[120px] transition-all duration-1000" />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative bg-white py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-20 text-center">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
                Features
              </h2>
              <h3 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                Everything you need to <br />
                take back control.
              </h3>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: 'Alias Management',
                  desc: 'Generate unique, secure email addresses for every site. Keep your real identity private.',
                  icon: Shield,
                  color: 'bg-blue-50 text-blue-600',
                },
                {
                  title: 'AI Smart-Digest',
                  desc: 'Get a 3-5 word summary of every email. See the urgency at a glance in your main inbox.',
                  icon: Sparkles,
                  color: 'bg-indigo-50 text-indigo-600',
                },
                {
                  title: 'Advanced Filtering',
                  desc: 'Block domains or specific senders with one click. Granular rules for total silence.',
                  icon: Filter,
                  color: 'bg-violet-50 text-violet-600',
                },
              ].map((feat, i) => (
                <div
                  key={i}
                  className="group rounded-2xl border border-transparent bg-slate-50 p-6 transition-all duration-500 hover:border-indigo-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100/50"
                >
                  <div
                    className={`h-12 w-12 ${feat.color} mb-6 flex items-center justify-center rounded-xl transition-transform duration-500 group-hover:scale-110`}
                  >
                    <feat.icon className="h-6 w-6" />
                  </div>
                  <h4 className="mb-3 text-xl font-bold text-slate-900">
                    {feat.title}
                  </h4>
                  <p className="text-sm font-medium leading-relaxed text-slate-500">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-slate-900 p-10 text-center shadow-2xl md:p-16">
            <div className="relative z-10">
              <h2 className="mb-6 text-2xl font-black leading-tight tracking-tight text-white md:text-4xl">
                Ready to make your primary <br className="hidden md:block" />
                email private again?
              </h2>
              <Button
                variant="outline"
                size="lg"
                className="border-none bg-white text-slate-900 hover:bg-slate-100"
                asChild
              >
                <Link href="/login">
                  Join Supamail Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            {/* Background elements for CTA */}
            <div className="absolute left-0 top-0 h-full w-full opacity-20">
              <div className="absolute left-[-10%] top-[-20%] h-[100%] w-[50%] rounded-full bg-indigo-500 blur-[100px]" />
              <div className="absolute bottom-[-20%] right-[-10%] h-[100%] w-[50%] rounded-full bg-violet-500 blur-[100px]" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-slate-900 p-1.5">
              <Mail className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Supamail
            </span>
          </div>
          <p className="text-sm font-medium text-slate-400">
            © 2026 Supamail. Built with speed and precision.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-slate-400 transition-colors hover:text-slate-900"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-slate-400 transition-colors hover:text-slate-900"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
