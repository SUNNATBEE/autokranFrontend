/** Phone country definitions for the international phone input. */
export interface PhoneCountry {
  id: string;
  name: string;
  flag: string;
  dial: string; // e.g. "+998"
  len: number; // national number length (digits after the dial code)
  placeholder: string; // grouped example of the national part
  groups: number[]; // digit grouping for display, e.g. [2,3,2,2]
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { id: "uz", name: "O'zbekiston", flag: "🇺🇿", dial: "+998", len: 9, placeholder: "90 123 45 67", groups: [2, 3, 2, 2] },
  { id: "ru", name: "Rossiya", flag: "🇷🇺", dial: "+7", len: 10, placeholder: "912 345 67 89", groups: [3, 3, 2, 2] },
  { id: "kz", name: "Qozog'iston", flag: "🇰🇿", dial: "+7", len: 10, placeholder: "701 234 56 78", groups: [3, 3, 2, 2] },
  { id: "tj", name: "Tojikiston", flag: "🇹🇯", dial: "+992", len: 9, placeholder: "93 123 4567", groups: [2, 3, 4] },
];

export const DEFAULT_COUNTRY = PHONE_COUNTRIES[0];

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** True when the national part has exactly the digits the country expects. */
export function isPhoneComplete(country: PhoneCountry, national: string): boolean {
  return digitsOnly(national).length === country.len;
}

/** Group the national digits for readable display (e.g. "90 123 45 67"). */
export function formatNational(country: PhoneCountry, national: string): string {
  const d = digitsOnly(national).slice(0, country.len);
  const parts: string[] = [];
  let i = 0;
  for (const g of country.groups) {
    if (i >= d.length) break;
    parts.push(d.slice(i, i + g));
    i += g;
  }
  if (i < d.length) parts.push(d.slice(i));
  return parts.join(" ");
}

/** Full international number sent to the backend, e.g. "+998 90 123 45 67". */
export function fullPhone(country: PhoneCountry, national: string): string {
  return `${country.dial} ${formatNational(country, national)}`.trim();
}
