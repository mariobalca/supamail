'use client';

import { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Loader2, Search, Filter, Mail, CheckCircle2, XCircle } from 'lucide-react';
import { getAllRules, createRule, deleteRule, getProfile } from '@/lib/db';
import { Rule, User } from '@/types/database';

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [pattern, setPattern] = useState('');
  const [action, setAction] = useState<'allow' | 'block'>('block');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rulesData, profileData] = await Promise.all([
        getAllRules(),
        getProfile()
      ]);
      setRules(rulesData);
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pattern) return;

    setIsCreating(true);
    try {
      await createRule(pattern, action);
      setPattern('');
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
      setRules(rules.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  const filteredRules = rules.filter(r =>
    r.pattern.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Rules</h1>
          <p className="text-slate-500 font-medium">Define who can reach your primary inbox.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Creation Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 sticky top-28">
            <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-100">
              <Shield className="text-white w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">New Rule</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">Set up a new filtering pattern for your Supamail ID.</p>

            <form onSubmit={handleCreateRule} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Pattern (Email or Domain)</label>
                <input
                  type="text"
                  placeholder="e.g. spam-sender.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  disabled={isCreating}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Action</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAction('allow')}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                      action === 'allow' 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                        : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 size={14} />
                    Allow
                  </button>
                  <button
                    type="button"
                    onClick={() => setAction('block')}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                      action === 'block' 
                        ? 'bg-rose-50 border-rose-200 text-rose-700' 
                        : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <XCircle size={14} />
                    Block
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreating || !pattern || !profile?.username}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {!profile?.username ? 'Claim your ID first' : 'Add Rule'}
              </button>
            </form>
          </div>
        </div>

        {/* List Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl w-64 group focus-within:border-indigo-300 transition-all">
                <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500" />
                <input
                  type="text"
                  placeholder="Filter rules..."
                  className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <span className="text-xs font-bold text-slate-400">{filteredRules.length} Rules</span>
            </div>

            <div className="divide-y divide-slate-50">
              {loading ? (
                <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                  <p className="font-medium">Loading your rules...</p>
                </div>
              ) : filteredRules.length === 0 ? (
                <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4 text-center">
                  <div className="bg-slate-50 p-4 rounded-full">
                    <Shield className="w-8 h-8 opacity-20" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">No rules found</p>
                    <p className="text-sm font-medium">Add your first rule to control your Supamail ID.</p>
                  </div>
                </div>
              ) : (
                filteredRules.map((rule) => (
                  <div key={rule.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${rule.action === 'allow' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {rule.action === 'allow' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-lg tracking-tight text-slate-900">
                            {rule.pattern}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${
                            rule.action === 'allow' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {rule.action}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
                          <Mail size={12} className="opacity-50" />
                          Protecting: <span className="text-indigo-600 font-bold">{profile?.username}@{process.env.NEXT_PUBLIC_MAILGUN_DOMAIN || 'supamail.mariobalca.com'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
             <div className="relative z-10 flex items-start gap-6">
                <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-900/50 group-hover:rotate-12 transition-transform">
                   <Filter className="w-6 h-6" />
                </div>
                <div>
                   <h4 className="text-xl font-black mb-2 tracking-tight">How rules work</h4>
                   <p className="text-slate-400 text-sm font-medium leading-relaxed">
                      Rules are applied to your Supamail ID. If an incoming email matches a pattern, we take the specified action.
                      You can use partial matches like <code className="text-indigo-400 bg-white/5 px-1.5 py-0.5 rounded text-xs font-bold">@gmail.com</code> to block all Gmail senders.
                   </p>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[60px] rounded-full -mr-16 -mt-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
