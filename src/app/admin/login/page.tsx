'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { routing } from '@/i18n/routing';

export default function AdminLogin() {
  const router = useRouter();

  useEffect(() => {
    const savedLocale =
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1] || routing.defaultLocale;

    const locale = routing.locales.includes(savedLocale as (typeof routing.locales)[number])
      ? savedLocale
      : routing.defaultLocale;

    router.replace(`/${locale}?admin=login`);
  }, [router]);

  return null;
}
