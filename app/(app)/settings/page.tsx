'use client';

import { useState, useEffect, type FormEvent } from 'react';
import {
  Loader2,
  User as UserIcon,
  Check,
  Lock,
  CreditCard,
  Mail,
} from 'lucide-react';
import { getProfile, updateUsername } from '@/lib/db';
import { createClient } from '@/lib/supabase/client';
import { User } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export default function SettingsPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Username state
  const [username, setUsername] = useState('');
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

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

  const handleUpdateUsername = async (e: FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setIsUpdatingUsername(true);
    try {
      await updateUsername(username);
      await fetchData();
      alert('Supamail ID updated successfully!');
    } catch (error) {
      console.error('Error updating username:', error);
      alert('Failed to update ID. It might be already taken.');
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      alert('Passwords do not match or are empty.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      alert('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="font-medium">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      <div>
        <h1 className="mb-1 text-3xl font-black tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Manage your account, security, and billing.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile / Supamail ID */}
        <Card>
          <CardHeader>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-100">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <CardTitle>Supamail ID</CardTitle>
            <CardDescription>
              This is your unique masked email address.
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
                    disabled={isUpdatingUsername}
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
                  isUpdatingUsername || !username || profile?.username === username
                }
                className="w-full"
              >
                {isUpdatingUsername ? (
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                ) : (
                  <Check className="mr-2 h-3 w-3" />
                )}
                Update Supamail ID
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Update */}
        <Card>
          <CardHeader>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 shadow-lg shadow-slate-100">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <CardTitle>Security</CardTitle>
            <CardDescription>Update your account password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isUpdatingPassword}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isUpdatingPassword}
                />
              </div>
              <Button
                type="submit"
                variant="secondary"
                disabled={isUpdatingPassword || !newPassword}
                className="w-full"
              >
                {isUpdatingPassword ? (
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                ) : (
                  <Check className="mr-2 h-3 w-3" />
                )}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Billing Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 shadow-lg shadow-amber-100">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <CardTitle>Billing & Plan</CardTitle>
            <CardDescription>Manage your subscription and payments.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <div className="mb-4 rounded-full bg-slate-50 p-3 text-slate-400">
                <CreditCard size={24} />
              </div>
              <h4 className="mb-1 text-lg font-black text-slate-900">Free Plan</h4>
              <p className="mb-6 max-w-xs text-xs font-medium text-slate-500">
                You are currently on the free plan. Upgrade to Pro to get unlimited rules and priority support.
              </p>
              <Button disabled variant="outline">
                Manage Billing (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
