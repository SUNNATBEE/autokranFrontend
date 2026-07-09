"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

interface FaqItem {
  q: string;
  a: string;
}

export const Faq = () => {
  const t = useTranslations("Faq");
  const items = t.raw("items") as FaqItem[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-32 bg-brand-surface/30 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-brand-primary font-bold uppercase tracking-widest text-sm">
              {t("subtitle")}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mt-3">
              {t("title")}
            </h2>
          </div>

          <div className="space-y-4">
            {items.map((item, idx) => {
              const isOpen = open === idx;
              return (
                <article
                  key={idx}
                  className="bg-background border border-brand-primary/10 rounded-2xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-black text-base md:text-lg">
                      {item.q}
                    </span>
                    <ChevronDown
                      size={22}
                      className={`flex-shrink-0 text-brand-primary transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="px-5 md:px-6 pb-6 text-foreground/60 leading-relaxed">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
