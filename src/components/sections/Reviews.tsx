"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useTranslations } from "next-intl";

interface ReviewItem {
  name: string;
  company: string;
  text: string;
}

export const Reviews = () => {
  const t = useTranslations("Reviews");
  const items = t.raw("items") as ReviewItem[];

  return (
    <section id="reviews" className="py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-primary font-bold uppercase tracking-widest text-sm">
            {t("subtitle")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter mt-3">
            {t("title")}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((r, idx) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="premium-card flex flex-col"
            >
              <Quote className="text-brand-primary/40 mb-4" size={36} />
              <p className="text-foreground/80 leading-relaxed flex-1">
                “{r.text}”
              </p>
              <div className="flex gap-1 my-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-brand-primary text-brand-primary"
                  />
                ))}
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-brand-primary/10">
                <div className="w-11 h-11 rounded-full bg-brand-primary text-black flex items-center justify-center font-black text-lg">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="font-black leading-tight">{r.name}</p>
                  <p className="text-xs text-foreground/50">{r.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
