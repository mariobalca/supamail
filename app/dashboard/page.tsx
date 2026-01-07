'use client';

import {
  Mail,
  Shield,
  History,
  ArrowUpRight,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllRules, getLogs, getProfile } from '@/lib/db';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const [stats, setStats] = useState([
    {
      name: 'Active Aliases',
      value: '0',
      icon: Mail,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      trend: '+0%',
    },
    {
      name: 'Active Rules',
      value: '0',
      icon: Shield,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      trend: '+0%',
    },
    {
      name: 'Total Emails',
      value: '0',
      icon: History,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      trend: '+0%',
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [rules, logs, profileData] = await Promise.all([
          getAllRules(),
          getLogs(),
          getProfile(),
        ]);

        setStats([
          {
            name: 'Supamail ID',
            value: profileData?.username
              ? `${profileData.username}@${process.env.NEXT_PUBLIC_MAILGUN_DOMAIN || 'supamail.mariobalca.com'}`
              : 'Not set',
            icon: Mail,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            trend: profileData?.username ? 'Active' : 'Setup required',
          },
          {
            name: 'Active Rules',
            value: rules.length.toString(),
            icon: Shield,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            trend: `+${rules.length}%`,
          },
          {
            name: 'Total Emails',
            value: logs.length.toString(),
            icon: History,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            trend: `+${logs.length}%`,
          },
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
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-1 text-3xl font-black tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Welcome back! Here&apos;s a summary of your protected inbox.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" asChild className="group">
            <Link href="/dashboard/id">
              <UserIcon
                size={18}
                className="mr-2 transition-transform group-hover:scale-110"
              />
              Manage ID
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.name}
            name={stat.name}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            bg={stat.bg}
            trend={stat.trend}
            loading={loading}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="group relative overflow-hidden border-none bg-slate-900 p-2 text-white shadow-2xl shadow-indigo-200 md:p-4 lg:col-span-2">
          <CardContent className="relative z-10 max-w-xl p-6 md:p-6">
            <Badge
              variant="outline"
              className="mb-4 border-white/20 bg-white/10 text-indigo-300"
            >
              <Sparkles size={10} className="mr-1" />
              Pro Feature
            </Badge>
            <h2 className="mb-4 text-2xl font-black leading-tight tracking-tight md:text-3xl">
              AI Smart-Digest is <br />
              active on your account.
            </h2>
            <p className="mb-8 text-sm font-medium leading-relaxed text-slate-400">
              Every forwarded email now includes a concise summary in the
              subject line. No more guessing what&apos;s inside.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { step: '1', text: 'Claim your ID' },
                { step: '2', text: 'Set Rules' },
                { step: '3', text: 'Receive Mail' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-colors group-hover:bg-white/10"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-[10px] font-black shadow-lg shadow-indigo-900/20">
                    {item.step}
                  </div>
                  <span className="text-xs font-bold">{item.text}</span>
                </div>
              ))}
            </div>
          </CardContent>

          {/* Background visuals */}
          <div className="absolute right-0 top-0 -mr-40 -mt-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-[100px] transition-colors duration-1000 group-hover:bg-indigo-600/30" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-violet-600/10 blur-[80px]" />
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Need help?</CardTitle>
            <CardDescription>
              Check out our quick start guide to master Supermail.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {[
              'How to claim your ID',
              'Advanced rule patterns',
              'Mailgun configuration',
              'AI summary settings',
            ].map((text, i) => (
              <div
                key={i}
                className="group flex cursor-pointer items-center justify-between rounded-xl bg-slate-50 p-3 transition-colors hover:bg-indigo-50"
              >
                <span className="text-xs font-bold text-slate-600 transition-colors group-hover:text-indigo-600">
                  {text}
                </span>
                <ArrowUpRight
                  size={14}
                  className="text-slate-300 transition-colors group-hover:text-indigo-400"
                />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full border-none bg-slate-100 py-3 hover:bg-slate-200"
            >
              View Documentation
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
