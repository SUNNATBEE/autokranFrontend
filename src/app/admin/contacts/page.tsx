'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useLocale, useTranslations } from 'next-intl';
import {
  PhoneCall,
  Phone,
  RefreshCw,
  User,
} from 'lucide-react';
import { getDateLocale, type AdminLocale } from '@/lib/admin-locale';

interface ContactRequest {
  id: string;
  name: string;
  phone: string;
  status: string;
  createdAt: string;
}

const STATUS_VALUES = ['new', 'contacted', 'completed', 'cancelled'] as const;

export default function ContactsDashboardPage() {
  const t = useTranslations('Admin.contacts');
  const locale = useLocale() as AdminLocale;
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const statusOptions = useMemo(
    () =>
      STATUS_VALUES.map((value) => ({
        value,
        label: t(`status.${value}`),
      })),
    [t]
  );

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<ContactRequest[]>('/api/admin/contacts');
      setContacts(res.data);
    } catch {
      toast.error(t('toast.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Initial load. `loading` already starts true, so we fetch directly here
  // (setState only after the await) and guard against an unmount race.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await axios.get<ContactRequest[]>('/api/admin/contacts');
        if (active) setContacts(res.data);
      } catch {
        if (active) toast.error(t('toast.loadError'));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [t]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.patch('/api/admin/contacts', { id, status });
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
      toast.success(t('toast.statusUpdated'));
    } catch {
      toast.error(t('toast.statusError'));
    }
  };

  const dateLocale = getDateLocale(locale);

  return (
    <div className="max-w-7xl mx-auto relative">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <div className="inline-block px-4 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-full mb-4">
            <span className="text-brand-primary font-bold text-xs tracking-widest uppercase">
              {t('badge')}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
            <PhoneCall className="text-brand-primary" size={32} />
            {t('title')}
          </h1>
          <p className="text-foreground/50 mt-2 max-w-lg">{t('description')}</p>
        </div>
        <button
          type="button"
          onClick={fetchContacts}
          disabled={loading}
          className="btn-primary flex items-center justify-center gap-2 !px-6 !py-3 text-sm disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          {t('refresh')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: t('stats.total'),
            value: contacts.length,
            accent: 'text-brand-primary',
          },
          {
            label: t('stats.new'),
            value: contacts.filter((o) => o.status === 'new').length,
            accent: 'text-sky-400',
          },
          {
            label: t('stats.inProgress'),
            value: contacts.filter((o) => o.status === 'contacted').length,
            accent: 'text-orange-400',
          },
        ].map((stat) => (
          <div key={stat.label} className="premium-card !p-5">
            <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <p className={`text-4xl font-black ${stat.accent}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <span className="loading loading-spinner loading-lg text-brand-primary" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="premium-card text-center py-16">
          <PhoneCall size={56} className="mx-auto text-foreground/20 mb-4" />
          <h2 className="text-xl font-black mb-2">{t('empty.title')}</h2>
          <p className="text-foreground/50 max-w-md mx-auto">
            {t('empty.description')}
          </p>
        </div>
      ) : (
        <div className="premium-card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-brand-primary/10 text-foreground/40 text-xs uppercase tracking-widest">
                  <th className="px-6 py-4 font-bold">{t('table.customer')}</th>
                  <th className="px-6 py-4 font-bold">{t('table.contact')}</th>
                  <th className="px-6 py-4 font-bold">{t('table.date')}</th>
                  <th className="px-6 py-4 font-bold">{t('table.status')}</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="border-b border-brand-primary/5 hover:bg-brand-primary/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-bold">
                        <User size={16} className="text-brand-primary" />
                        {contact.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-2 text-brand-primary hover:underline font-medium"
                      >
                        <Phone size={16} />
                        {contact.phone}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/50 whitespace-nowrap">
                      {new Date(contact.createdAt).toLocaleString(dateLocale)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        className="bg-brand-surface border border-brand-primary/20 rounded-xl px-3 py-2 text-sm font-medium focus:border-brand-primary focus:outline-none"
                        value={contact.status}
                        onChange={(e) => updateStatus(contact.id, e.target.value)}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
