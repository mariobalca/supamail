'use client';

import { useState, useEffect } from 'react';
import { History, Search, Mail, Loader2, CheckCircle2, XCircle, ArrowRight, User } from 'lucide-react';
import { getLogs } from '@/lib/db';
import { Log } from '@/types/database';

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

  const filteredLogs = logs.filter(log =>
    log.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.aliases?.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Activity</h1>
          <p className="text-sm text-slate-500 font-medium">Monitor incoming traffic to your Supamail address.</p>
        </div>
        <button 
          onClick={fetchLogs}
          className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-xl font-bold text-sm border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
        >
          Refresh Feed
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg w-64 group focus-within:border-indigo-300 transition-all">
            <Search className="w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-500" />
            <input 
              type="text" 
              placeholder="Search sender, subject, or alias..." 
              className="bg-transparent border-none outline-none text-xs w-full font-medium placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Forwarded</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Blocked</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              <p className="text-xs font-medium">Fetching activity logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-slate-400 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-full">
                <History className="w-6 h-6 opacity-20" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">No activity yet</p>
                <p className="text-xs font-medium">Emails sent to your Supamail address will appear here.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Sender & Subject</th>
                    <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Supamail ID</th>
                    <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">AI Summary</th>
                    <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 vertical-top">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${log.status === 'forwarded' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {log.status === 'forwarded' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-0.5 max-w-xs">
                          <div className="flex items-center gap-2">
                             <span className="text-xs font-black text-slate-900 truncate">{log.sender}</span>
                          </div>
                          <span className="text-[10px] font-medium text-slate-500 line-clamp-1">{log.subject || '(No Subject)'}</span>
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
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-black uppercase tracking-tight">
                            {log.ai_summary}
                          </div>
                        ) : (
                          <span className="text-slate-300 text-[9px] font-bold uppercase tracking-widest italic">N/A</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="text-[10px] font-black text-slate-900">
                            {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
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
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-8 rounded-3xl text-white overflow-hidden relative group">
           <div className="relative z-10 flex items-center gap-5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <History size={20} />
              </div>
              <div>
                <h4 className="text-lg font-black mb-1 tracking-tight">Real-time Activity</h4>
                <p className="text-slate-400 text-xs font-medium leading-relaxed">Dashboard is live. New emails appear instantly.</p>
              </div>
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
        </div>
        
        <div className="bg-indigo-600 p-8 rounded-3xl text-white overflow-hidden relative group">
           <div className="relative z-10 flex items-center gap-5 text-white">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
                <ArrowRight size={20} />
              </div>
              <div>
                <h4 className="text-lg font-black mb-1 tracking-tight">Selective Forwarding</h4>
                <p className="text-white/70 text-xs font-medium leading-relaxed">Only allowed senders reach your inbox. Everything else is blocked.</p>
              </div>
           </div>
           <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 blur-[80px] rounded-full" />
        </div>
      </div>
    </div>
  );
}
