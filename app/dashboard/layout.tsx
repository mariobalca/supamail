'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Mail,
  Shield,
  History,
  LogOut,
  LayoutDashboard,
  Menu,
  Bell,
  Search,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}
      >
        <div className="flex items-center justify-between p-6">
          <Link href="/dashboard" className="group flex items-center gap-2">
            <div className="rounded-lg bg-indigo-600 p-1.5 shadow-lg shadow-indigo-100 transition-all duration-300 group-hover:rotate-12">
              <Mail className="h-4 w-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-lg font-black tracking-tight text-transparent">
              Supamail
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 hover:text-slate-900 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
          <p className="mb-3 px-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Menu
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center justify-between rounded-xl px-4 py-2.5 transition-all ${
                  isActive
                    ? 'bg-indigo-50 font-bold text-indigo-700 shadow-sm'
                    : 'font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon
                    size={18}
                    className={
                      isActive
                        ? 'text-indigo-600'
                        : 'text-slate-400 group-hover:text-slate-600'
                    }
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
                {isActive && (
                  <div className="h-1 w-1 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="group w-full justify-start font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut
              size={18}
              className="mr-2.5 text-slate-400 group-hover:text-rose-500"
            />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative flex flex-1 flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/80 px-6 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-500 hover:text-slate-900 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="group hidden w-64 items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 transition-all focus-within:border-indigo-300 md:flex">
              <Search className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-500" />
              <Input
                type="text"
                placeholder="Search aliases..."
                className="h-auto w-full border-none bg-transparent p-0 text-xs font-medium placeholder:text-slate-400 focus:ring-0"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <button className="relative rounded-lg p-2 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full border border-white bg-rose-500" />
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2.5 pl-1">
              <div className="hidden text-right sm:block">
                <p className="mb-0.5 text-xs font-bold leading-none text-slate-900">
                  User Name
                </p>
                <p className="text-[9px] font-bold uppercase leading-none tracking-widest text-indigo-600">
                  Pro Plan
                </p>
              </div>
              <div className="group flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-indigo-200 bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-100">
                <span className="text-xs font-black uppercase text-white transition-transform group-hover:scale-110">
                  U
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-7xl p-5 md:p-8">{children}</div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
