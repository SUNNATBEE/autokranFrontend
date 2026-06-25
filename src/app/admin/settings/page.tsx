'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Globe, Save, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
  const t = useTranslations('Admin.settings');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/admin/settings');
        if (res.data) {
          setValue('phoneNumbers', res.data.phoneNumbers?.join(', ') || '');
          setValue('telegramBot', res.data.telegramBot || '');
          setValue('address', res.data.address || '');
          setValue('seoTitle', res.data.seoTitle || '');
          setValue('seoDescription', res.data.seoDescription || '');
        }
      } catch {
        toast.error(t('toast.loadError'));
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [setValue]);

  const onSubmit = async (data: Record<string, string>) => {
    const payload = {
      ...data,
      phoneNumbers: data.phoneNumbers
        ? data.phoneNumbers.split(',').map((p: string) => p.trim())
        : [],
    };

    try {
      await axios.post('/api/admin/settings', payload);
      toast.success(t('toast.saveSuccess'));
    } catch {
      toast.error(t('toast.saveError'));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <span className="loading loading-spinner loading-lg text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="inline-block px-4 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-full mb-4">
        <span className="text-brand-primary font-bold text-xs tracking-widest uppercase">
          {t('badge')}
        </span>
      </div>
      <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3 mb-2">
        <Settings className="text-brand-primary" size={32} />
        {t('title')}
      </h1>
      <p className="text-foreground/50 mb-8">{t('description')}</p>

      <div className="premium-card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-2 text-brand-primary font-bold text-sm uppercase tracking-widest">
            <Globe size={18} />
            {t('contactSection')}
          </div>

          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">
              {t('phoneNumbers')}
            </span>
            <input
              {...register('phoneNumbers')}
              className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 px-5 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all font-medium"
              placeholder="+998 90 123 45 67"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">
              {t('telegram')}
            </span>
            <input
              {...register('telegramBot')}
              className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 px-5 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all font-medium"
              placeholder="https://t.me/..."
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">
              {t('address')}
            </span>
            <textarea
              {...register('address')}
              rows={3}
              className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 px-5 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all font-medium resize-none"
            />
          </label>

          <div className="border-t border-brand-primary/10 pt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-4">
              {t('seoSection')}
            </p>

            <label className="block space-y-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">
                {t('seoTitle')}
              </span>
              <input
                {...register('seoTitle')}
                className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 px-5 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all font-medium"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">
                {t('seoDescription')}
              </span>
              <textarea
                {...register('seoDescription')}
                rows={3}
                className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 px-5 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all font-medium resize-none"
              />
            </label>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-2 !px-8 disabled:opacity-50"
            >
              <Save size={18} />
              {isSubmitting ? t('saving') : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
