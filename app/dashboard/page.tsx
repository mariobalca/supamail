'use client';

import { Mail, Shield, History, ArrowUpRight, Plus, Sparkles, TrendingUp, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAliases, getAllRules, getLogs } from '@/lib/db';

export default function DashboardPage() {
  const [stats, setStats] = useState([
    { name: 'Active Aliases', value: '0', icon: Mail, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+0%' },
    { name: 'Active Rules', value: '0', icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+0%' },
    { name: 'Total Emails', value: '0', icon: History, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+0%' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [aliases, rules, logs] = await Promise.all([
          getAliases(),
          getAllRules(),
          getLogs()
        ]);

        setStats([
          { name: 'Active Aliases', value: aliases.filter(a => a.is_active).length.toString(), icon: Mail, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: `+${aliases.length}%` },
          { name: 'Active Rules', value: rules.length.toString(), icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: `+${rules.length}%` },
          { name: 'Total Emails', value: logs.length.toString(), icon: History, color: 'text-amber-600', bg: 'bg-amber-50', trend: `+${logs.length}%` },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Dashboard</h1>
          <p className="text-slate-500 font-medium">Welcome back! Here's a summary of your protected inbox.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/logs"
            className="flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <Clock size={18} className="text-slate-400" />
            View History
          </Link>
          <Link
            href="/dashboard/aliases"
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            Create Alias
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="p-8 bg-white rounded-[2rem] shadow-sm border border-slate-100 group hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-500 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon size={28} className={stat.color} />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1 mb-1">
                  <TrendingUp size={10} />
                  {stat.trend}
                </span>
                <ArrowUpRight size={20} className="text-slate-200 group-hover:text-indigo-400 transition-colors" />
              </div>
            </div>
            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-[0.15em] mb-1">{stat.name}</h3>
            {loading ? (
              <Loader2 className="w-8 h-8 animate-spin text-slate-200" />
            ) : (
              <p className="text-5xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
            )}

            {/* Decorative background icon */}
            <stat.icon size={80} className={`absolute -right-4 -bottom-4 opacity-[0.03] text-slate-900 group-hover:rotate-12 transition-transform duration-700`} />
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-indigo-200 group">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Sparkles size={12} />
              Pro Feature
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight leading-tight">
              AI Smart-Digest is <br />active on your account.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium">
              Every forwarded email now includes a concise summary in the subject line. No more guessing what's inside.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { step: "1", text: "Create Alias" },
                { step: "2", text: "Set Rules" },
                { step: "3", text: "Get Insights" }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl flex flex-col gap-3 group-hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-xs font-black shadow-lg shadow-indigo-900/20">{item.step}</div>
                  <span className="text-sm font-bold">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Background visuals */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full -mr-40 -mt-40 group-hover:bg-indigo-600/30 transition-colors duration-1000" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/10 blur-[80px] rounded-full -ml-20 -mb-20" />
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Need help?</h3>
            <p className="text-slate-500 font-medium mb-8">Check out our quick start guide to master Supermail.</p>

            <div className="space-y-4">
              {[
                "How to create aliases",
                "Advanced rule patterns",
                "Mailgun configuration",
                "AI summary settings"
              ].map((text, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 group cursor-pointer transition-colors">
                  <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">{text}</span>
                  <ArrowUpRight size={16} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <button className="w-full mt-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95">
            View Documentation
          </button>
        </div>
      </div>
    </div>
  );
}
