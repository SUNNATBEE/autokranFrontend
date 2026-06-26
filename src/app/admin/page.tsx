'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Users,
  Truck,
  Phone,
  Eye,
  Loader2,
  TrendingUp,
} from 'lucide-react';

interface Stats {
  cranes: { total: number; available: number };
  sponsors: number;
  orders: {
    total: number;
    newThisWeek: number;
    byStatus: Record<string, number>;
  };
  contacts: { total: number; new: number };
  visits: { total: number; daily: { day: string; count: number }[] };
  recentLeads: {
    id: string;
    name: string;
    phone: string;
    location: string;
    craneModel: string | null;
    status: string;
    createdAt: string;
  }[];
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/15 text-blue-400',
  contacted: 'bg-amber-500/15 text-amber-400',
  completed: 'bg-green-500/15 text-green-400',
  cancelled: 'bg-red-500/15 text-red-400',
};

export default function AdminDashboard() {
  const t = useTranslations('Admin.overview');
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get<Stats>('/api/admin/stats');
        setStats(res.data);
      } catch (error: unknown) {
        const err = error as { response?: { status?: number } };
        if (err.response?.status === 401) {
          router.push('/admin/login');
          return;
        }
        setErrored(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center py-24 text-foreground/40">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (errored || !stats) {
    return (
      <div className="text-center py-24 text-foreground/40">{t('error')}</div>
    );
  }

  const cards = [
    {
      name: t('leads'),
      value: stats.orders.total,
      sub: `+${stats.orders.newThisWeek} ${t('thisWeek')}`,
      icon: TrendingUp,
      color: 'bg-blue-500',
    },
    {
      name: t('visitors'),
      value: stats.visits.total,
      sub: t('visitorsTotal'),
      icon: Eye,
      color: 'bg-purple-500',
    },
    {
      name: t('availableCranes'),
      value: `${stats.cranes.available}/${stats.cranes.total}`,
      sub: t('totalCranes'),
      icon: Truck,
      color: 'bg-green-500',
    },
    {
      name: t('newContacts'),
      value: stats.contacts.new,
      sub: `${stats.contacts.total} ${t('leads').toLowerCase()}`,
      icon: Phone,
      color: 'bg-amber-500',
    },
  ];

  const maxVisit = Math.max(1, ...stats.visits.daily.map((d) => d.count));
  const statusEntries = Object.entries(stats.orders.byStatus);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-black tracking-tight mb-8">{t('title')}</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.name} className="premium-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">
                  {c.name}
                </span>
                <span className={`p-2 rounded-lg ${c.color} text-white`}>
                  <Icon size={16} />
                </span>
              </div>
              <p className="text-3xl font-black leading-none">{c.value}</p>
              <p className="text-xs text-foreground/40 mt-2">{c.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Visits chart */}
        <div className="premium-card lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black">{t('visitors')}</h2>
            <span className="text-xs text-foreground/40">{t('analyticsNote')}</span>
          </div>
          {stats.visits.daily.length === 0 ? (
            <p className="text-sm text-foreground/40 py-8 text-center">—</p>
          ) : (
            <div className="flex items-end gap-1.5 h-40">
              {stats.visits.daily.map((d) => (
                <div
                  key={d.day}
                  className="flex-1 flex flex-col items-center gap-1 group"
                  title={`${d.day}: ${d.count}`}
                >
                  <div className="w-full flex items-end h-full">
                    <div
                      className="w-full bg-brand-primary/70 group-hover:bg-brand-primary rounded-t transition-all"
                      style={{ height: `${(d.count / maxVisit) * 100}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-foreground/30">
                    {d.day.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders by status */}
        <div className="premium-card">
          <h2 className="font-black mb-5">{t('ordersByStatus')}</h2>
          {statusEntries.length === 0 ? (
            <p className="text-sm text-foreground/40">{t('noLeads')}</p>
          ) : (
            <div className="space-y-3">
              {statusEntries.map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      statusColors[status] ?? 'bg-foreground/10 text-foreground/50'
                    }`}
                  >
                    {status}
                  </span>
                  <span className="font-black">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent leads */}
      <div className="premium-card">
        <h2 className="font-black mb-5">{t('recentLeads')}</h2>
        {stats.recentLeads.length === 0 ? (
          <p className="text-sm text-foreground/40">{t('noLeads')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-foreground/40 border-b border-brand-primary/10">
                  <th className="py-2 pr-4 font-bold">{t('colName')}</th>
                  <th className="py-2 pr-4 font-bold">{t('colPhone')}</th>
                  <th className="py-2 pr-4 font-bold">{t('colLocation')}</th>
                  <th className="py-2 pr-4 font-bold">{t('colCrane')}</th>
                  <th className="py-2 pr-4 font-bold">{t('colStatus')}</th>
                  <th className="py-2 font-bold">{t('colDate')}</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-brand-primary/5 last:border-0"
                  >
                    <td className="py-3 pr-4 font-semibold">{lead.name}</td>
                    <td className="py-3 pr-4 text-foreground/60">{lead.phone}</td>
                    <td className="py-3 pr-4 text-foreground/60">{lead.location}</td>
                    <td className="py-3 pr-4 text-foreground/60">
                      {lead.craneModel ?? '—'}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                          statusColors[lead.status] ??
                          'bg-foreground/10 text-foreground/50'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 text-foreground/40 text-xs whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
