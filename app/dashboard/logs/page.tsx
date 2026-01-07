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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Activity</h1>
          <p className="text-slate-500 font-medium">Monitor incoming traffic to your Supamail address.</p>
        </div>
        <button 
          onClick={fetchLogs}
          className="flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
        >
          Refresh Feed
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl w-80 group focus-within:border-indigo-300 transition-all">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500" />
            <input 
              type="text" 
              placeholder="Search sender, subject, or alias..." 
              className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Forwarded</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-rose-500" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blocked</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="font-medium">Fetching activity logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4 text-center">
              <div className="bg-slate-50 p-4 rounded-full">
                <History className="w-8 h-8 opacity-20" />
              </div>
              <div>
                <p className="font-bold text-slate-900">No activity yet</p>
                <p className="text-sm font-medium">Emails sent to your Supamail address will appear here.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sender & Subject</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Alias</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Summary</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-6 vertical-top">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${log.status === 'forwarded' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {log.status === 'forwarded' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1 max-w-md">
                          <div className="flex items-center gap-2">
                             <span className="text-sm font-black text-slate-900 truncate">{log.sender}</span>
                          </div>
                          <span className="text-xs font-medium text-slate-500 line-clamp-1">{log.subject || '(No Subject)'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-indigo-600">
                          <Mail size={14} className="opacity-50" />
                          <span className="text-xs font-bold">To: {log.aliases?.address}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        {log.ai_summary ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-tight">
                            {log.ai_summary}
                          </div>
                        ) : (
                          <span className="text-slate-300 text-[10px] font-bold uppercase tracking-widest italic">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs font-black text-slate-900">
                            {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
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

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white overflow-hidden relative group">
           <div className="relative z-10 flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <History size={28} />
              </div>
              <div>
                <h4 className="text-xl font-black mb-1 tracking-tight">Real-time Activity</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">Your dashboard is connected to live updates. New emails will appear here instantly.</p>
              </div>
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
        </div>
        
        <div className="bg-indigo-600 p-10 rounded-[2.5rem] text-white overflow-hidden relative group">
           <div className="relative z-10 flex items-center gap-6 text-white">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
                <ArrowRight size={28} />
              </div>
              <div>
                <h4 className="text-xl font-black mb-1 tracking-tight">Selective Forwarding</h4>
                <p className="text-white/70 text-sm font-medium leading-relaxed">Only allowed senders reach your inbox. Everything else is logged and blocked.</p>
              </div>
           </div>
           <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 blur-[80px] rounded-full" />
        </div>
      </div>
    </div>
  );
}
