'use client';

import { useState, useEffect } from 'react';
import {
  History,
  Search,
  Mail,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { getLogs } from '@/lib/db';
import { Log } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type LogWithAlias = Log & { aliases: { address: string } };

export default function LogsPage() {
  const [logs, setLogs] = useState<LogWithAlias[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await getLogs();
      setLogs(data as LogWithAlias[]);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.aliases?.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-1 text-3xl font-black tracking-tight text-slate-900">
            Activity
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Monitor incoming traffic to your Supamail address.
          </p>
        </div>
        <Button variant="outline" onClick={fetchLogs} size="md">
          Refresh Feed
        </Button>
      </div>

      <Card>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-50 bg-white p-4">
          <div className="group flex w-64 items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 transition-all focus-within:border-indigo-300">
            <Search className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-500" />
            <Input
              type="text"
              placeholder="Search sender, subject, or alias..."
              className="h-auto w-full border-none bg-transparent p-0 text-xs font-medium placeholder:text-slate-400 focus:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Forwarded
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Blocked
              </span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 p-16 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              <p className="text-xs font-medium">Fetching activity logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 p-16 text-center text-slate-400">
              <div className="rounded-full bg-slate-50 p-3">
                <History className="h-6 w-6 opacity-20" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  No activity yet
                </p>
                <p className="text-xs font-medium">
                  Emails sent to your Supamail address will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Status
                    </th>
                    <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Sender & Subject
                    </th>
                    <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Supamail ID
                    </th>
                    <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      AI Summary
                    </th>
                    <th className="px-5 py-3 text-right text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="group transition-colors hover:bg-slate-50/50"
                    >
                      <td className="vertical-top px-5 py-4">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-sm ${log.status === 'forwarded' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}
                        >
                          {log.status === 'forwarded' ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <XCircle size={16} />
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex max-w-xs flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-xs font-black text-slate-900">
                              {log.sender}
                            </span>
                          </div>
                          <span className="line-clamp-1 text-[10px] font-medium text-slate-500">
                            {log.subject || '(No Subject)'}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-indigo-600">
                          <Mail size={12} className="opacity-50" />
                          <span className="text-[10px] font-bold">To: ID</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {log.ai_summary ? (
                          <Badge
                            variant="primary"
                            className="border-indigo-100 bg-indigo-50 text-indigo-700"
                          >
                            {log.ai_summary}
                          </Badge>
                        ) : (
                          <span className="text-[9px] font-bold uppercase italic tracking-widest text-slate-300">
                            N/A
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="text-[10px] font-black text-slate-900">
                            {new Date(log.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">
                            {new Date(log.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="group relative border-none bg-slate-900 text-white">
          <CardContent className="relative z-10 flex items-center gap-5 p-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-indigo-400 transition-transform group-hover:scale-110">
              <History size={20} />
            </div>
            <div>
              <h4 className="mb-1 text-lg font-black tracking-tight">
                Real-time Activity
              </h4>
              <p className="text-xs font-medium leading-relaxed text-slate-400">
                Dashboard is live. New emails appear instantly.
              </p>
            </div>
          </CardContent>
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-[100px]" />
        </Card>

        <Card className="group relative border-none bg-indigo-600 text-white">
          <CardContent className="relative z-10 flex items-center gap-5 p-8 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white transition-transform group-hover:rotate-12">
              <ArrowRight size={20} />
            </div>
            <div>
              <h4 className="mb-1 text-lg font-black tracking-tight">
                Selective Forwarding
              </h4>
              <p className="text-xs font-medium leading-relaxed text-white/70">
                Only allowed senders reach your inbox. Everything else is
                blocked.
              </p>
            </div>
          </CardContent>
          <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-[80px]" />
        </Card>
      </div>
    </div>
  );
}
