'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { NextIntlClientProvider } from 'next-intl';
import {
  DEFAULT_ADMIN_LOCALE,
  getAdminLocaleFromCookie,
  setAdminLocaleCookie,
  type AdminLocale,
} from '@/lib/admin-locale';

type AdminIntlContextValue = {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
};

const AdminIntlContext = createContext<AdminIntlContextValue | null>(null);

export function useAdminLocale() {
  const ctx = useContext(AdminIntlContext);
  if (!ctx) {
    throw new Error('useAdminLocale must be used within AdminIntlProvider');
  }
  return ctx;
}

export function AdminIntlProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>(DEFAULT_ADMIN_LOCALE);
  const [messages, setMessages] = useState<Record<string, unknown> | null>(null);

  const loadLocale = useCallback(async (next: AdminLocale) => {
    const mod = await import(`../../../messages/${next}.json`);
    setMessages(mod.default);
    setLocaleState(next);
    setAdminLocaleCookie(next);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next;
    }
  }, []);

  useEffect(() => {
    void loadLocale(getAdminLocaleFromCookie());
  }, [loadLocale]);

  const setLocale = useCallback(
    (next: AdminLocale) => {
      void loadLocale(next);
    },
    [loadLocale]
  );

  if (!messages) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="loading loading-spinner loading-lg text-brand-primary" />
      </div>
    );
  }

  return (
    <AdminIntlContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </AdminIntlContext.Provider>
  );
}
