"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import {
  PHONE_COUNTRIES,
  DEFAULT_COUNTRY,
  formatNational,
  fullPhone,
  isPhoneComplete,
  type PhoneCountry,
} from "@/lib/phone";

interface PhoneInputProps {
  /** Called on every change with the full international number and validity. */
  onChange: (full: string, valid: boolean) => void;
  /** Show the "incomplete number" hint (e.g. after a failed submit). */
  showError?: boolean;
  errorText?: string;
}

export const PhoneInput = ({ onChange, showError, errorText }: PhoneInputProps) => {
  const [country, setCountry] = useState<PhoneCountry>(DEFAULT_COUNTRY);
  const [national, setNational] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const valid = isPhoneComplete(country, national);

  // Close the country dropdown on outside click.
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pickCountry = (c: PhoneCountry) => {
    setCountry(c);
    setOpen(false);
    const reformatted = formatNational(c, national);
    setNational(reformatted);
    onChange(fullPhone(c, reformatted), isPhoneComplete(c, reformatted));
  };

  const handleInput = (raw: string) => {
    const grouped = formatNational(country, raw);
    setNational(grouped);
    onChange(fullPhone(country, grouped), isPhoneComplete(country, grouped));
  };

  return (
    <div ref={wrapRef} className="relative">
      <div
        className={`flex items-stretch bg-foreground/5 border rounded-2xl overflow-hidden transition-all ${
          showError && !valid
            ? "border-red-500/60"
            : "border-foreground/10 focus-within:border-brand-primary"
        }`}
      >
        {/* Country selector */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 px-3 sm:px-4 border-r border-foreground/10 hover:bg-foreground/5 transition-colors flex-shrink-0"
        >
          <span className="text-xl leading-none">{country.flag}</span>
          <span className="font-bold text-sm">{country.dial}</span>
          <ChevronDown size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {/* National number */}
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={national}
          onChange={(e) => handleInput(e.target.value)}
          placeholder={country.placeholder}
          className="flex-1 min-w-0 bg-transparent py-4 px-4 outline-none font-medium text-foreground"
        />
      </div>

      {/* Dropdown list */}
      {open && (
        <div className="absolute z-20 mt-2 left-0 w-full max-w-xs bg-brand-surface border border-brand-primary/20 rounded-2xl shadow-2xl overflow-hidden">
          {PHONE_COUNTRIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => pickCountry(c)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-brand-primary/10 transition-colors text-left"
            >
              <span className="text-xl">{c.flag}</span>
              <span className="flex-1 font-medium text-sm">{c.name}</span>
              <span className="text-foreground/50 text-sm font-bold">{c.dial}</span>
              {c.id === country.id && <Check size={16} className="text-brand-primary" />}
            </button>
          ))}
        </div>
      )}

      {showError && !valid && errorText && (
        <p className="text-red-500 text-xs mt-1.5 px-1 font-medium">{errorText}</p>
      )}
    </div>
  );
};
