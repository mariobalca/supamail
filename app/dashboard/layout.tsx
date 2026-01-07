'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Shield, History, LogOut, LayoutDashboard, ChevronRight, Menu, Bell, Search, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Supamail ID', href: '/dashboard/id', icon: Mail },
    { name: 'Rules', href: '/dashboard/rules', icon: Shield },
    { name: 'Activity', href: '/dashboard/logs', icon: History },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
       flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-indigo-100">
              <Mail className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Supamail</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-slate-900">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          <p className="px-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Menu</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} />
                  <span className="text-sm">{item.name}</span>
                </div>
                {isActive && <div className="w-1 h-1 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.6)]" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-slate-500 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all text-left group font-bold text-sm"
          >
            <LogOut size={18} className="text-slate-400 group-hover:text-rose-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col relative">
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 md:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-500 hover:text-slate-900">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg w-64 group focus-within:border-indigo-300 transition-all">
              <Search className="w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-500" />
              <input type="text" placeholder="Search aliases..." className="bg-transparent border-none outline-none text-xs w-full font-medium placeholder:text-slate-400" />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white" />
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2.5 pl-1">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none mb-0.5">User Name</p>
                <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest leading-none">Pro Plan</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 border border-indigo-200 flex items-center justify-center shadow-lg shadow-indigo-100 group cursor-pointer overflow-hidden">
                <span className="text-xs font-black text-white uppercase group-hover:scale-110 transition-transform">U</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-5 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
