'use client';

import { useState, useEffect } from 'react';
import { Mail, Loader2, User as UserIcon, Check, Shield, History, ArrowRight } from 'lucide-react';
import { getProfile, updateUsername } from '@/lib/db';
import { User } from '@/types/database';
import Link from 'next/link';

export default function SupamailIDPage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const profileData = await getProfile();
      setProfile(profileData);
      if (profileData?.username) {
        setUsername(profileData.username);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setIsUpdating(true);
    try {
      await updateUsername(username);
      await fetchData();
      alert('Supamail ID updated successfully!');
    } catch (error) {
      console.error('Error updating username:', error);
      alert('Failed to update ID. It might be already taken.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Supamail ID</h1>
          <p className="text-slate-500 font-medium">Manage your personal masked email identity.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 sticky top-28">
            <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-100">
              <UserIcon className="text-white w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Configure Your ID</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">This is the email address you'll give to others.</p>
            
            <form onSubmit={handleUpdateUsername} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. mario"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-12"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                    disabled={isUpdating}
                  />
                  {profile?.username && profile.username === username && (
                    <Check className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
                  )}
                </div>
                <p className="mt-2 text-[10px] text-slate-400 font-medium">
                  Your address: <span className="text-indigo-600 font-bold">{username || 'username'}@{process.env.NEXT_PUBLIC_MAILGUN_DOMAIN || 'supamail.mariobalca.com'}</span>
                </p>
              </div>
              <button
                type="submit"
                disabled={isUpdating || !username || profile?.username === username}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {profile?.username ? 'Update ID' : 'Claim Your ID'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/dashboard/rules" className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:border-indigo-100 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">Filtering Rules</h4>
              <p className="text-slate-500 text-sm font-medium mb-4">Control exactly who can reach your primary inbox.</p>
              <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold">
                Manage Rules <ArrowRight size={16} />
              </div>
            </Link>

            <Link href="/dashboard/logs" className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:border-indigo-100 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <History size={24} />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">Activity History</h4>
              <p className="text-slate-500 text-sm font-medium mb-4">See which emails were forwarded or blocked by the AI.</p>
              <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold">
                View Activity <ArrowRight size={16} />
              </div>
            </Link>
          </div>

          <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white overflow-hidden relative group shadow-2xl">
             <div className="relative z-10">
                <h4 className="text-2xl font-black mb-4 tracking-tight">How it works</h4>
                <div className="space-y-4">
                  {[
                    "Give your Supamail ID to services you don't trust.",
                    "Emails are received by us and checked against your rules.",
                    "Allowed emails are summarized by AI and forwarded to you.",
                    "Blocked emails are stored in your activity feed but never bother you."
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">{i+1}</div>
                      <p className="text-slate-400 text-sm font-medium leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
