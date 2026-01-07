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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Rules</h1>
          <p className="text-sm text-slate-500 font-medium">Define who can reach your primary inbox.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Creation Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
            <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-100">
              <Shield className="text-white w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">New Rule</h3>
            <p className="text-slate-500 text-xs font-medium mb-6">Set up a new filtering pattern for your Supamail ID.</p>

            <form onSubmit={handleCreateRule} className="space-y-4">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Pattern (Email or Domain)</label>
                <input
                  type="text"
                  placeholder="e.g. spam-sender.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  disabled={isCreating}
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Action</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAction('allow')}
                    className={`py-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-2 border ${
                      action === 'allow' 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                        : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 size={12} />
                    Allow
                  </button>
                  <button
                    type="button"
                    onClick={() => setAction('block')}
                    className={`py-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-2 border ${
                      action === 'block' 
                        ? 'bg-rose-50 border-rose-200 text-rose-700' 
                        : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <XCircle size={12} />
                    Block
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreating || !pattern || !profile?.username}
                className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                {isCreating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                {!profile?.username ? 'Claim your ID first' : 'Add Rule'}
              </button>
            </form>
          </div>
        </div>

        {/* List Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg w-56 group focus-within:border-indigo-300 transition-all">
                <Search className="w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-500" />
                <input
                  type="text"
                  placeholder="Filter rules..."
                  className="bg-transparent border-none outline-none text-xs w-full font-medium placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-400">{filteredRules.length} Rules</span>
            </div>

            <div className="divide-y divide-slate-50">
              {loading ? (
                <div className="p-16 flex flex-col items-center justify-center text-slate-400 gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                  <p className="text-xs font-medium">Loading your rules...</p>
                </div>
              ) : filteredRules.length === 0 ? (
                <div className="p-16 flex flex-col items-center justify-center text-slate-400 gap-3 text-center">
                  <div className="bg-slate-50 p-3 rounded-full">
                    <Shield className="w-6 h-6 opacity-20" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">No rules found</p>
                    <p className="text-xs font-medium">Add your first rule to control your Supamail ID.</p>
                  </div>
                </div>
              ) : (
                filteredRules.map((rule) => (
                  <div key={rule.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${rule.action === 'allow' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {rule.action === 'allow' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-bold text-base tracking-tight text-slate-900">
                            {rule.pattern}
                          </h4>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                            rule.action === 'allow' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {rule.action}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[10px] font-medium flex items-center gap-1">
                          <Mail size={10} className="opacity-50" />
                          Protecting: <span className="text-indigo-600 font-bold">{profile?.username}@{process.env.NEXT_PUBLIC_MAILGUN_DOMAIN || 'supamail.mariobalca.com'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl text-white relative overflow-hidden group">
             <div className="relative z-10 flex items-start gap-5">
                <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-900/50 group-hover:rotate-12 transition-transform">
                   <Filter className="w-5 h-5" />
                </div>
                <div>
                   <h4 className="text-lg font-black mb-1.5 tracking-tight">How rules work</h4>
                   <p className="text-slate-400 text-xs font-medium leading-relaxed">
                      Rules are applied to your Supamail ID. If an incoming email matches a pattern, we take the specified action.
                      You can use partial matches like <code className="text-indigo-400 bg-white/5 px-1 py-0.5 rounded text-[10px] font-bold">@gmail.com</code> to block all Gmail senders.
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
