'use client';

import { useState, useEffect, type FormEvent } from 'react';
import {
  Shield,
  Plus,
  Trash2,
  Loader2,
  Search,
  Filter,
  Mail,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { getAllRules, createRule, deleteRule, getProfile, getCategories } from '@/lib/db';
import { Rule, User, RuleType } from '@/types/database';
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

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [profile, setProfile] = useState<User | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [pattern, setPattern] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [action, setAction] = useState<'allow' | 'block'>('block');
  const [type, setType] = useState<RuleType>('domain');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rulesData, profileData, categoriesData] = await Promise.all([
        getAllRules(),
        getProfile(),
        getCategories(),
      ]);
      setRules(rulesData);
      setProfile(profileData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = async (e: FormEvent) => {
    e.preventDefault();
    const finalPattern = type === 'category' ? (pattern === 'custom' ? customCategory : pattern) : pattern;
    if (!finalPattern) return;

    setIsCreating(true);
    try {
      await createRule(finalPattern, action, type);
      setPattern('');
      setCustomCategory('');
      fetchData();
    } catch (error) {
      console.error('Error creating rule:', error);
      alert('Failed to create rule.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;
    try {
      await deleteRule(id);
      setRules(rules.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  const filteredRules = rules.filter((r) =>
    r.pattern.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-1 text-3xl font-black tracking-tight text-slate-900">
            Rules
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Define who can reach your primary inbox.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Creation Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-100">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <CardTitle>New Rule</CardTitle>
              <CardDescription>
                Set up a new filtering pattern for your Supamail ID.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateRule} className="space-y-4">
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
                          onClick={() => setType(t)}
                          className={`flex-1 rounded-lg border px-3 py-1.5 text-[10px] font-bold transition-all ${
                            type === t
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

                <div>
                  <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    {type === 'domain'
                      ? 'Domain (e.g. amazon.com)'
                      : type === 'email'
                        ? 'Email Address'
                        : 'Category'}
                  </label>
                  {type === 'category' ? (
                    <div className="space-y-2">
                      <select
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="">Select a category...</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option value="custom">+ Create new category...</option>
                      </select>
                      {pattern === 'custom' && (
                        <Input
                          type="text"
                          placeholder="Type new category name..."
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          required
                        />
                      )}
                    </div>
                  ) : (
                    <Input
                      type="text"
                      placeholder={
                        type === 'domain'
                          ? 'e.g. news.google.com'
                          : 'e.g. info@newsletter.com'
                      }
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      disabled={isCreating}
                    />
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Action
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={action === 'allow' ? 'primary' : 'outline'}
                      onClick={() => setAction('allow')}
                      className={
                        action === 'allow'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-none hover:bg-emerald-100'
                          : 'text-slate-400'
                      }
                      size="sm"
                    >
                      <CheckCircle2 size={12} className="mr-2" />
                      Allow
                    </Button>
                    <Button
                      type="button"
                      variant={action === 'block' ? 'primary' : 'outline'}
                      onClick={() => setAction('block')}
                      className={
                        action === 'block'
                          ? 'border-rose-200 bg-rose-50 text-rose-700 shadow-none hover:bg-rose-100'
                          : 'text-slate-400'
                      }
                      size="sm"
                    >
                      <XCircle size={12} className="mr-2" />
                      Block
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isCreating || !pattern || !profile?.username}
                  className="w-full"
                  variant="secondary"
                >
                  {isCreating ? (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-3 w-3" />
                  )}
                  {!profile?.username ? 'Claim your ID first' : 'Add Rule'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* List Card */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between border-b border-slate-50 p-4">
              <div className="group flex w-56 items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 transition-all focus-within:border-indigo-300">
                <Search className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-500" />
                <Input
                  type="text"
                  placeholder="Filter rules..."
                  className="h-auto w-full border-none bg-transparent p-0 text-xs font-medium placeholder:text-slate-400 focus:ring-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                {filteredRules.length} Rules
              </span>
            </div>

            <div className="divide-y divide-slate-50">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 p-16 text-slate-400">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                  <p className="text-xs font-medium">Loading your rules...</p>
                </div>
              ) : filteredRules.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 p-16 text-center text-slate-400">
                  <div className="rounded-full bg-slate-50 p-3">
                    <Shield className="h-6 w-6 opacity-20" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      No rules found
                    </p>
                    <p className="text-xs font-medium">
                      Add your first rule to control your Supamail ID.
                    </p>
                  </div>
                </div>
              ) : (
                filteredRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="group flex flex-col justify-between gap-3 p-4 transition-colors hover:bg-slate-50/50 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${rule.action === 'allow' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}
                      >
                        {rule.action === 'allow' ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="mb-0.5 flex items-center gap-2">
                          <h4 className="text-base font-bold tracking-tight text-slate-900">
                            {rule.pattern}
                          </h4>
                          <Badge
                            variant={
                              rule.action === 'allow' ? 'success' : 'danger'
                            }
                          >
                            {rule.action}
                          </Badge>
                        </div>
                        <p className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                          <Mail size={10} className="opacity-50" />
                          Protecting:{' '}
                          <span className="font-bold text-indigo-600">
                            {profile?.username}@
                            {process.env.NEXT_PUBLIC_MAILGUN_DOMAIN ||
                              'supamail-domain.com'}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRule(rule.id)}
                        className="text-slate-300 hover:bg-rose-50 hover:text-rose-600"
                        title="Delete Rule"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="group relative overflow-hidden border-none bg-slate-900 text-white">
            <CardContent className="relative z-10 flex items-start gap-5 p-6">
              <div className="rounded-xl bg-indigo-600 p-2.5 shadow-lg shadow-indigo-900/50 transition-transform group-hover:rotate-12">
                <Filter className="h-5 w-5" />
              </div>
              <div>
                <h4 className="mb-1.5 text-lg font-black tracking-tight">
                  How rules work
                </h4>
                <div className="space-y-3 text-xs font-medium leading-relaxed text-slate-400">
                  <p>
                    Rules are applied to your Supamail ID based on a strict
                    precedence hierarchy:
                  </p>
                  <ol className="list-decimal space-y-1.5 pl-4">
                    <li>
                      <span className="font-bold text-white">Email Rules:</span>{' '}
                      Specific addresses override everything else.
                    </li>
                    <li>
                      <span className="font-bold text-white">Domain Rules:</span>{' '}
                      Matches like <code className="text-indigo-400">@gmail.com</code> override categories.
                    </li>
                    <li>
                      <span className="font-bold text-white">
                        Category Rules:
                      </span>{' '}
                      AI-driven categorization is applied last.
                    </li>
                  </ol>
                  <p className="border-t border-white/5 pt-3">
                    Whitelisted rules always override blocked rules at the same
                    or lower specificity level.
                  </p>
                </div>
              </div>
            </CardContent>
            <div className="absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-indigo-600/20 blur-[60px]" />
          </Card>
        </div>
      </div>
    </div>
  );
}
