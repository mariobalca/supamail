'use client';

import { useState, useEffect } from 'react';
import {
  History,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  Shield,
  RotateCw,
  Eye,
  X,
} from 'lucide-react';
import { getLogs, createRule } from '@/lib/db';
import { Log, RuleType } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await getLogs();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForward = async (logId: string) => {
    setProcessingId(logId);
    try {
      const res = await fetch('/api/forward-blocked', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId }),
      });
      if (res.ok) {
        await fetchLogs();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to forward email');
      }
    } catch (error) {
      console.error('Forward error:', error);
      alert('Network error. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleWhitelist = async (
    logId: string,
    pattern: string,
    type: RuleType
  ) => {
    setProcessingId(logId);
    try {
      await createRule(pattern, 'allow', type);
      // After whitelisting, we might want to forward it too if it was blocked
      const log = logs.find((l) => l.id === logId);
      if (log?.status === 'blocked') {
        // Wait for the forward to complete or show success
        const res = await fetch('/api/forward-blocked', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logId }),
        });
        if (!res.ok) {
          const error = await res.json();
          console.error('Auto-forward after whitelist failed:', error);
        }
      }
      await fetchLogs();
    } catch (error) {
      console.error('Whitelist error:', error);
      alert('Failed to whitelist. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.category?.toLowerCase().includes(searchTerm.toLowerCase())
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
                      Category
                    </th>
                    <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Sender & Subject
                    </th>
                    <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      AI Summary
                    </th>
                    <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Actions
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
                        <Badge
                          variant="outline"
                          className="border-slate-200 bg-slate-50 text-slate-600"
                        >
                          {log.category || 'Updates'}
                        </Badge>
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
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {log.status === 'blocked' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-[10px]"
                              disabled={processingId === log.id}
                              onClick={() => handleForward(log.id)}
                            >
                              {processingId === log.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <RotateCw className="mr-1 h-3 w-3" />
                              )}
                              Forward
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-[10px] hover:text-indigo-600"
                            onClick={() => setSelectedLog(log)}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-[10px] hover:text-indigo-600"
                            disabled={processingId === log.id}
                            onClick={() =>
                              handleWhitelist(
                                log.id,
                                log.sender.split('@')[1],
                                'domain'
                              )
                            }
                          >
                            <Shield className="mr-1 h-3 w-3" />
                            Trust Domain
                          </Button>
                        </div>
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

      {selectedLog && (
        <EmailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </div>
  );
}

function EmailModal({ log, onClose }: { log: Log; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <Card className="flex h-full max-h-[80vh] w-full max-w-4xl flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <div>
            <CardTitle className="text-base">{log.subject || '(No Subject)'}</CardTitle>
            <CardDescription className="text-xs">From: {log.sender}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-slate-400 hover:text-slate-900">
            <X size={18} />
          </Button>
        </div>
        <CardContent className="flex-1 overflow-auto p-0">
          {log.body_html ? (
            <iframe
              srcDoc={log.body_html}
              className="h-full w-full bg-white"
              title="Email Content"
            />
          ) : (
            <div className="whitespace-pre-wrap p-6 text-sm font-medium text-slate-600">
              {log.body_plain || 'No content available.'}
            </div>
          )}
        </CardContent>
        <div className="flex items-center justify-end border-t border-slate-100 p-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </Card>
    </div>
  );
}
