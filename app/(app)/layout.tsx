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
  Settings,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
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
    { name: 'Overview', href: '/home', icon: LayoutDashboard },
    { name: 'Rules', href: '/rules', icon: Shield },
    { name: 'Activity', href: '/logs', icon: History },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}
      >
        <div className="flex items-center justify-between p-6">
          <Link href="/home" className="group flex items-center gap-2">
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
