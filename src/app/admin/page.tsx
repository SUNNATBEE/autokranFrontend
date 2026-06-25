'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Truck, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function AdminDashboard() {
  const t = useTranslations('Admin.overview');
  const router = useRouter();
  const [stats, setStats] = useState({ sponsors: 0, cranes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [sponsorsRes, cranesRes] = await Promise.all([
          axios.get('/api/admin/sponsors'),
          axios.get('/api/admin/cranes'),
        ]);
        setStats({
          sponsors: sponsorsRes.data.length,
          cranes: cranesRes.data.length,
        });
      } catch (error: unknown) {
        const err = error as { response?: { status?: number } };
        if (err.response?.status === 401) {
          router.push('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center py-24 text-foreground/50">
        {t('loading')}
      </div>
    );
  }

  const statCards = [
    {
      name: t('stats.sponsors'),
      value: stats.sponsors,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: t('stats.cranes'),
      value: stats.cranes,
      icon: Truck,
      color: 'bg-green-500',
    },
    {
      name: t('stats.settings'),
      value: t('stats.active'),
      icon: Settings,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-black tracking-tight mb-8">{t('title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="premium-card flex items-center gap-4">
              <div className={`p-4 rounded-xl ${stat.color} text-white`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground/50">
                  {stat.name}
                </p>
                <p className="text-2xl font-black">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="premium-card">
        <h2 className="text-xl font-black mb-4">{t('welcomeTitle')}</h2>
        <p className="text-foreground/60 leading-relaxed">{t('welcomeText')}</p>
      </div>
    </div>
  );
}
