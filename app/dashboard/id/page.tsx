'use client';

import { useState, useEffect } from 'react';
import {
  Loader2,
  User as UserIcon,
  Check,
  Shield,
  History,
  ArrowRight,
} from 'lucide-react';
import { getProfile, updateUsername } from '@/lib/db';
import { User } from '@/types/database';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

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
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-1 text-3xl font-black tracking-tight text-slate-900">
            Supamail ID
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Manage your personal masked email identity.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-100">
                <UserIcon className="h-5 w-5 text-white" />
              </div>
              <CardTitle>Configure Your ID</CardTitle>
              <CardDescription>
                This is the email address you&apos;ll give to others.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateUsername} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Username
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="e.g. mario"
                      className="pr-10 font-bold"
                      value={username}
                      onChange={(e) =>
                        setUsername(
                          e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')
                        )
                      }
                      disabled={isUpdating}
                    />
                    {profile?.username && profile.username === username && (
                      <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                    )}
                  </div>
                  <p className="mt-1.5 text-[9px] font-medium text-slate-400">
                    Your address:{' '}
                    <span className="font-bold text-indigo-600">
                      {username || 'username'}@
                      {process.env.NEXT_PUBLIC_MAILGUN_DOMAIN ||
                        'supamail.mariobalca.com'}
                    </span>
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={
                    isUpdating || !username || profile?.username === username
                  }
                  className="w-full"
                >
                  {isUpdating ? (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-3 w-3" />
                  )}
                  {profile?.username ? 'Update ID' : 'Claim Your ID'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-5 md:grid-cols-2">
            <Card
              className="group transition-all hover:border-indigo-100 hover:shadow-xl"
              asChild
            >
              <Link href="/dashboard/rules">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110">
                    <Shield size={20} />
                  </div>
                  <h4 className="mb-1 text-lg font-black text-slate-900">
                    Filtering Rules
                  </h4>
                  <p className="mb-3 text-xs font-medium text-slate-500">
                    Control exactly who can reach your primary inbox.
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                    Manage Rules <ArrowRight size={14} />
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card
              className="group transition-all hover:border-indigo-100 hover:shadow-xl"
              asChild
            >
              <Link href="/dashboard/logs">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-transform group-hover:scale-110">
                    <History size={20} />
                  </div>
                  <h4 className="mb-1 text-lg font-black text-slate-900">
                    Activity History
                  </h4>
                  <p className="mb-3 text-xs font-medium text-slate-500">
                    See which emails were forwarded or blocked by the AI.
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                    View Activity <ArrowRight size={14} />
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>

          <Card className="group relative overflow-hidden border-none bg-slate-900 text-white shadow-2xl">
            <CardContent className="relative z-10 p-8">
              <h4 className="mb-4 text-xl font-black tracking-tight">
                How it works
              </h4>
              <div className="space-y-3">
                {[
                  "Give your Supamail ID to services you don't trust.",
                  'Emails are received by us and checked against your rules.',
                  'Allowed emails are summarized by AI and forwarded to you.',
                  'Blocked emails are stored in your activity feed but never bother you.',
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-black">
                      {i + 1}
                    </div>
                    <p className="text-xs font-medium leading-relaxed text-slate-400">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-[100px]" />
          </Card>
        </div>
      </div>
    </div>
  );
}
