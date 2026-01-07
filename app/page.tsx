import Link from 'next/link';
import { Mail, Shield, Zap, CheckCircle2, ArrowRight, Github, Twitter, Lock, Sparkles, Filter } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-all duration-300">
              <Mail className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              Supamail
            </span>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">How it works</a>
            </div>
            <div className="h-4 w-px bg-slate-200 hidden md:block" />
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                Sign in
              </Link>
              <Link
                href="/login"
                className="text-sm font-semibold bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1 pt-32">
        {/* Hero Section */}
        <section className="relative px-6 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
                <Sparkles className="w-3.5 h-3.5" />
                Now with AI Smart-Digest
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 text-slate-900 leading-[1.1]">
                Own your inbox. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  Defeat the noise.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
                Create secure aliases for every service. Filter unwanted senders with ease and get AI-powered insights before you even open an email.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-8 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 group active:scale-[0.98]"
                >
                  Create Your First Alias
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-8 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
                >
                  Explore Dashboard
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-20 pt-10 border-t border-slate-200 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { label: "Encrypted", icon: Lock },
                  { label: "AI Powered", icon: Sparkles },
                  { label: "Spam Free", icon: Shield },
                  { label: "Fast Setup", icon: Zap }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <item.icon className="w-5 h-5 text-slate-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Abstract background shapes */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] bg-indigo-100/50 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-violet-100/50 blur-[120px] rounded-full animate-pulse transition-all duration-1000" />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-white relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-[0.2em] mb-4">Features</h2>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Everything you need to <br />take back control.</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Alias Management",
                  desc: "Generate unique, secure email addresses for every site. Keep your real identity private.",
                  icon: Shield,
                  color: "bg-blue-50 text-blue-600"
                },
                {
                  title: "AI Smart-Digest",
                  desc: "Get a 3-5 word summary of every email. See the urgency at a glance in your main inbox.",
                  icon: Sparkles,
                  color: "bg-indigo-50 text-indigo-600"
                },
                {
                  title: "Advanced Filtering",
                  desc: "Block domains or specific senders with one click. Granular rules for total silence.",
                  icon: Filter,
                  color: "bg-violet-50 text-violet-600"
                }
              ].map((feat, i) => (
                <div key={i} className="group p-8 rounded-3xl bg-slate-50 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500">
                  <div className={`w-14 h-14 ${feat.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                    <feat.icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4 text-slate-900">{feat.title}</h4>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto rounded-[3rem] bg-slate-900 p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight leading-tight">
                Ready to make your primary <br className="hidden md:block" />email private again?
              </h2>
              <Link
                href="/login"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold text-xl hover:bg-slate-100 transition-all active:scale-95"
              >
                Join Supamail Now
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
            {/* Background elements for CTA */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[100%] bg-indigo-500 blur-[100px] rounded-full" />
              <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[100%] bg-violet-500 blur-[100px] rounded-full" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2.5">
            <div className="bg-slate-900 p-1.5 rounded-lg">
              <Mail className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">Supamail</span>
          </div>
          <p className="text-slate-400 font-medium text-sm">
            © 2026 Supamail. Built with speed and precision.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors"><Github className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
