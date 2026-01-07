'use client';

import { Mail, Shield, History, ArrowUpRight, Plus, Sparkles, TrendingUp, Clock, Loader2, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllRules, getLogs, getProfile } from '@/lib/db';

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
        const [rules, logs, profileData] = await Promise.all([
          getAllRules(),
          getLogs(),
          getProfile()
        ]);

        setStats([
          {
            name: 'Supamail ID',
            value: profileData?.username ? `${profileData.username}@${process.env.NEXT_PUBLIC_MAILGUN_DOMAIN || 'supamail.mariobalca.com'}` : 'Not set',
            icon: Mail,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            trend: profileData?.username ? 'Active' : 'Setup required'
          },
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium">Welcome back! Here's a summary of your protected inbox.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/id"
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 group"
          >
            <UserIcon size={18} className="group-hover:scale-110 transition-transform" />
            Manage ID
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <div key={stat.name} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 group hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-500 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon size={22} className={stat.color} />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 mb-1">
                  <TrendingUp size={9} />
                  {stat.trend}
                </span>
                <ArrowUpRight size={18} className="text-slate-200 group-hover:text-indigo-400 transition-colors" />
              </div>
            </div>
            <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.15em] mb-1">{stat.name}</h3>
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-slate-200" />
            ) : (
              <p className="text-3xl font-black text-slate-900 tracking-tighter truncate">{stat.value}</p>
            )}

            {/* Decorative background icon */}
            <stat.icon size={60} className={`absolute -right-3 -bottom-3 opacity-[0.03] text-slate-900 group-hover:rotate-12 transition-transform duration-700`} />
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200 group">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-300 text-[9px] font-bold uppercase tracking-widest mb-4">
              <Sparkles size={10} />
              Pro Feature
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-4 tracking-tight leading-tight">
              AI Smart-Digest is <br />active on your account.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
              Every forwarded email now includes a concise summary in the subject line. No more guessing what's inside.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { step: "1", text: "Claim your ID" },
                { step: "2", text: "Set Rules" },
                { step: "3", text: "Receive Mail" }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-xl flex flex-col gap-2 group-hover:bg-white/10 transition-colors">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] font-black shadow-lg shadow-indigo-900/20">{item.step}</div>
                  <span className="text-xs font-bold">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Background visuals */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full -mr-40 -mt-40 group-hover:bg-indigo-600/30 transition-colors duration-1000" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/10 blur-[80px] rounded-full -ml-20 -mb-20" />
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-1 tracking-tight">Need help?</h3>
            <p className="text-xs text-slate-500 font-medium mb-6">Check out our quick start guide to master Supermail.</p>

            <div className="space-y-3">
              {[
                "How to claim your ID",
                "Advanced rule patterns",
                "Mailgun configuration",
                "AI summary settings"
              ].map((text, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 group cursor-pointer transition-colors">
                  <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">{text}</span>
                  <ArrowUpRight size={14} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <button className="w-full mt-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all active:scale-95">
            View Documentation
          </button>
        </div>
      </div>
    </div>
  );
}
