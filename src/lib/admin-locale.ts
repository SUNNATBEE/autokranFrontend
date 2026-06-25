export const ADMIN_LOCALES = ['uz', 'ru', 'en'] as const;
export type AdminLocale = (typeof ADMIN_LOCALES)[number];
export const DEFAULT_ADMIN_LOCALE: AdminLocale = 'uz';

export function getAdminLocaleFromCookie(): AdminLocale {
  if (typeof document === 'undefined') return DEFAULT_ADMIN_LOCALE;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('NEXT_LOCALE='))
    ?.split('=')[1];
  return ADMIN_LOCALES.includes(match as AdminLocale)
    ? (match as AdminLocale)
    : DEFAULT_ADMIN_LOCALE;
}

export function setAdminLocaleCookie(locale: AdminLocale): void {
  document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000;SameSite=Lax`;
}

export function getDateLocale(locale: AdminLocale): string {
  const map: Record<AdminLocale, string> = {
    uz: 'uz-UZ',
    ru: 'ru-RU',
    en: 'en-US',
  };
  return map[locale];
}
