'use client';

import { Globe } from 'lucide-react';
import { useState } from 'react';
import { useAdminLocale } from '@/components/admin/AdminIntlProvider';
import { ADMIN_LOCALES, type AdminLocale } from '@/lib/admin-locale';

const LOCALE_LABELS: Record<AdminLocale, { label: string; flag: string }> = {
  uz: { label: "O'zbek", flag: '🇺🇿' },
  ru: { label: 'Русский', flag: '🇷🇺' },
  en: { label: 'English', flag: '🇺🇸' },
};

export function AdminLanguageSwitcher() {
  const { locale, setLocale } = useAdminLocale();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-semibold text-foreground/60 hover:text-foreground hover:bg-brand-surface transition-all border border-transparent hover:border-brand-primary/20"
      >
        <Globe size={18} className="text-brand-primary shrink-0" />
        <span className="uppercase">{locale}</span>
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            aria-label="Close"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 right-0 bottom-full mb-2 bg-brand-surface border border-brand-primary/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
            {ADMIN_LOCALES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setLocale(code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-brand-primary/10 ${
                  locale === code
                    ? 'text-brand-primary bg-brand-primary/5'
                    : 'text-foreground/60'
                }`}
              >
                <span>{LOCALE_LABELS[code].flag}</span>
                {LOCALE_LABELS[code].label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
