'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  ClipboardList,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Phone,
  Settings,
  Truck,
  Users,
  X,
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import type { AdminRole } from '@/lib/admin-auth-config';
import { getDashboardPath } from '@/lib/admin-auth-config';
import { AdminLanguageSwitcher } from '@/components/admin/AdminLanguageSwitcher';
import { DEFAULT_ADMIN_LOCALE } from '@/lib/admin-locale';

interface AdminSession {
  displayName: string;
  role: AdminRole;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Admin.shell');
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch('/api/admin/me');
        if (!res.ok) {
          router.replace(`/${DEFAULT_ADMIN_LOCALE}?admin=login`);
          return;
        }
        const data = await res.json();
        setSession({ displayName: data.displayName, role: data.role });

        if (pathname === '/admin' || pathname === '/admin/') {
          router.replace(getDashboardPath(data.role));
        }
      } catch {
        router.replace(`/${DEFAULT_ADMIN_LOCALE}?admin=login`);
      } finally {
        setChecking(false);
      }
    };

    if (pathname !== '/admin/login') {
      verify();
    } else {
      setChecking(false);
    }
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-brand-primary" />
          <p className="text-foreground/50 text-sm font-medium">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const allMenuItems = [
    {
      nameKey: 'nav.orders',
      href: '/admin/orders',
      icon: ClipboardList,
      roles: ['order_manager', 'super_admin'] as AdminRole[],
    },
    {
      nameKey: 'nav.contacts',
      href: '/admin/contacts',
      icon: Phone,
      roles: ['order_manager', 'super_admin'] as AdminRole[],
    },
    {
      nameKey: 'nav.settings',
      href: '/admin/settings',
      icon: Settings,
      roles: ['super_admin'] as AdminRole[],
    },
    {
      nameKey: 'nav.fleet',
      href: '/admin/fleet',
      icon: Truck,
      roles: ['super_admin'] as AdminRole[],
    },
    {
      nameKey: 'nav.sponsors',
      href: '/admin/sponsors',
      icon: Users,
      roles: ['super_admin'] as AdminRole[],
    },
    {
      nameKey: 'nav.media',
      href: '/admin/media',
      icon: ImageIcon,
      roles: ['super_admin'] as AdminRole[],
    },
    {
      nameKey: 'nav.overview',
      href: '/admin',
      icon: LayoutDashboard,
      roles: ['super_admin'] as AdminRole[],
    },
  ];

  const menuItems = allMenuItems.filter((item) =>
    item.roles.includes(session.role)
  );

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push(`/${DEFAULT_ADMIN_LOCALE}`);
  };

  const roleLabel =
    session.role === 'order_manager'
      ? t('roles.order_manager')
      : t('roles.super_admin');

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <div className="pointer-events-none fixed top-1/4 -right-1/4 w-[500px] h-[500px] bg-brand-primary/10 blur-[120px] rounded-full" />
      <div className="pointer-events-none fixed -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full" />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e1e21',
            color: '#ededed',
            border: '1px solid rgba(250, 204, 21, 0.2)',
          },
        }}
      />

      <aside
        className={`glass border-r border-brand-primary/10 w-64 flex-shrink-0 transition-transform duration-300 relative z-20 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 md:relative md:translate-x-0 flex flex-col`}
      >
        <div className="p-6 border-b border-brand-primary/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 bg-brand-primary rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-lg">A</span>
            </div>
            <span className="text-lg font-black tracking-tighter">
              AUTOKRAN<span className="text-brand-primary">.UZ</span>
            </span>
          </div>
          <p className="text-xs text-foreground/50 font-medium">
            {session.displayName} ·{' '}
            <span className="text-brand-primary">{roleLabel}</span>
          </p>
          <button
            type="button"
            className="md:hidden absolute top-5 right-4 p-2 rounded-full hover:bg-brand-primary/10"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.nameKey}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? 'bg-brand-primary text-black shadow-lg shadow-brand-primary/20'
                    : 'text-foreground/60 hover:text-foreground hover:bg-brand-surface'
                }`}
              >
                <Icon size={18} />
                {t(item.nameKey)}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-brand-primary/10 space-y-2">
          <AdminLanguageSwitcher />
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-foreground/60 hover:text-foreground hover:bg-brand-surface transition-all font-semibold text-sm"
          >
            <LogOut size={18} />
            {t('logout')}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <header className="glass md:hidden px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-brand-surface"
          >
            <Menu size={22} />
          </button>
          <span className="font-black tracking-tight">{t('panelTitle')}</span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
