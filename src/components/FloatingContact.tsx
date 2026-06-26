"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Send, X, MessageCircle, Plus } from "lucide-react";
import { companyInfo } from "@/constants";
import { useTranslations } from "next-intl";

/**
 * Floating, always-visible contact dock (bottom-right). One tap to reach the
 * company via WhatsApp / phone / Telegram — the single biggest lever for lead
 * conversion on mobile-heavy markets.
 */
export const FloatingContact = () => {
  const t = useTranslations("Floating");
  const [open, setOpen] = useState(false);

  const actions = [
    {
      key: "whatsapp",
      label: t("whatsapp"),
      href: `https://wa.me/${companyInfo.whatsapp}`,
      icon: MessageCircle,
      className: "bg-[#25D366] text-white",
    },
    {
      key: "telegram",
      label: t("telegram"),
      href: companyInfo.telegram,
      icon: Send,
      className: "bg-[#229ED9] text-white",
    },
    {
      key: "call",
      label: t("call"),
      href: `tel:+998${companyInfo.phoneRaw}`,
      icon: Phone,
      className: "bg-brand-primary text-black",
    },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open &&
          actions.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.a
                key={a.key}
                href={a.href}
                target={a.key === "call" ? undefined : "_blank"}
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 10 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 group"
              >
                <span className="bg-brand-surface border border-brand-primary/10 text-foreground text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  {a.label}
                </span>
                <span
                  className={`w-12 h-12 rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform ${a.className}`}
                >
                  <Icon size={22} />
                </span>
              </motion.a>
            );
          })}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("label")}
        className="w-16 h-16 rounded-full bg-brand-primary text-black shadow-2xl shadow-brand-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform relative"
      >
        {!open && (
          <span className="absolute inset-0 rounded-full bg-brand-primary animate-ping opacity-30" />
        )}
        {open ? <X size={26} /> : <Plus size={26} className="relative" />}
      </button>
    </div>
  );
};
