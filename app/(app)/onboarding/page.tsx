'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Shield,
  Check,
  Loader2,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { getProfile, updateUsername, createRule, getCategories } from '@/lib/db';
import { RuleType } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [rules, setRules] = useState<
    { pattern: string; action: 'allow' | 'block'; type: RuleType }[]
  >([]);
  const [currentPattern, setCurrentPattern] = useState('');
  const [currentType, setCurrentType] = useState<RuleType>('domain');
  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    async function initOnboarding() {
      try {
        const [profile, categoriesData] = await Promise.all([
          getProfile(),
          getCategories(),
        ]);
        if (profile?.username) {
          router.push('/home');
        }
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error initializing onboarding:', error);
      } finally {
        setLoading(false);
      }
    }
    initOnboarding();
  }, [router]);

  const handleSetUsername = async (e: FormEvent) => {
    e.preventDefault();
    if (!username) return;
    setStep(2);
  };

  const addRule = () => {
    const finalPattern =
      currentType === 'category'
        ? currentPattern === 'custom'
          ? customCategory
          : currentPattern
        : currentPattern;
    if (!finalPattern) return;

    setRules([
      ...rules,
      { pattern: finalPattern, action: 'block', type: currentType },
    ]);
    setCurrentPattern('');
    setCustomCategory('');
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleCompleteOnboarding = async () => {
    setIsSubmitting(true);
    try {
      // 1. Set username
      await updateUsername(username);

      // 2. Create rules
      for (const rule of rules) {
        await createRule(rule.pattern, rule.action, rule.type);
      }

      router.push('/home');
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#fafafa]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-6 py-12 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="mb-12 flex flex-col items-center gap-4 text-center">
        <div className="rounded-2xl bg-indigo-600 p-3 shadow-xl shadow-indigo-100">
          <Mail className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Welcome to Supamail
        </h1>
        <p className="max-w-md font-medium text-slate-500">
          Let&apos;s get you set up with your new secure identity and some basic rules.
        </p>
      </div>

      <div className="w-full max-w-xl">
        <div className="mb-8 flex items-center justify-center gap-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 w-12 rounded-full transition-all duration-500 ${
                step >= i ? 'bg-indigo-600 shadow-sm shadow-indigo-100' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {step === 1 ? (
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
              <CardTitle>Claim your Supamail ID</CardTitle>
              <CardDescription>
                Choose a unique username. This will be your new secure email address.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSetUsername} className="space-y-6">
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Your Username
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="e.g. mario"
                      className="pr-24 font-bold"
                      value={username}
                      onChange={(e) =>
                        setUsername(
                          e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')
                        )
                      }
                      autoFocus
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-300">
                      @supamail...
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-medium text-slate-500">
                    Your address will be:{' '}
                    <span className="font-bold text-indigo-600">
                      {username || 'username'}@{process.env.NEXT_PUBLIC_MAILGUN_DOMAIN || 'supamail.mariobalca.com'}
                    </span>
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={!username}
                  className="w-full"
                  size="lg"
                >
                  Continue to Rules
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="animate-in fade-in slide-in-from-right-4 duration-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Set your first rules</CardTitle>
                  <CardDescription>
                    Choose what you want to block by default.
                  </CardDescription>
                </div>
                <Badge variant="primary" className="h-fit">
                  Step 2 of 2
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Rule Type
                  </label>
                  <div className="flex gap-2">
                    {(['domain', 'email', 'category'] as RuleType[]).map(
                      (t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setCurrentType(t);
                            setCurrentPattern('');
                          }}
                          className={`flex-1 rounded-lg border px-3 py-1.5 text-[10px] font-bold transition-all ${
                            currentType === t
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                              : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    {currentType === 'category' ? (
                      <>
                        <select
                          value={currentPattern}
                          onChange={(e) => setCurrentPattern(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="">Select a category...</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                          <option value="custom">
                            + Create new category...
                          </option>
                        </select>
                        {currentPattern === 'custom' && (
                          <Input
                            type="text"
                            placeholder="Type new category name..."
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addRule()}
                            autoFocus
                          />
                        )}
                      </>
                    ) : (
                      <Input
                        type="text"
                        placeholder={
                          currentType === 'domain'
                            ? 'e.g. newsletter.com'
                            : 'e.g. spam@service.com'
                        }
                        value={currentPattern}
                        onChange={(e) => setCurrentPattern(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addRule()}
                      />
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={addRule}
                    type="button"
                    className="h-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {rules.length > 0 ? (
                  rules.map((rule, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:border-indigo-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
                          <Shield size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-slate-900">
                              {rule.pattern}
                            </p>
                            <Badge variant="outline" className="h-fit">
                              {rule.type}
                            </Badge>
                          </div>
                          <p className="text-[10px] font-medium tracking-widest text-slate-400 uppercase">
                            Blocked
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRule(i)}
                        className="text-slate-300 hover:text-rose-600"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 py-8 text-slate-400">
                    <Sparkles className="h-8 w-8 opacity-20" />
                    <p className="text-xs font-medium">No rules added yet.</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button
                  onClick={handleCompleteOnboarding}
                  disabled={isSubmitting}
                  className="w-full shadow-indigo-200"
                  size="lg"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Complete Setup
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="text-slate-400"
                >
                  Back to Username
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

